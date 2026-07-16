import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import ProductCard from '../components/ProductCard';
import { ShoppingCart, Check, ShieldCheck, Truck, Plus, Minus } from 'lucide-react';

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const [prodRes, relRes] = await Promise.all([
          axios.get(`http://localhost:8000/api/storefront/products/detail/${id}`),
          axios.get(`http://localhost:8000/api/storefront/products/${id}/related`)
        ]);
        setProduct(prodRes.data);
        setRelated(relRes.data);
      } catch (err) {
        console.error("Failed to fetch product", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProductData();
  }, [id]);

  const handleAddToCart = async (buyNow = false) => {
    const token = localStorage.getItem('token');
    if (!token) {
      alert("Please login to add items to your cart.");
      navigate('/login');
      return;
    }

    setAdding(true);
    try {
      await axios.post('http://localhost:8000/api/cart/', 
        { product_id: product.id, quantity },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      if (buyNow) {
        navigate('/cart');
      } else {
        alert("Added to cart successfully!");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to add to cart");
    } finally {
      setAdding(false);
    }
  };

  if (loading) return <div className="p-20 text-center font-bold text-xl">Loading Product...</div>;
  if (!product) return <div className="p-20 text-center font-bold text-xl">Product Not Found</div>;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      <main className="flex-grow max-w-7xl mx-auto px-4 py-12 w-full">
        {/* Product Section */}
        <div className="bg-white rounded-2xl shadow-sm p-6 md:p-10 mb-12 grid grid-cols-1 md:grid-cols-2 gap-10">
          
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-square bg-gray-100 rounded-xl overflow-hidden border border-gray-200">
              <img src={product.product_image} alt={product.product_name} className="w-full h-full object-cover" />
            </div>
            {/* Thumbnail Gallery (Simulated using the main image for now) */}
            <div className="grid grid-cols-4 gap-4">
              {[1, 2, 3].map((thumb) => (
                <div key={thumb} className="aspect-square rounded-lg border border-gray-200 overflow-hidden opacity-60 hover:opacity-100 cursor-pointer transition">
                   <img src={product.product_image} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <h1 className="text-3xl font-extrabold text-gray-900 mb-2">{product.product_name}</h1>
            <p className="text-green-600 font-semibold mb-4 text-lg">Category: Farm Fresh</p>
            <div className="text-4xl font-bold text-gray-900 mb-6">₹{product.price} <span className="text-lg text-gray-500 font-normal">/ {product.unit}</span></div>
            
            <p className="text-gray-600 mb-6 leading-relaxed">{product.description}</p>
            
            <div className="space-y-3 mb-8">
              <div className="flex items-center text-gray-700"><Check className="w-5 h-5 text-green-500 mr-3"/> 100% Organic & Freshly Sourced</div>
              <div className="flex items-center text-gray-700"><ShieldCheck className="w-5 h-5 text-green-500 mr-3"/> Quality Inspected</div>
              <div className="flex items-center text-gray-700"><Truck className="w-5 h-5 text-green-500 mr-3"/> Delivered within 12 Hours</div>
            </div>

            <div className="flex items-center mb-8 space-x-6">
              <span className="font-semibold text-gray-900">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={() => setQuantity(Math.max(1, quantity - 1))} className="p-2 hover:bg-gray-100 text-gray-600"><Minus className="w-5 h-5"/></button>
                <span className="px-4 font-bold text-gray-900">{quantity}</span>
                <button onClick={() => setQuantity(quantity + 1)} className="p-2 hover:bg-gray-100 text-gray-600"><Plus className="w-5 h-5"/></button>
              </div>
              <span className="text-sm text-gray-500">({product.stock} Available)</span>
            </div>

            <div className="flex space-x-4">
              <button 
                onClick={() => handleAddToCart(false)}
                disabled={adding}
                className="flex-1 bg-green-100 text-green-700 hover:bg-green-200 font-bold py-4 rounded-xl flex justify-center items-center transition"
              >
                <ShoppingCart className="w-5 h-5 mr-2" /> Add to Cart
              </button>
              <button 
                onClick={() => handleAddToCart(true)}
                disabled={adding}
                className="flex-1 bg-green-600 text-white hover:bg-green-500 font-bold py-4 rounded-xl transition"
              >
                Buy Now
              </button>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <section>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 border-b pb-4">Similar Farm Products</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
              {related.map(rel => <ProductCard key={rel.id} product={rel} />)}
            </div>
          </section>
        )}
      </main>
      <Footer />
    </div>
  );
}