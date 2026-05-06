import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import MapComponent from '../components/MapComponent';
import Loader from '../components/Loader';
import { getRestaurantImage, formatRating } from '../utils/helpers';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const RestaurantDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [restaurant, setRestaurant] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isFav, setIsFav] = useState(false);
  const [favLoading, setFavLoading] = useState(false);

  useEffect(() => {
    const fetch = async () => {
      try {
        const { data } = await api.get(`/restaurants/${id}`);
        setRestaurant(data.data);
        if (user?.favorites) setIsFav(user.favorites.includes(id));
      } catch {
        navigate('/explore');
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [id]);

  const handleFavorite = async () => {
    if (!user) return navigate('/login');
    setFavLoading(true);
    try {
      await api.post(`/user/favorites/${id}`);
      setIsFav((prev) => !prev);
    } catch (err) {
      console.error(err);
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) return <Loader count={1} type="spinner" />;
  if (!restaurant) return null;

  const image = getRestaurantImage(restaurant.cuisine);

  return (
    <div className="detail-page">
      <div className="detail-hero" style={{ backgroundImage: `url(${image})` }}>
        <div className="detail-hero-overlay">
          <button className="back-btn" onClick={() => navigate(-1)}>← Back</button>
          <div className="detail-hero-content">
            <span className="cuisine-tag">{restaurant.cuisine || 'Various'}</span>
            <h1 className="detail-name">{restaurant.name}</h1>
            <div className="detail-meta">
              <span className="detail-rating">★ {formatRating(restaurant.rating)}</span>
              <span className="detail-price">{restaurant.priceRange}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="detail-body">
        <div className="detail-info">
          <section className="info-section">
            <h2>About</h2>
            <div className="info-grid">
              <div className="info-item">
                <span className="info-label">Address</span>
                <span className="info-value">{restaurant.address?.full || 'N/A'}</span>
              </div>
              {restaurant.phone && (
                <div className="info-item">
                  <span className="info-label">Phone</span>
                  <a href={`tel:${restaurant.phone}`} className="info-value link">{restaurant.phone}</a>
                </div>
              )}
              {restaurant.website && (
                <div className="info-item">
                  <span className="info-label">Website</span>
                  <a href={restaurant.website} target="_blank" rel="noreferrer" className="info-value link">
                    Visit website →
                  </a>
                </div>
              )}
              {restaurant.openingHours && (
                <div className="info-item">
                  <span className="info-label">Hours</span>
                  <span className="info-value">{restaurant.openingHours}</span>
                </div>
              )}
            </div>
          </section>

          <button
            className={`fav-button ${isFav ? 'favorited' : ''}`}
            onClick={handleFavorite}
            disabled={favLoading}
          >
            {isFav ? '♥ Saved to Favorites' : '♡ Add to Favorites'}
          </button>
        </div>

        <div className="detail-map">
          <h2>Location</h2>
          <MapComponent singleRestaurant={restaurant} />
        </div>
      </div>
    </div>
  );
};

export default RestaurantDetail;
