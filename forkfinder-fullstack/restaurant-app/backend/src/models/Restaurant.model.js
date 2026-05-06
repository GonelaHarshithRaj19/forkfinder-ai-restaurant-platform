const mongoose = require('mongoose');

const restaurantSchema = new mongoose.Schema({
  osmId: { type: String, unique: true, sparse: true },
  name: { type: String, required: true, trim: true },
  cuisine: { type: String, default: 'various' },
  address: {
    street: String,
    city: String,
    postcode: String,
    full: String,
  },
  location: {
    type: { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
  },
  rating: { type: Number, default: null, min: 0, max: 5 },
  priceRange: { type: String, enum: ['$', '$$', '$$$', '$$$$'], default: '$$' },
  phone: String,
  website: String,
  openingHours: String,
  tags: [String],
  cachedAt: { type: Date, default: Date.now },
}, { timestamps: true });

restaurantSchema.index({ location: '2dsphere' });
restaurantSchema.index({ cuisine: 1 });
restaurantSchema.index({ rating: -1 });

module.exports = mongoose.model('Restaurant', restaurantSchema);
