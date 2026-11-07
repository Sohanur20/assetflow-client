import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import SocialLogin from './SocialLogin';

const Login = () => {
  const { signIn } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || '/';
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;
    try {
      await signIn(email, password);
      Swal.fire({ icon: 'success', title: 'Login successful', text: 'Welcome back to AssetFlow.', timer: 1800, showConfirmButton: false });
      navigate(from, { replace: true });
    } catch (err) {
      setError('Invalid email or password. Please check your details and try again.');
      Swal.fire({ icon: 'error', title: 'Login failed', text: 'Invalid email or password.' });
    }
  };

  return (
    <div className="max-w-md mx-auto">
      <Helmet><title>AssetFlow | Login</title></Helmet>
      <div className="af-card p-8">
        <h2 className="text-2xl font-bold text-center">Login to AssetFlow</h2>
        <p className="text-center text-sm text-slate-500 mt-2">Access your assets, requests and team from one place.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="af-label">Email</label>
            <input name="email" type="email" required placeholder="you@example.com" className="af-input" />
          </div>
          <div>
            <label className="af-label">Password</label>
            <input name="password" type="password" required placeholder="Your password" className="af-input" />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <button type="submit" className="af-btn-primary w-full">Login</button>
        </form>
        <div className="divider text-xs text-slate-400">OR</div>
        <SocialLogin from={from} />
        <p className="text-sm text-center mt-6 text-slate-500">
          New to AssetFlow? Join as an{' '}
          <Link to="/join-employee" className="text-teal-700 font-semibold">Employee</Link> or{' '}
          <Link to="/join-hr" className="text-teal-700 font-semibold">HR Manager</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
