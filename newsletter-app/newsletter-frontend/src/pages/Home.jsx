import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Home = () => {
  const { user } = useAuth();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="text-center max-w-2xl mx-auto p-6">
        <h1 className="text-4xl font-bold text-gray-800 mb-6">
          Welcome to Premium Newsletter
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          {user 
            ? `Hello, ${user.name}! Access your newsletters.`
            : 'Sign up to access free and premium newsletters.'}
        </p>
        
        <div className="flex gap-4 justify-center">
          {user ? (
            <>
              <Link
                to="/newsletters"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                View Newsletters
              </Link>
              <Link
                to="/profile"
                className="bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition"
              >
                My Profile
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
              >
                Login
              </Link>
              <Link
                to="/register"
                className="bg-gray-800 text-white px-6 py-3 rounded-lg hover:bg-gray-900 transition"
              >
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </div>
  );
};