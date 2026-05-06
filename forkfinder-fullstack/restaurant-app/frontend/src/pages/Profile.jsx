import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RestaurantCard from '../components/RestaurantCard';
import Loader from '../components/Loader';
import { CUISINE_OPTIONS } from '../utils/helpers';
import api from '../utils/api';

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [favorites, setFavorites] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState('favorites');

  useEffect(() => {
    if (!user) { navigate('/login'); return; }
    const fetchData = async () => {
      try {
        const [favRes, recRes] = await Promise.all([
          api.get('/user/favorites'),
          api.get('/restaurants/recommend'),
        ]);
        setFavorites(favRes.data.data || []);
        setRecommendations(recRes.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user]);

  const handleRemoveFavorite = async (id) => {
    await api.post(`/user/favorites/${id}`);
    setFavorites((prev) => prev.filter((r) => r._id !== id));
  };

  if (!user) return null;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <div className="profile-avatar">{user.name.charAt(0).toUpperCase()}</div>
        <div className="profile-info">
          <h1>{user.name}</h1>
          <p>{user.email}</p>
          {user.preferences?.cuisines?.length > 0 && (
            <div className="pref-tags">
              {user.preferences.cuisines.map((c) => (
                <span key={c} className="pref-tag">{c}</span>
              ))}
            </div>
          )}
        </div>
        <button className="btn-outline logout-btn" onClick={() => { logout(); navigate('/'); }}>
          Logout
        </button>
      </div>

      <div className="profile-tabs">
        <button className={`tab-btn ${tab === 'favorites' ? 'active' : ''}`} onClick={() => setTab('favorites')}>
          ♥ Favorites ({favorites.length})
        </button>
        <button className={`tab-btn ${tab === 'recommendations' ? 'active' : ''}`} onClick={() => setTab('recommendations')}>
          🤖 For You
        </button>
      </div>

      {loading ? (
        <Loader count={4} />
      ) : tab === 'favorites' ? (
        favorites.length > 0 ? (
          <div className="restaurant-grid">
            {favorites.map((r) => (
              <RestaurantCard
                key={r._id}
                restaurant={r}
                onFavorite={handleRemoveFavorite}
                isFavorited={true}
              />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No favorites yet. Start exploring!</p>
            <button className="btn-primary" onClick={() => navigate('/explore')}>Explore →</button>
          </div>
        )
      ) : (
        recommendations.length > 0 ? (
          <div className="restaurant-grid">
            {recommendations.map((r) => (
              <RestaurantCard key={r._id} restaurant={r} />
            ))}
          </div>
        ) : (
          <div className="empty-state">
            <p>No recommendations yet. Detect your location on the home page first.</p>
            <button className="btn-primary" onClick={() => navigate('/')}>Go Home →</button>
          </div>
        )
      )}
    </div>
  );
};

export default Profile;
