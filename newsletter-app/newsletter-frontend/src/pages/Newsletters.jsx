import { useState, useEffect } from 'react';
import { NewsletterCard } from '../components/NewsletterCard';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';

export const Newsletters = () => {
  const [newsletters, setNewsletters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user } = useAuth();

  useEffect(() => {
    const fetchNewsletters = async () => {
      try {
        setLoading(true);
        const token=localStorage.getItem("token")
        console.log(token)
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        const { data } = await axios.get('/api/newsletters');
        
        setNewsletters(data.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to fetch newsletters');
      } finally {
        setLoading(false);
      }
    };

    fetchNewsletters();
  }, [user?.role]); // Refetch when user role changes

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-md mx-auto p-4 bg-red-100 text-red-700 rounded">
        {error}
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Newsletters</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {newsletters.map((newsletter) => (
          <NewsletterCard key={newsletter._id} newsletter={newsletter} />
        ))}
      </div>
    </div>
  );
};