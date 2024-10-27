import { useState } from "react";

const SearchBar = () => {
  const [location, setLocation] = useState("");
  const [dates, setDates] = useState("");
  const [query, setQuery] = useState("");

  const handleSearch = () => {
    console.log("Searching for:", { location, dates, query });
  };

  return (
    <section className="search-bar-container">
      <label>
        Location
        <input
          type="text"
          placeholder="Choose a location"
          aria-label="location" 
          value={location}
          onChange={(e) => setLocation(e.target.value)}
        />
      </label>
      <label>
        Dates
      <input
        type="text"
        placeholder="Choose dates"
        aria-label="dates" 
        value={dates}
        onChange={(e) => setDates(e.target.value)}
      />
      </label>
      <label>
        Search music events
      <input
        type="text"
        placeholder="Search music events"
        aria-label="search box" 
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      </label>
      <button onClick={handleSearch}>Search</button>
    </section>
  );
};

export default SearchBar;
