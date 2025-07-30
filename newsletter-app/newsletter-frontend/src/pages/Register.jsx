import { AuthForm } from '../components/AuthForm';

export const Register = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <AuthForm type="register" />
    </div>
  );
};