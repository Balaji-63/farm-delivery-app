import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const navigate = useNavigate();
  const [mobile_number, setMobileNumber] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loginMethod, setLoginMethod] = useState('password'); 

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8000/api/login', { mobile_number, password });
      localStorage.setItem('token', res.data.access_token);
      navigate('/home');
    } catch (err) {
      setError(err.response?.data?.detail || 'Invalid mobile number or password');
    }
  };

  return (
    <div className="p-6 flex flex-col justify-center bg-white min-h-screen">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-green-700">Farm Fresh</h1>
        <p className="text-gray-500 mt-2">Log in to your account</p>
      </div>

      {error && <div className="bg-red-100 text-red-600 p-2 rounded mb-4 text-sm text-center">{error}</div>}

      <form onSubmit={handleLogin} className="flex flex-col gap-4">
        <input 
          type="text" 
          placeholder="Mobile Number" 
          required 
          className="border p-3 rounded-lg focus:outline-green-500 bg-gray-50"
          value={mobile_number}
          onChange={(e) => setMobileNumber(e.target.value)}
        />
        
        {loginMethod === 'password' ? (
          <input 
            type="password" 
            placeholder="Password" 
            required 
            className="border p-3 rounded-lg focus:outline-green-500 bg-gray-50"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        ) : (
          <input 
            type="text" 
            placeholder="Enter OTP" 
            className="border p-3 rounded-lg focus:outline-green-500 bg-gray-50"
          />
        )}

        <div className="flex justify-between items-center text-sm">
          <button type="button" onClick={() => setLoginMethod(loginMethod === 'password' ? 'otp' : 'password')} className="text-green-600 font-medium">
            Login with {loginMethod === 'password' ? 'OTP' : 'Password'}
          </button>
          <a href="#" className="text-gray-500 hover:text-green-600">Forgot Password?</a>
        </div>

        <button type="submit" className="bg-green-600 text-white p-3 rounded-lg font-bold mt-4 hover:bg-green-700 transition">
          Login
        </button>
      </form>

      <p className="text-center mt-8 text-sm text-gray-600">
        New to Farm Fresh? <Link to="/register" className="text-green-600 font-bold">Register Now</Link>
      </p>
    </div>
  );
}