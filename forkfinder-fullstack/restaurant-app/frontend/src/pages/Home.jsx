import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useGeolocation from '../hooks/useGeolocation';
import RestaurantCard from '../components/RestaurantCard';
import Loader from '../components/Loader';
import MapComponent from '../components/MapComponent';
import api from '../utils/api';

const Home = () => {
  const { location, error, loading: geoLoading, getLocation } = useGeolocation();
  const [restaurants, setRestaurants] = useState([]);
  const [fetching, setFetching] = useState(false);
  const [fetchError, setFetchError] = useState('');
  const navigate = useNavigate();

  const handleDetect = async () => {
    getLocation();
  };

  // Once location is available, fetch restaurants
  const fetchNearby = async (loc) => {
    setFetching(true);
    setFetchError('');
    try {
      const { data } = await api.get(`/restaurants/nearby?lat=${loc.lat}&lng=${loc.lng}`);
      setRestaurants(data.data || []);
    } catch (err) {
      setFetchError('Failed to fetch nearby restaurants. Try again.');
    } finally {
      setFetching(false);
    }
  };

  // Trigger fetch when location updates
  useState(() => {
    if (location) fetchNearby(location);
  }, [location]);

  // Re-check on location change
  const prevLocation = useState(null);
  if (location && location !== prevLocation[0]) {
    prevLocation[1](location);
    fetchNearby(location);
  }

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="hero">
        <div className="hero-content">
          <h1 className="hero-title">
            Discover <span className="accent">great food</span><br />near you, right now.
          </h1>
          <p className="hero-subtitle">
            Real restaurants, real locations — powered by OpenStreetMap and personalized just for you.
          </p>
          <div className="hero-actions">
            <button
              className="btn-primary btn-large"
              onClick={handleDetect}
              disabled={geoLoading}
            >
              {geoLoading ? '📍 Detecting...' : '📍 Detect My Location'}
            </button>
            <button className="btn-outline btn-large" onClick={() => navigate('/explore')}>
              Browse All →
            </button>
          </div>
          {error && <p className="error-msg">{error}</p>}
          {fetchError && <p className="error-msg">{fetchError}</p>}
        </div>
        <div className="hero-visual">
          <div className="hero-badge">🍜 Live data from OpenStreetMap</div>
          <div className="hero-badge">🤖 AI-powered recommendations</div>
          <div className="hero-badge">🗺️ Interactive map view</div>
        </div>
      </section>

      {/* Map + Results */}
      {location && (
        <>
          <section className="map-section">
            <h2 className="section-title">Restaurants near you</h2>
            <MapComponent userLocation={location} restaurants={restaurants} />
          </section>

          <section className="nearby-section">
            {fetching ? (
              <Loader count={6} />
            ) : restaurants.length > 0 ? (
              <>
                <p className="result-count">{restaurants.length} restaurants found within 1km</p>
                <div className="restaurant-grid">
                  {restaurants.slice(0, 6).map((r) => (
                    <RestaurantCard key={r._id} restaurant={r} />
                  ))}
                </div>
                <div className="center-cta">
                  <button className="btn-primary" onClick={() => navigate('/explore')}>
                    Explore All →
                  </button>
                </div>
              </>
            ) : (
              <p className="empty-msg">No restaurants found nearby. Try moving to a different area.</p>
            )}
          </section>
        </>
      )}

      {/* Features */}
      {!location && (
        <section className="features-section">
          <div className="features-grid">
            <div className="feature-card">
              <span className="feature-icon">📡</span>
              <h3>Real-time data</h3>
              <p>Restaurants pulled live from OpenStreetMap's global database.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">🤖</span>
              <h3>Smart recommendations</h3>
              <p>Weighted scoring based on your cuisine preferences and price range.</p>
            </div>
            <div className="feature-card">
              <span className="feature-icon">❤️</span>
              <h3>Save your favorites</h3>
              <p>Build a personal list of restaurants you love.</p>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Home;
