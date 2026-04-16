import React, { useState } from 'react';
import './App.css';
import { Home } from './pages/Home';
import { ProductList } from './pages/ProductList';
import { ProductDetail } from './pages/ProductDetail';

type Page = 'home' | 'products' | 'detail';

function App() {
  const [page, setPage] = useState<Page>('home');
  const [selectedProductId, setSelectedProductId] = useState<number | null>(null);

  const handleSelectProduct = (id: number) => {
    setSelectedProductId(id);
    setPage('detail');
  };

  return (
    <div className="App app-shell">
      <header className="App-header">
        <div className="brand">
          <h1>UI API Demo</h1>
          <p>Explore product pages powered by a public dummy API.</p>
        </div>
        <nav className="top-nav">
          <button
            type="button"
            className={page === 'home' ? 'nav-button active' : 'nav-button'}
            onClick={() => setPage('home')}
          >
            Home
          </button>
          <button
            type="button"
            className={page === 'products' ? 'nav-button active' : 'nav-button'}
            onClick={() => setPage('products')}
          >
            Product List
          </button>
        </nav>
      </header>

      <main className="content">
        {page === 'home' && <Home />}
        {page === 'products' && <ProductList onSelect={handleSelectProduct} />}
        {page === 'detail' && selectedProductId !== null && (
          <ProductDetail
            productId={selectedProductId}
            onBack={() => setPage('products')}
          />
        )}
      </main>
    </div>
  );
}

export default App;
