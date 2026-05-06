const express = require('express');
const router = express.Router();
const {
  getRestaurants,
  getNearby,
  getRestaurantById,
  getRecommendations,
} = require('../controllers/restaurant.controller');
const { protect } = require('../middlewares/auth.middleware');

router.get('/', getRestaurants);
router.get('/nearby', getNearby);
router.get('/recommend', protect, getRecommendations);
router.get('/:id', getRestaurantById);

module.exports = router;
