const axios = require('axios');
const Restaurant = require('../models/Restaurant.model');

const CACHE_TTL_MINUTES = 10;
const RADIUS = 0.05;      // ~5km bounding box
const MAX_DISTANCE = 5000; // 5km in metres for MongoDB queries

const buildOverpassQuery = (lat, lng) => {
  const south = lat - RADIUS;
  const north = lat + RADIUS;
  const west  = lng - RADIUS;
  const east  = lng + RADIUS;
  // Single line — no whitespace issues
  return `[out:json][timeout:25];node["amenity"="restaurant"](${south},${west},${north},${east});out body;`;
};

const normalizeRestaurant = (node) => {
  const tags = node.tags || {};
  return {
    osmId: String(node.id),
    name: tags.name || tags['name:en'] || 'Unnamed Restaurant',
    cuisine: tags.cuisine ? tags.cuisine.split(';')[0].trim() : 'various',
    address: {
      street: tags['addr:street'] || '',
      city:   tags['addr:city']   || '',
      postcode: tags['addr:postcode'] || '',
      full: [tags['addr:housenumber'], tags['addr:street'], tags['addr:city']]
        .filter(Boolean).join(', ') || 'Address not available',
    },
    location: {
      type: 'Point',
      coordinates: [node.lon, node.lat],
    },
    rating:     tags.rating ? parseFloat(tags.rating) : parseFloat((Math.random() * 1.5 + 3.5).toFixed(1)),
    priceRange: tags['price:range'] || ['$', '$$', '$$$'][Math.floor(Math.random() * 3)],
    phone:        tags.phone || tags['contact:phone']   || null,
    website:      tags.website || tags['contact:website'] || null,
    openingHours: tags.opening_hours || null,
    tags:     Object.keys(tags),
    cachedAt: new Date(),
  };
};

const fetchNearbyRestaurants = async (lat, lng) => {
  // Return cached results if fresh data exists within 5km
  const existingCount = await Restaurant.countDocuments({
    location: {
      $near: {
        $geometry:   { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: MAX_DISTANCE,
      },
    },
    cachedAt: { $gt: new Date(Date.now() - CACHE_TTL_MINUTES * 60 * 1000) },
  });

  if (existingCount > 0) {
    console.log(`[Cache HIT] ${existingCount} restaurants found in DB`);
    return Restaurant.find({
      location: {
        $near: {
          $geometry:   { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: MAX_DISTANCE,
        },
      },
    }).limit(50);
  }

  // Fetch fresh from Overpass using GET (more reliable than POST)
  console.log(`[Overpass] Fetching restaurants near ${lat}, ${lng}`);
  const query = buildOverpassQuery(lat, lng);
  const url   = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;

  const response = await axios.get(url, {
    timeout: 30000,
    headers: { 'User-Agent': 'ForkFinder/1.0 (portfolio project)' },
  });

  const nodes = response.data?.elements || [];
  console.log(`[Overpass] Got ${nodes.length} raw nodes`);

  if (nodes.length === 0) {
    console.warn('[Overpass] No restaurants returned — area may have sparse OSM data');
    return [];
  }

  // Deduplicate by name + rounded coordinates
  const seen   = new Set();
  const unique = nodes.filter((node) => {
    const key = `${node.tags?.name || node.id}_${node.lat?.toFixed(3)}_${node.lon?.toFixed(3)}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });

  // Upsert into MongoDB
  const normalized = unique.map(normalizeRestaurant);
  const ops = normalized.map((r) => ({
    updateOne: {
      filter: { osmId: r.osmId },
      update: { $set: r },
      upsert: true,
    },
  }));

  if (ops.length > 0) {
    await Restaurant.bulkWrite(ops);
    console.log(`[MongoDB] Upserted ${ops.length} restaurants`);
  }

  return Restaurant.find({
    location: {
      $near: {
        $geometry:   { type: 'Point', coordinates: [lng, lat] },
        $maxDistance: MAX_DISTANCE,
      },
    },
  }).limit(50);
};

module.exports = { fetchNearbyRestaurants };