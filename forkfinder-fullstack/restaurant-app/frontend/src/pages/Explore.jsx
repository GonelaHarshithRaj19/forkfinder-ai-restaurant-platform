import { useState, useEffect, useCallback } from 'react';
import RestaurantCard from '../components/RestaurantCard';
import FilterBar from '../components/FilterBar';
import Loader from '../components/Loader';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';

const Explore = () => {
  const { user } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({ cuisine: '', rating: '', price: '' });
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [favorites, setFavorites] = useState(new Set(user?.favorites || []));

  const fetchRestaurants = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({ page, limit: 12 });
      if (filters.cuisine) params.append('cuisine', filters.cuisine);
      if (filters.rating) params.append('rating', filters.rating);
      if (filters.price) params.append('price', filters.price);

      const { data } = await api.get(`/restaurants?${params}`);
      setRestaurants(data.data.restaurants);
      setTotalPages(data.data.pages);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page, filters]);

  useEffect(() => { fetchRestaurants(); }, [fetchRestaurants]);

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleFavorite = async (id) => {
    if (!user) return alert('Please login to save favorites');
    try {
      await api.post(`/user/favorites/${id}`);
      setFavorites((prev) => {
        const next = new Set(prev);
        next.has(id) ? next.delete(id) : next.add(id);
        return next;
      });
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="explore-page">
      <div className="explore-header">
        <h1 className="page-title">Explore Restaurants</h1>
        <p className="page-subtitle">Browse, filter, and discover your next favourite spot.</p>
      </div>

      <FilterBar filters={filters} onChange={handleFilterChange} />

      {loading ? (
        <Loader count={12} />
      ) : restaurants.length > 0 ? (
        <>
          <div className="restaurant-grid">
            {restaurants.map((r) => (
              <RestaurantCard
                key={r._id}
                restaurant={r}
                onFavorite={handleFavorite}
                isFavorited={favorites.has(r._id)}
              />
            ))}
          </div>

          {/* Pagination */}
          <div className="pagination">
            <button
              className="btn-outline"
              disabled={page <= 1}
              onClick={() => setPage((p) => p - 1)}
            >
              ← Prev
            </button>
            <span className="page-info">Page {page} of {totalPages}</span>
            <button
              className="btn-outline"
              disabled={page >= totalPages}
              onClick={() => setPage((p) => p + 1)}
            >
              Next →
            </button>
          </div>
        </>
      ) : (
        <div className="empty-state">
          <p>No restaurants match your filters.</p>
          <button className="btn-outline" onClick={() => handleFilterChange({ cuisine: '', rating: '', price: '' })}>
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default Explore;
