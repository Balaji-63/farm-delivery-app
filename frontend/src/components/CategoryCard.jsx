import { useNavigate } from 'react-router-dom';

export default function CategoryCard({ category }) {
  const navigate = useNavigate();

  return (
    <div 
      onClick={() => navigate(`/category/${category.id}`)}
      className="bg-white rounded-2xl shadow-sm hover:shadow-lg transition-all cursor-pointer border border-gray-100 overflow-hidden text-center group"
    >
      <div className="h-40 w-full overflow-hidden bg-gray-50 flex items-center justify-center p-4">
        <img 
          src={category.category_image || '/placeholder-category.png'} 
          alt={category.category_name}
          className="h-full object-contain group-hover:scale-110 transition-transform duration-300"
        />
      </div>
      <div className="p-4 border-t border-gray-50">
        <h3 className="font-bold text-gray-800 text-lg">{category.category_name}</h3>
        <p className="text-sm text-gray-500 mt-1">{category.product_count} Products</p>
      </div>
    </div>
  );
}