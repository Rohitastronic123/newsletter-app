import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { PaymentModal } from './PaymentModal';

export const UserProfile = () => {
  const { user, logout, upgradeToPremium, renewPremium } = useAuth();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [clientSecret, setClientSecret] = useState('');
  const [message, setMessage] = useState('');
  console.log(
    user
  )
  const handleUpgrade = async () => {
    try {
      const  data  = await upgradeToPremium();
      setClientSecret(data.clientSecret);
      setShowPaymentModal(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to initiate upgrade');
    }
  };

  const handleRenew = async () => {
    try {
      const { data } = await renewPremium();
      setClientSecret(data.clientSecret);
      setShowPaymentModal(true);
    } catch (err) {
      setMessage(err.response?.data?.message || 'Failed to initiate renewal');
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">Your Profile</h2>
      
      <div className="mb-4">
        <p><span className="font-semibold">Name:</span> {user?.name}</p>
        <p><span className="font-semibold">Email:</span> {user?.email}</p>
        <p>
          <span className="font-semibold">Account Type:</span>{' '}
          <span className={`${
            user?.role === 'premium' ? 'text-premium' : 'text-free'
          } font-bold`}>
            {user?.role?.toUpperCase()}
          </span>
        </p>
      </div>
      
      {message && (
        <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">{message}</div>
      )}
      
      {user?.role === 'free' ? (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Upgrade to Premium</h3>
          <p className="mb-4 text-gray-600">
            Get access to all premium content for just ₹999/month
          </p>
          <button
            onClick={handleUpgrade}
            className="w-full bg-premium text-white py-2 px-4 rounded bg-green-700"
          >
            Upgrade Now
          </button>
        </div>
      ) : (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Premium Membership</h3>
          <p className="mb-4 text-gray-600">
            You have full access to all premium content
          </p>
          <button
            onClick={handleRenew}
            className="w-full bg-premium text-white py-2 px-4 rounded bg-green-700"
          >
            Renew Subscription
          </button>
        </div>
      )}
      
      <button
        onClick={logout}
        className="w-full mt-4 bg-gray-200 text-gray-800 py-2 px-4 rounded hover:bg-gray-300"
      >
        Logout
      </button>
      
      {showPaymentModal && (
        <PaymentModal 
          clientSecret={clientSecret}
          email={user?.email}
          name={user?.name}
          onClose={() => setShowPaymentModal(false)}
        />
      )}
    </div>
  );
};