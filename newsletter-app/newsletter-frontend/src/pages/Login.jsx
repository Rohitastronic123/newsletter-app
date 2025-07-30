import { AuthForm } from '../components/AuthForm';

export const Login = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
      <AuthForm type="login" />
    </div>
  );
};