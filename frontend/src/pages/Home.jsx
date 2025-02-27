import "./Home.css";
import React, { useState, useEffect } from "react";
import SearchBar from "../components/SearchBar.jsx";
import ProductCard from "../components/ProductCard.jsx";
import ComparisonTable from "../components/ComparisonTable.jsx";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar.jsx";

const Home = () => {
  const [results, setResults] = useState([]);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [loading, setLoading] = useState(false); // Add loading state

  const handleSelectProduct = (product) => {
    if (!selectedProducts.includes(product)) {
      setSelectedProducts([...selectedProducts, product]);
    }
  };

  useEffect(() => {
    console.log("API Response:", results);
  }, [results]);

  return (
    <>
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="home-container"
      >
        <SearchBar setResults={setResults} setLoading={setLoading} />
        
        {loading && <p className="loading-text">Loading products...</p>} 

        <div className="product-list">
          {results.map((product, index) => (
            <div key={index} className="product-item" onClick={() => handleSelectProduct(product)}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
        
        <ComparisonTable selectedProducts={selectedProducts} />
      </motion.div>
    </>
  );
};

export default Home;
