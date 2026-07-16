import { Link } from 'react-router-dom';
import { ShoppingCart } from 'lucide-react';

export default function ProductCard({ product }) {
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition group">
      {/* Clickable Image */}
      <Link to={`/product/${product.id}`} className="block relative overflow-hidden aspect-square bg-gray-50">
        <img 
          src={product.product_image} 
          alt={product.product_name}
          className="w-full h-full object-cover group-hover:scale-105 transition duration-300" 
        />
      </Link>
      
      <div className="p-4">
        {/* Clickable Title */}
        <Link to={`/product/${product.id}`}>
          <h3 className="font-bold text-gray-900 mb-1 hover:text-green-600 transition">{product.product_name}</h3>
        </Link>
        <p className="text-gray-500 text-sm mb-3">Farm Fresh</p>
        
        <div className="flex justify-between items-center mt-4">
          <div>
            <span className="font-extrabold text-lg text-gray-900">₹{product.price}</span>
            <span className="text-xs text-gray-500 ml-1">/ {product.unit}</span>
          </div>
          {/* Add to Cart button (For now, it redirects to the details page where the real button is) */}
          <Link to={`/product/${product.id}`} className="bg-green-100 text-green-700 hover:bg-green-600 hover:text-white p-2 rounded-lg transition font-semibold flex items-center gap-2 text-sm">
            <ShoppingCart className="w-4 h-4" /> Add
          </Link>
        </div>
      </div>
    </div>
  );
}