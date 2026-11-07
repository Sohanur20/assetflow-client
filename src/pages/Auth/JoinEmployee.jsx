import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import SocialLogin from './SocialLogin';

const JoinEmployee = () => {
  const { createUser, updateUserProfile } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const dob = form.dob.value;
    const photo = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=0f766e&color=fff&size=128`;

    try {
      await createUser(email, password);
      await updateUserProfile(name, photo).catch(() => {});
      const dbUserDoc = {
        name, email, photo, dob,
        role: 'employee',
        hrEmail: null,
        companyName: null,
        companyLogo: null,
        joinedDate: new Date().toISOString(),
      };
      await axiosPublic.post('/users', dbUserDoc);
      Swal.fire({ icon: 'success', title: 'Account created!', text: 'Your employee account is ready. Ask your HR Manager to add you to their team.' });
      navigate('/');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Sign up failed', text: error.message });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Helmet><title>AssetFlow | Join as Employee</title></Helmet>
      <div className="af-card p-8">
        <h2 className="text-2xl font-bold text-center">Join as an Employee</h2>
        <p className="text-center text-sm text-slate-500 mt-2">Create your account, then your HR Manager can add you to the company team.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="af-label">Full Name</label>
            <input name="name" required placeholder="Your full name" className="af-input" />
          </div>
          <div>
            <label className="af-label">Email</label>
            <input name="email" type="email" required placeholder="you@example.com" className="af-input" />
          </div>
          <div>
            <label className="af-label">Password</label>
            <input name="password" type="password" required minLength={6} placeholder="At least 6 characters" className="af-input" />
          </div>
          <div>
            <label className="af-label">Date of Birth</label>
            <input name="dob" type="date" required className="af-input" />
          </div>
          <button type="submit" className="af-btn-primary w-full">Sign Up</button>
        </form>
        <div className="divider text-xs text-slate-400">OR</div>
        <SocialLogin />
        <p className="text-sm text-center mt-6 text-slate-500">
          Already have an account? <Link to="/login" className="text-teal-700 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default JoinEmployee;
