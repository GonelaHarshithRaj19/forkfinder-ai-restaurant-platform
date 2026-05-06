import { CUISINE_OPTIONS } from '../utils/helpers';

const FilterBar = ({ filters, onChange }) => {
  const update = (key, val) => onChange({ ...filters, [key]: val });

  return (
    <div className="filter-bar">
      <select
        className="filter-select"
        value={filters.cuisine || ''}
        onChange={(e) => update('cuisine', e.target.value)}
      >
        <option value="">All Cuisines</option>
        {CUISINE_OPTIONS.map((c) => (
          <option key={c} value={c.toLowerCase()}>{c}</option>
        ))}
      </select>

      <select
        className="filter-select"
        value={filters.rating || ''}
        onChange={(e) => update('rating', e.target.value)}
      >
        <option value="">Any Rating</option>
        <option value="4.5">4.5+ ★</option>
        <option value="4">4.0+ ★</option>
        <option value="3.5">3.5+ ★</option>
        <option value="3">3.0+ ★</option>
      </select>

      <select
        className="filter-select"
        value={filters.price || ''}
        onChange={(e) => update('price', e.target.value)}
      >
        <option value="">Any Price</option>
        <option value="$">$ Budget</option>
        <option value="$$">$$ Moderate</option>
        <option value="$$$">$$$ Upscale</option>
        <option value="$$$$">$$$$ Fine Dining</option>
      </select>

      <button
        className="btn-outline filter-reset"
        onClick={() => onChange({ cuisine: '', rating: '', price: '' })}
      >
        Reset
      </button>
    </div>
  );
};

export default FilterBar;
