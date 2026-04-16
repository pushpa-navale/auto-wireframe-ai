import React, { useEffect, useState } from 'react';

export interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  thumbnail: string;
  category: string;
  rating: number;
}

interface ProductListProps {
  onSelect: (productId: number) => void;
}

export function ProductList({ onSelect }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch('https://dummyjson.com/products?limit=12')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Failed to load products');
        }
        return response.json();
      })
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch((error) => {
        setError(error.message || 'Unable to load products');
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="page-body">
      <h2>Product Catalog</h2>
      <p>Live product listing from a public dummy API.</p>

      {loading && <p className="loading-text">Loading products...</p>}
      {error && <p className="error-text">{error}</p>}

      <div className="product-grid">
        {products.map((product) => (
          <button
            key={product.id}
            type="button"
            className="product-card"
            onClick={() => onSelect(product.id)}
          >
            <img src={product.thumbnail} alt={product.title} className="product-thumbnail" />
            <div className="product-info">
              <h3>{product.title}</h3>
              <p>{product.category}</p>
              <div className="product-meta">
                <span>${product.price}</span>
                <span>⭐ {product.rating}</span>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}
