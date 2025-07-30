import { UserProfile } from '../components/UserProfile';
import { ProtectedRoute } from '../components/ProtectedRoute';

export const Profile = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gray-50 p-4">
        <UserProfile />
      </div>
    </ProtectedRoute>
  );
};