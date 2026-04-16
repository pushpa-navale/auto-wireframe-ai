import React from 'react';

export function Home() {
  return (
    <div className="page-body">
      <h2>Welcome to UI API Demo</h2>
      <p>
        This demo app includes a product list page using a dummy API.
        Browse products, view details, and see how a small React page flow works.
      </p>
      <div className="feature-list">
        <div className="feature-card">
          <h3>Product List</h3>
          <p>Fetches a product catalog from a public dummy API.</p>
        </div>
        <div className="feature-card">
          <h3>Product Detail</h3>
          <p>View pricing, category, rating, and description for each product.</p>
        </div>
      </div>
    </div>
  );
}
