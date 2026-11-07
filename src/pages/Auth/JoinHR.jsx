import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAuth from '../../hooks/useAuth';
import useAxiosPublic from '../../hooks/useAxiosPublic';
import { PACKAGES } from '../../utils/packages';

const JoinHR = () => {
  const { createUser, updateUserProfile } = useAuth();
  const axiosPublic = useAxiosPublic();
  const navigate = useNavigate();
  const [packageId, setPackageId] = useState(PACKAGES[1].id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const name = form.name.value.trim();
    const companyName = form.companyName.value.trim();
    const companyLogo = form.companyLogo.value.trim();
    const email = form.email.value.trim();
    const password = form.password.value;
    const dob = form.dob.value;
    const selected = PACKAGES.find((p) => p.id === packageId) || PACKAGES[0];
    const photo = `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=134e4a&color=fff&size=128`;

    try {
      await createUser(email, password);
      await updateUserProfile(name, photo).catch(() => {});
      const dbUserDoc = {
        name, email, photo, dob,
        role: 'hr',
        companyName,
        companyLogo,
        hrEmail: email,
        packageName: selected.name,
        packageId: selected.id,
        memberLimit: 0,
        teamCount: 0,
        paid: false,
        joinedDate: new Date().toISOString(),
      };
      await axiosPublic.post('/users', dbUserDoc);
      Swal.fire({
        icon: 'success',
        title: 'Company account created!',
        text: `Complete your ${selected.name} payment ($${selected.price}) to activate your team of up to ${selected.memberLimit} members.`,
      });
      navigate('/payment', { state: { pkg: selected } });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Sign up failed', text: error.message });
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <Helmet><title>AssetFlow | Join as HR Manager</title></Helmet>
      <div className="af-card p-8">
        <h2 className="text-2xl font-bold text-center">Join as HR Manager</h2>
        <p className="text-center text-sm text-slate-500 mt-2">Register your company and start tracking its assets and team in minutes.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="af-label">Full Name</label>
            <input name="name" required placeholder="Your full name" className="af-input" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="af-label">Company Name</label>
              <input name="companyName" required placeholder="e.g. BrightBuild Ltd" className="af-input" />
            </div>
            <div>
              <label className="af-label">Company Logo URL</label>
              <input name="companyLogo" type="url" required placeholder="https://example.com/logo.png" className="af-input" />
            </div>
          </div>
          <div>
            <label className="af-label">Email</label>
            <input name="email" type="email" required placeholder="hr@yourcompany.com" className="af-input" />
          </div>
          <div>
            <label className="af-label">Password</label>
            <input name="password" type="password" required minLength={6} placeholder="At least 6 characters" className="af-input" />
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="af-label">Date of Birth</label>
              <input name="dob" type="date" required className="af-input" />
            </div>
            <div>
              <label className="af-label">Select a Package</label>
              <select value={packageId} onChange={(e) => setPackageId(e.target.value)} className="af-input">
                {PACKAGES.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} — {p.memberLimit} members for ${p.price}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <button type="submit" className="af-btn-primary w-full">Sign Up & Continue to Payment</button>
        </form>
        <p className="text-sm text-center mt-6 text-slate-500">
          Already have an account? <Link to="/login" className="text-teal-700 font-semibold">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default JoinHR;
