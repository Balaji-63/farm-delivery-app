import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import ProductCard from '../components/ProductCard';
import { ArrowLeft } from 'lucide-react';

export default function CategoryView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const res = await axios.get(`http://localhost:8000/api/storefront/categories/${id}/products`);
        setProducts(res.data);
      } catch (err) {
        console.error("Failed to load products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchCategoryProducts();
  }, [id]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">
        <button onClick={() => navigate(-1)} className="flex items-center text-gray-600 hover:text-green-600 mb-6 font-medium transition">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </button>

        {loading ? (
          <div className="py-20 text-center font-semibold text-gray-500">Loading products...</div>
        ) : (
          <>
            <div className="mb-8 border-b pb-4">
              <h1 className="text-3xl font-bold text-gray-900">Category Products</h1>
              <p className="text-gray-500 mt-2">{products.length} items available</p>
            </div>
            
            {products.length === 0 ? (
              <div className="text-center py-20 bg-white rounded-2xl border border-gray-200">
                <p className="text-gray-500 text-lg">No products available in this category right now.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {products.map(product => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </div>
  );
}