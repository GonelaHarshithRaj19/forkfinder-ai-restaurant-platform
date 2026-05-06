const User = require('../models/User.model');
const Restaurant = require('../models/Restaurant.model');

// POST /api/v1/user/favorites/:id
exports.toggleFavorite = async (req, res, next) => {
  try {
    const user = req.user;
    const restaurantId = req.params.id;

    const restaurant = await Restaurant.findById(restaurantId);
    if (!restaurant) {
      return res.status(404).json({ success: false, message: 'Restaurant not found', data: null });
    }

    const isFav = user.favorites.includes(restaurantId);
    const update = isFav
      ? { $pull: { favorites: restaurantId } }
      : { $addToSet: { favorites: restaurantId } };

    const updated = await User.findByIdAndUpdate(user._id, update, { new: true }).populate('favorites');
    res.json({
      success: true,
      message: isFav ? 'Removed from favorites' : 'Added to favorites',
      data: updated.favorites,
    });
  } catch (err) {
    next(err);
  }
};

// GET /api/v1/user/favorites
exports.getFavorites = async (req, res, next) => {
  try {
    const user = await User.findById(req.user._id).populate('favorites');
    res.json({ success: true, message: 'Favorites fetched', data: user.favorites });
  } catch (err) {
    next(err);
  }
};

// PUT /api/v1/user/preferences
exports.updatePreferences = async (req, res, next) => {
  try {
    const { cuisines, priceRange } = req.body;
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      { preferences: { cuisines, priceRange } },
      { new: true }
    );
    res.json({ success: true, message: 'Preferences updated', data: updated.preferences });
  } catch (err) {
    next(err);
  }
};
