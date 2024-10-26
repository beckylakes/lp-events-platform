import { useState } from 'react';

const SearchBar = () => {
  const [location, setLocation] = useState('');
  const [dates, setDates] = useState('');
  const [query, setQuery] = useState('');

  const handleSearch = () => {
    console.log('Searching for:', { location, dates, query });
  };

  return (
    <div className="search-bar-container">
      <input
        type="text"
        placeholder="Choose a location"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      />
      <input
        type="text"
        placeholder="Choose dates"
        value={dates}
        onChange={(e) => setDates(e.target.value)}
      />
      <input
        type="text"
        placeholder="Search music events"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;
