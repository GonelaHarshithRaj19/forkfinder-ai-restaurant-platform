/**
 * Hybrid content-based recommendation engine.
 * Score = (Cuisine Match × 0.5) + (Normalized Rating × 0.3) + (Price Compatibility × 0.2)
 */

const WEIGHTS = { cuisine: 0.5, rating: 0.3, price: 0.2 };

const PRICE_MAP = { $: 1, '$$': 2, '$$$': 3, '$$$$': 4 };

const normalizeCuisineMatch = (restaurantCuisine, preferredCuisines) => {
  if (!preferredCuisines || preferredCuisines.length === 0) return 0.5; // neutral
  const cuisine = (restaurantCuisine || '').toLowerCase();
  const match = preferredCuisines.some((c) => cuisine.includes(c.toLowerCase()));
  return match ? 1 : 0;
};

const normalizeRating = (rating) => {
  if (!rating) return 0.5; // neutral if unknown
  return Math.min(Math.max((rating - 1) / 4, 0), 1); // scale 1-5 to 0-1
};

const normalizePriceMatch = (restaurantPrice, preferredPrice) => {
  if (!preferredPrice || !restaurantPrice) return 0.5;
  const rp = PRICE_MAP[restaurantPrice] || 2;
  const pp = PRICE_MAP[preferredPrice] || 2;
  const diff = Math.abs(rp - pp);
  if (diff === 0) return 1;
  if (diff === 1) return 0.6;
  if (diff === 2) return 0.3;
  return 0;
};

const scoreRestaurant = (restaurant, userPreferences) => {
  const { cuisines = [], priceRange = '$$' } = userPreferences || {};

  const cuisineScore = normalizeCuisineMatch(restaurant.cuisine, cuisines);
  const ratingScore = normalizeRating(restaurant.rating);
  const priceScore = normalizePriceMatch(restaurant.priceRange, priceRange);

  const total =
    cuisineScore * WEIGHTS.cuisine +
    ratingScore * WEIGHTS.rating +
    priceScore * WEIGHTS.price;

  return parseFloat(total.toFixed(4));
};

const recommendRestaurants = (restaurants, userPreferences) => {
  return restaurants
    .map((r) => ({
      ...r.toObject(),
      score: scoreRestaurant(r, userPreferences),
    }))
    .sort((a, b) => b.score - a.score);
};

module.exports = { recommendRestaurants, scoreRestaurant };
