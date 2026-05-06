const CUISINE_IMAGES = {
  italian: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=600&q=80',
  pizza: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&q=80',
  indian: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80',
  chinese: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=600&q=80',
  japanese: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=600&q=80',
  sushi: 'https://images.unsplash.com/photo-1617196034183-421b4040ed20?w=600&q=80',
  mexican: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=600&q=80',
  burger: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80',
  american: 'https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&q=80',
  thai: 'https://images.unsplash.com/photo-1562565652-a0d8f0c59eb4?w=600&q=80',
  mediterranean: 'https://images.unsplash.com/photo-1544025162-d76694265947?w=600&q=80',
  french: 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=600&q=80',
  seafood: 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=600&q=80',
  vegetarian: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80',
  vegan: 'https://images.unsplash.com/photo-1540914124281-342587941389?w=600&q=80',
  korean: 'https://images.unsplash.com/photo-1590301157890-4810ed352733?w=600&q=80',
  turkish: 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=600&q=80',
  greek: 'https://images.unsplash.com/photo-1563379926898-05f4575a45d8?w=600&q=80',
  default: 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=600&q=80',
};

export const getRestaurantImage = (cuisine) => {
  if (!cuisine) return CUISINE_IMAGES.default;
  const key = cuisine.toLowerCase().split(';')[0].trim();
  return CUISINE_IMAGES[key] || CUISINE_IMAGES.default;
};

export const PRICE_LABELS = { $: 'Budget', '$$': 'Moderate', '$$$': 'Upscale', '$$$$': 'Fine Dining' };

export const formatRating = (rating) => (rating ? parseFloat(rating).toFixed(1) : 'N/A');

export const CUISINE_OPTIONS = [
  'Italian', 'Indian', 'Chinese', 'Japanese', 'Mexican',
  'American', 'Thai', 'Mediterranean', 'French', 'Korean',
  'Turkish', 'Seafood', 'Vegetarian', 'Burger', 'Sushi',
];
