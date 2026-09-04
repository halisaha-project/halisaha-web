import RegisterForm from '../components/RegisterForm';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/authContext';
import messi from '/messi.jpg';

function Register() {
  const { isAuthenticated, loading } = useAuth();

  if (loading) return null;
  if (isAuthenticated) return <Navigate to="/profile" replace />;

  return (
    <div>
      <div className="flex flex-wrap h-screen">
        <div className="hidden sm:flex sm:w-1/2">
          <img src={messi} className="object-cover" alt="messi" />
        </div>
        <div className="w-full sm:w-1/2 flex items-center justify-center bg-messi-blur sm:bg-none bg-cover bg-center bg-black">
          <RegisterForm />
        </div>
      </div>
    </div>
  )
}

export default Register;
