const Restaurant = require('../models/Restaurant.model');
const { fetchNearbyRestaurants } = require('../services/overpass.service');
const { recommendRestaurants } = require('../services/recommendation.service');

// GET /api/v1/restaurants?page=1&limit=12&cuisine=italian&rating=4
exports.getRestaurants = async (req, res, next) => {
  try {
    const { page = 1, limit = 12, cuisine, rating, price } = req.query;
    const filter = {};
    if (cuisine) filter.cuisine = { $regex: cuisine, $options: 'i' };
    if (rating) filter.rating = { $gte: parseFloat(rating) };
    if (price) filter.priceRange = price;

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const [restaurants, total] = await Promise.all([
      Restaurant.find(filter).skip(skip).limit(parseInt(limit)).sort({ rating: -1 }),
      Restaurant.countDocuments(filter),
    ]);

    res.json({
      success: true,
      message: 'Restaurants fetched',
      data: { restaurants, total, page: parseInt(page), pages: Math.ceil(total / parseInt(limit)) },
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/restaurants/nearby?lat=&lng=
exports.getNearby = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    if (!lat || !lng) {
      return res.status(400).json({ success: false, message: 'lat and lng are required', data: null });
    }
    const restaurants = await fetchNearbyRestaurants(parseFloat(lat), parseFloat(lng));
    res.json({ success: true, message: 'Nearby restaurants fetched', data: restaurants });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/restaurants/:id
exports.getRestaurantById = async (req, res, next) => {
  try {
    const restaurant = await Restaurant.findById(req.params.id);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found', data: null });
    }
    res.json({ success: true, message: 'Restaurant fetched', data: restaurant });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/restaurants/recommend (protected)
exports.getRecommendations = async (req, res, next) => {
  try {
    const { lat, lng } = req.query;
    let restaurants;

    if (lat && lng) {
      restaurants = await fetchNearbyRestaurants(parseFloat(lat), parseFloat(lng));
    } else {
      restaurants = await Restaurant.find().limit(50);
    }

    const recommendations = recommendRestaurants(restaurants, req.user.preferences);
    res.json({ success: true, message: 'Recommendations ready', data: recommendations.slice(0, 20) });
  } catch (err) {
    next(err);
  }
};
