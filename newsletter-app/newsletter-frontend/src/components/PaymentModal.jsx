import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import {
  Elements,
  CardElement,
  useStripe,
  useElements
} from '@stripe/react-stripe-js';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = loadStripe(stripeKey);

// ✅ Stripe Checkout Form
const CheckoutForm = ({ clientSecret, onSuccess, onError }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [message, setMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setIsLoading(true);
    setMessage('Processing payment...');

    const { error, paymentIntent } = await stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: elements.getElement(CardElement),
      },
    });

    if (error) {
      setMessage(error.message);
      onError();
    } else if (paymentIntent.status === 'succeeded') {
      setMessage('Payment succeeded!');
      onSuccess();
    } else {
      setMessage('Unexpected status: ' + paymentIntent.status);
      onError();
    }

    setIsLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="p-3 border rounded-md bg-gray-50">
        <CardElement className="w-full" />
      </div>
      <button
        type="submit"
        disabled={isLoading || !stripe}
        className="w-full bg-green-600 text-white py-2 rounded-md font-semibold hover:bg-green-700 transition disabled:opacity-50"
      >
        {isLoading ? 'Processing...' : 'Pay ₹999'}
      </button>
      {message && (
        <div
          className={`p-3 rounded-md text-sm ${
            message.includes('succeeded')
              ? 'bg-green-100 text-green-700'
              : 'bg-red-100 text-red-700'
          }`}
        >
          {message}
        </div>
      )}
    </form>
  );
};

// ✅ Full Modal Component
export const PaymentModal = ({ clientSecret, email, name }) => {
  const [paymentCompleted, setPaymentCompleted] = useState(false);
  const [error, setError] = useState(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handlePaymentSuccess = async () => {
    try {
      await new Promise((resolve) => setTimeout(resolve, 2000));
      const { data } = await axios.get('/api/user/profile', {
      });

      // localStorage.setItem('token', data.token);
      // axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
      setPaymentCompleted(true);

      setTimeout(() => navigate('/newsletters'), 2000);
    } catch {
      setError('Payment succeeded but login failed. Please login manually.');
    }
  };

  const handlePaymentError = () => {
    setError('Payment failed. Please try again.');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center px-4 z-50">
      <div className="bg-white rounded-xl p-6 sm:p-8 w-full max-w-md shadow-lg">
        <h2 className="text-2xl font-bold mb-3 text-center text-gray-800">
          Complete Premium Registration
        </h2>
        <p className="text-sm text-gray-600 mb-5 text-center">
          You're signing up as <span className="font-medium">{name}</span> (<span className="italic">{email}</span>)
        </p>

        {paymentCompleted ? (
          <div className="bg-green-100 text-green-700 p-4 rounded text-center">
            ✅ Payment successful! Redirecting...
          </div>
        ) : error ? (
          <div className="bg-red-100 text-red-700 p-4 rounded text-center mb-4">
            ❌ {error}
          </div>
        ) : (
          <Elements stripe={stripePromise} options={{ clientSecret }}>
            <CheckoutForm
              clientSecret={clientSecret}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          </Elements>
        )}

        <div className="mt-6 text-xs text-gray-500 text-center">
          You’ll be charged ₹999/month. Cancel anytime from your profile settings.
        </div>
      </div>
    </div>
  );
};
