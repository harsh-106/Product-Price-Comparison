const ProductCard = ({ product }) => {
  return (
    <div className="product-card">
      <h3>{product.itemName}</h3>
      <img src={product.image} alt={product.itemName} className="product-image" />

      <div className="prices">
        {product.details.amazon && (
          <a
            href={product.details.amazon.url}
            target="_blank"
            rel="noopener noreferrer"
            className="amazon-price"
          >
            Amazon: ₹{product.details.amazon.price}
          </a>
        )}

        {product.details.flipkart && (
          <a
            href={product.details.flipkart.url}
            target="_blank"
            rel="noopener noreferrer"
            className="flipkart-price"
          >
            Flipkart: ₹{product.details.flipkart.price}
          </a>
        )}
      </div>
    </div>
  );
};
export default ProductCard