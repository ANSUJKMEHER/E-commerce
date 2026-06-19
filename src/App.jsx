import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetch('https://fakestoreapi.com/products')
      .then(res => res.json())
      .then(data => {
        setProducts(data);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error fetching products", err);
        setLoading(false);
      });
  }, []);

  const categories = ['All', ...new Set(products.map(p => p.category))];

  const filteredProducts = products.filter(p => {
    const matchesCategory = activeCategory === 'All' || p.category === activeCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="app">
      <header className="header">
        <h1>SRM STORE</h1>
      </header>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>Loading products...</div>
      ) : (
        <>
          <div className="controls">
            <input 
              type="text" 
              placeholder="Search products..." 
              className="search-bar"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
            <div className="filters">
              <select 
                className="category-dropdown"
                value={activeCategory} 
                onChange={(e) => setActiveCategory(e.target.value)}
              >
                {categories.map(category => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid">
            {filteredProducts.map(product => (
              <div key={product.id} className="card">
                <img src={product.image} alt={product.title} loading="lazy" />
                <h3 className="title">{product.title}</h3>
                <div className="meta">
                  <span>${product.price.toFixed(2)}</span>
                  <span className="rating">★ {product.rating.rate}</span>
                </div>
              </div>
            ))}
          </div>
          
          {filteredProducts.length === 0 && (
            <div style={{ textAlign: 'center', marginTop: '20px' }}>No products found.</div>
          )}
        </>
      )}
    </div>
  );
}

export default App;
