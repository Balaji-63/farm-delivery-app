import { useState, useEffect } from 'react';
import axios from 'axios';
import Navbar from '../components/Navbar';
import CategoryCard from '../components/CategoryCard';
import ProductCard from '../components/ProductCard';
import { Search } from 'lucide-react';
import Footer from '../components/Footer';

export default function Home() {
  const [categories, setCategories] = useState([]);
  const [featured, setFeatured] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [catRes, featRes] = await Promise.all([
          axios.get('http://localhost:8000/api/storefront/categories'),
          axios.get('http://localhost:8000/api/storefront/products/featured')
        ]);
        setCategories(catRes.data);
        setFeatured(featRes.data);
      } catch (err) {
        console.error("Failed to fetch homepage data", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return setSearchResults(null);
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:8000/api/storefront/search?q=${searchQuery}`);
      setSearchResults(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  if (loading && categories.length === 0) return <div className="p-20 text-center text-xl font-bold">Loading Fresh Farm Products...</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans flex flex-col">
      <Navbar />

      {/* Hero & Search Banner */}
      <div className="bg-green-700 text-white py-16 px-4 text-center">
        <h1 className="text-4xl font-extrabold mb-4">Fresh From The Village To Your Home</h1>
        <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">100% Organic, fresh meat, dairy, and farm produce delivered daily.</p>
        
        <form onSubmit={handleSearch} className="max-w-2xl mx-auto relative">
          <input 
            type="text" 
            placeholder="Search for Milk, Chicken, Sea Fish..." 
            className="w-full bg-white text-gray-900 placeholder-gray-500 px-6 py-4 rounded-full shadow-lg focus:outline-none focus:ring-4 focus:ring-green-300 transition-all"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button type="submit" className="absolute right-2 top-2 bottom-2 bg-green-600 hover:bg-green-500 text-white p-3 rounded-full transition">
            <Search className="w-5 h-5" />
          </button>
        </form>
      </div>

      <main className="max-w-7xl mx-auto px-4 py-12 flex-grow">
        {searchResults ? (
          /* Search Results View */
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Search Results for "{searchQuery}"</h2>
              <button onClick={() => setSearchResults(null)} className="text-blue-600 hover:underline">Clear Search</button>
            </div>
            {searchResults.length === 0 ? (
              <p className="text-gray-500">No products found. Try a different term.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {searchResults.map(p => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        ) : (
          /* Standard Home View */
          <>
            {/* Shop by Category */}
            <section className="mb-16">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop By Category</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {categories.map(cat => <CategoryCard key={cat.id} category={cat} />)}
              </div>
            </section>

            {/* Featured Products */}
            <section>
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Farm Fresh</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {featured.map(product => <ProductCard key={product.id} product={product} />)}
              </div>
            </section>
          </>
        )}
      </main>

      {/* The Footer is now correctly placed here! */}
      <Footer />
    </div>
  );
}