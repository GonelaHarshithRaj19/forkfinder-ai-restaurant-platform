const SkeletonCard = () => (
  <div className="skeleton-card">
    <div className="skeleton skeleton-img" />
    <div className="skeleton-body">
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-text" />
      <div className="skeleton skeleton-text short" />
    </div>
  </div>
);

const Loader = ({ count = 6, type = 'cards' }) => {
  if (type === 'spinner') {
    return (
      <div className="loader-center">
        <div className="spinner" />
        <p className="loader-text">Loading...</p>
      </div>
    );
  }
  return (
    <div className="restaurant-grid">
      {Array.from({ length: count }).map((_, i) => <SkeletonCard key={i} />)}
    </div>
  );
};

export default Loader;
