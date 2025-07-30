import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';

export const NewsletterCard = ({ newsletter }) => {
  const { user } = useAuth();
  const isPremiumContent = newsletter?.type === 'premium';
  const isUserPremium = user?.role === 'premium';
  const canViewFullContent = !isPremiumContent || isUserPremium;
  const hasContent = Boolean(newsletter?.content);

  return (
    <div
      className={`border rounded-xl overflow-hidden shadow-md transition duration-200 hover:shadow-lg ${
        isPremiumContent ? 'border-yellow-500' : 'border-blue-500'
      }`}
    >
      <div
        className={`px-5 py-4 ${
          isPremiumContent ? 'bg-yellow-500' : 'bg-blue-500'
        } text-white`}
      >
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-lg">{newsletter?.title || 'Untitled'}</h3>
          <span className="text-xs bg-white text-gray-800 px-3 py-1 rounded-full uppercase tracking-wide">
            {newsletter?.type || 'free'}
          </span>
        </div>
      </div>

      <div className="p-5">
        {canViewFullContent ? (
          <>
            {hasContent ? (
              <p className="text-gray-700 mb-3 whitespace-pre-line">
                {newsletter.content}
              </p>
            ) : (
              <p className="text-gray-400 italic mb-3">No content available.</p>
            )}
            {isPremiumContent && isUserPremium && (
              <div className="text-xs text-yellow-600">🔓 Premium content unlocked</div>
            )}
          </>
        ) : (
          <>
            <p className="text-gray-500 italic mb-3">This is premium content. Upgrade to view more.</p>
            <Link
              to="/profile"
              className="inline-block bg-yellow-500 text-white font-medium px-4 py-2 rounded-md hover:bg-yellow-600 transition"
            >
              Upgrade to Premium
            </Link>
          </>
        )}
      </div>
    </div>
  );
};
  