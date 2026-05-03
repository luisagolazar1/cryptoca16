import { useState } from 'react';

export default function SearchBar({ onSearch, placeholder = "Buscar criptomoneda..." }) {
  const [query, setQuery] = useState('');

  const handleChange = (e) => {
    const value = e.target.value.toUpperCase();
    setQuery(value);
    onSearch(value);
  };

  return (
    <div className="relative">
      <div className="relative">
        <span className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500">🔍</span>
        <input
          type="text"
          value={query}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full pl-12 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-500 focus:border-green-500 focus:outline-none transition-all"
        />
      </div>
      {query && (
        <button
          onClick={() => {
            setQuery('');
            onSearch('');
          }}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
        >
          ✕
        </button>
      )}
    </div>
  );
}
