import React, { useEffect, useState } from 'react';

interface ProductDetailProps {
  productId: number;
  onBack: () => void;
}

interface ProductDetailData {
  id: number;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  rating: number;
  stock: number;
}

export function ProductDetail({ productId, onBack }: ProductDetailProps) {
  const [product, setProduct] = useState<ProductDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch(`https://dummyjson.com/products/${productId}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load product details');
        }
        return response.json();
      })
      .then((data) => {
        setProduct(data);
      })
      .catch((error) => {
        setError(error.message || 'Unable to load product details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [productId]);

  return (
    <div className="page-body product-detail-page">
      <button type="button" className="back-button" onClick={onBack}>
        ← Back to products
      </button>
      {loading && <p className="loading-text">Loading product details...</p>}
      {error && <p className="error-text">{error}</p>}
      {product && (
        <div className="product-detail-card">
          <div className="product-detail-image-wrapper">
            <img
              src={product.images[0]}
              alt={product.title}
              className="product-detail-image"
            />
          </div>
          <div className="product-detail-info">
            <h2>{product.title}</h2>
            <p className="product-category">{product.category}</p>
            <p className="product-description">{product.description}</p>
            <div className="product-detail-meta">
              <span className="product-price">${product.price}</span>
              <span>⭐ {product.rating}</span>
              <span>In stock: {product.stock}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
