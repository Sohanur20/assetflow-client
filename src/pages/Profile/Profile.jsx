import { Helmet } from 'react-helmet-async';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useCurrentUser from '../../hooks/useCurrentUser';
import LoadingSpinner from '../../components/LoadingSpinner';

const Profile = () => {
  const axiosSecure = useAxiosSecure();
  const { dbUser, dbUserLoading, refetchDbUser } = useCurrentUser();

  if (dbUserLoading) return <LoadingSpinner />;
  if (!dbUser) return <p className="text-slate-500 text-sm">Your profile could not be loaded.</p>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    const name = e.target.name.value.trim();
    try {
      await axiosSecure.patch('/users/profile', { email: dbUser.email, name });
      toast.success('Profile updated successfully');
      refetchDbUser();
      Swal.fire({ icon: 'success', title: 'Profile updated', timer: 1500, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Update failed', text: error.response?.data?.message || error.message });
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <Helmet><title>AssetFlow | Profile</title></Helmet>
      <div className="af-card p-8">
        <div className="flex flex-col items-center text-center">
          <img
            src={dbUser.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(dbUser.name || 'User')}&background=0f766e&color=fff&size=128`}
            alt={dbUser.name}
            className="h-24 w-24 rounded-full object-cover border-4 border-teal-50"
          />
          <h2 className="text-2xl font-bold mt-4">{dbUser.name}</h2>
          <p className="text-sm text-slate-500 capitalize">{dbUser.role === 'hr' ? 'HR Manager' : 'Employee'}{dbUser.companyName ? ` · ${dbUser.companyName}` : ''}</p>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 space-y-4">
          <div>
            <label className="af-label">Full Name</label>
            <input name="name" defaultValue={dbUser.name} required className="af-input" />
          </div>
          <div>
            <label className="af-label">Email</label>
            <input value={dbUser.email} readOnly className="af-input bg-slate-100 text-slate-500 cursor-not-allowed" />
          </div>
          <button type="submit" className="af-btn-primary w-full">Update</button>
        </form>
      </div>
    </div>
  );
};

export default Profile;
