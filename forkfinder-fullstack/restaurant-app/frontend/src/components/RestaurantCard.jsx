import { Link } from 'react-router-dom';
import { getRestaurantImage, formatRating } from '../utils/helpers';

const RestaurantCard = ({ restaurant, onFavorite, isFavorited }) => {
  const image = getRestaurantImage(restaurant.cuisine);

  return (
    <div className="restaurant-card">
      <div className="card-image-wrap">
        <img src={image} alt={restaurant.name} className="card-image" loading="lazy" />
        <div className="card-cuisine-badge">{restaurant.cuisine || 'Various'}</div>
        {onFavorite && (
          <button
            className={`fav-btn ${isFavorited ? 'favorited' : ''}`}
            onClick={(e) => { e.preventDefault(); onFavorite(restaurant._id); }}
            aria-label="Toggle favorite"
          >
            {isFavorited ? '♥' : '♡'}
          </button>
        )}
      </div>
      <div className="card-body">
        <h3 className="card-title">{restaurant.name}</h3>
        <p className="card-address">{restaurant.address?.full || 'Address unavailable'}</p>
        <div className="card-meta">
          <span className="card-rating">
            <span className="star">★</span> {formatRating(restaurant.rating)}
          </span>
          <span className="card-price">{restaurant.priceRange || '$$'}</span>
        </div>
        {restaurant.score !== undefined && (
          <div className="card-score">
            Match score: <strong>{(restaurant.score * 100).toFixed(0)}%</strong>
          </div>
        )}
        <Link to={`/restaurant/${restaurant._id}`} className="card-cta">
          View Details →
        </Link>
      </div>
    </div>
  );
};

export default RestaurantCard;
