const express = require('express');
const router = express.Router();
const { toggleFavorite, getFavorites, updatePreferences } = require('../controllers/user.controller');
const { protect } = require('../middlewares/auth.middleware');

router.use(protect); // all user routes are protected

router.post('/favorites/:id', toggleFavorite);
router.get('/favorites', getFavorites);
router.put('/preferences', updatePreferences);

module.exports = router;
