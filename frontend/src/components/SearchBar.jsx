import { useState } from "react";
import axios from "axios";
import "../pages/SearchBar.css";

const SearchBar = ({ setResults, setLoading }) => {
  const [query, setQuery] = useState("");

  const handleSearch = async () => {
    if (!query.trim()) return; // Prevent empty search
    
    setLoading(true); // Show loading indicator

    try {
      const response = await axios.get(`http://localhost:3000/api/v1/search/${query}`);
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false); // Hide loading indicator
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button">
        Search
      </button>
    </div>
  );
};

export default SearchBar;
