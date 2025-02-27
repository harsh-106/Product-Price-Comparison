import React from "react";

const ComparisonTable = ({ selectedProducts }) => {
  if (selectedProducts.length === 0) return null;

  return (
    <div style={{ margin: "20px", overflowX: "auto" }}>
      <h2>Comparison Table</h2>
      <table style={{ width: "100%", borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Product</th>
            <th>Flipkart Price</th>
            <th>Amazon Price</th>
          </tr>
        </thead>
        <tbody>
          {selectedProducts.map((product, index) => (
            <tr key={index}>
              <td>{product.itemName}</td>
              <td>{product.details.flipkart?.price || "N/A"}</td>
              <td>{product.details.amazon?.price || "N/A"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default ComparisonTable;