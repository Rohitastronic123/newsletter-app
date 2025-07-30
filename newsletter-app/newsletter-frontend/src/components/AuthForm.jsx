import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const AuthForm = ({ type }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: 'free',
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login, register } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      if (type === 'login') {
        await login(formData.email, formData.password);
        navigate('/newsletters');
      } else {
        const result = await register(
          formData.name,
          formData.email,
          formData.password,
          formData.role
        );
        if (result.requiresPayment) {
          navigate('/payment', {
            state: {
              clientSecret: result.clientSecret,
              email: formData.email,
              name: formData.name,
            },
          });
        } else {
          navigate('/newsletters');
        }
      }
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full flex items-center justify-center px-4 ">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h2 className="text-3xl font-bold text-center text-gray-800 mb-6">
          {type === 'login' ? 'Login to Your Account' : 'Create an Account'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {type === 'register' && (
            <div>
              <label htmlFor="name" className="block mb-1 text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
          )}

          <div>
            <label htmlFor="email" className="block mb-1 text-gray-700">
              Email
            </label>
            <input
              type="email"
              name="email"
              id="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block mb-1 text-gray-700">
              Password
            </label>
            <input
              type="password"
              name="password"
              id="password"
              value={formData.password}
              onChange={handleChange}
              minLength={6}
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {type === 'register' && (
            <div>
              <label className="block mb-2 text-gray-700">Account Type</label>
              <div className="flex gap-4">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="free"
                    checked={formData.role === 'free'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Free</span>
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="role"
                    value="premium"
                    checked={formData.role === 'premium'}
                    onChange={handleChange}
                    className="mr-2"
                  />
                  <span>Premium (₹999/month)</span>
                </label>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold hover:bg-blue-700 transition disabled:opacity-50"
          >
            {isLoading
              ? 'Processing...'
              : type === 'login'
              ? 'Login'
              : 'Register'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600">
          {type === 'login' ? (
            <p>
              Don&apos;t have an account?{' '}
              <a
                href="/register"
                className="text-blue-600 font-medium hover:underline"
              >
                Register
              </a>
            </p>
          ) : (
            <p>
              Already have an account?{' '}
              <a
                href="/login"
                className="text-blue-600 font-medium hover:underline"
              >
                Login
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};
