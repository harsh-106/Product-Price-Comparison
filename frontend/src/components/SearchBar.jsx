import { useState } from "react";
import axios from "axios";
import "../pages/SearchBar.css";

const SearchBar = ({ setResults, setLoading }) => {
  const [query, setQuery] = useState("");
  const [isSearching, setIsSearching] = useState(false);

  const handleSearch = async () => {
    if (!query.trim() || isSearching) return; // Prevent empty search & multiple clicks
    
    setIsSearching(true);
    setLoading(true); // Show loading indicator

    try {
      const response = await axios.get(
        `https://product-price-comparison-v2w2.vercel.app/api/v1/search/${query}`
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      alert("Failed to fetch data. Please try again.");
    } finally {
      setIsSearching(false);
      setLoading(false); // Hide loading indicator
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSearch();
    }
  };

  return (
    <div className="search-container">
      <input
        type="text"
        placeholder="Search for products..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyPress={handleKeyPress}
        className="search-input"
      />
      <button onClick={handleSearch} className="search-button" disabled={isSearching}>
        {isSearching ? "Searching..." : "Search"}
      </button>
    </div>
  );
};

export default SearchBar;
