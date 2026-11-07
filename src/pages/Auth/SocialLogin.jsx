import { useNavigate } from 'react-router-dom';
import { FaGoogle } from 'react-icons/fa';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosPublic from '../../hooks/useAxiosPublic';

// Shared Google sign-in. New social users are saved as unaffiliated
// employees by default; existing users keep their stored role.
const SocialLogin = ({ from = '/' }) => {
  const { googleSignIn } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const handleGoogle = async () => {
    try {
      const result = await googleSignIn();
      const u = result.user;
      await axiosPublic.post('/users/social', {
        name: u.displayName,
        email: u.email,
        photo: u.photoURL,
        role: 'employee',
        hrEmail: null,
      });
      Swal.fire({ icon: 'success', title: 'Welcome!', text: 'Signed in with Google successfully.', timer: 1800, showConfirmButton: false });
      navigate(from, { replace: true });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Google sign-in failed', text: error.message });
    }
  };

  return (
    <button type="button" onClick={handleGoogle} className="btn btn-outline w-full gap-2">
      <FaGoogle className="text-red-500" /> Continue with Google
    </button>
  );
};

export default SocialLogin;
