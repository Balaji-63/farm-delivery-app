import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '', mobile_number: '', email: '', village: '', password: '', confirm_password: ''
  });
  const [error, setError] = useState('');

  const handleChange = (e) => setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (formData.password !== formData.confirm_password) {
      return setError('Passwords do not match');
    }

    // 1. Clone the form data so we can modify it before sending
    const dataToSend = { ...formData };
    
    // 2. Remove 'confirm_password' as the backend doesn't expect it
    delete dataToSend.confirm_password;

    // 3. 🛠️ THE FIX: If email is empty, completely remove it from the payload
    // This allows FastAPI to fall back to its default 'None' value
    if (!dataToSend.email || dataToSend.email.trim() === '') {
      delete dataToSend.email;
    }

    try {
      await axios.post('http://localhost:8000/api/register', dataToSend);
      navigate('/login');
    } catch (err) {
      // 4. 🛠️ THE SAFETY NET: Handle the 422 error gracefully so React doesn't crash
      if (err.response?.status === 422) {
        setError('Please check your inputs. Ensure your email format is valid.');
      } else {
        const detail = err.response?.data?.detail;
        // Check if detail is a string to prevent the "Objects are not valid as a React child" error
        setError(typeof detail === 'string' ? detail : 'Registration failed');
      }
    }
  };

  return (
    <div className="p-6 h-full flex flex-col justify-center bg-white min-h-screen">
      <h2 className="text-2xl font-bold text-green-700 mb-2">Create Account</h2>
      <p className="text-gray-500 text-sm mb-6">Join for fresh farm products delivery</p>
      
      {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm">{error}</div>}
      
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <input name="full_name" onChange={handleChange} placeholder="Full Name" required className="border p-3 rounded-lg focus:outline-green-500 bg-gray-50" />
        <input name="mobile_number" onChange={handleChange} placeholder="Mobile Number" required className="border p-3 rounded-lg focus:outline-green-500 bg-gray-50" />
        <input name="email" type="email" onChange={handleChange} placeholder="Email (Optional)" className="border p-3 rounded-lg focus:outline-green-500 bg-gray-50" />
        <input name="village" onChange={handleChange} placeholder="Village/Location" required className="border p-3 rounded-lg focus:outline-green-500 bg-gray-50" />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" required className="border p-3 rounded-lg focus:outline-green-500 bg-gray-50" />
        <input name="confirm_password" type="password" onChange={handleChange} placeholder="Confirm Password" required className="border p-3 rounded-lg focus:outline-green-500 bg-gray-50" />
        
        <button type="submit" className="bg-green-600 text-white p-3 rounded-lg font-bold mt-2 hover:bg-green-700">
          Register
        </button>
      </form>
      <p className="text-center mt-6 text-sm text-gray-600">
        Already have an account? <Link to="/login" className="text-green-600 font-bold">Login</Link>
      </p>
    </div>
  );
}