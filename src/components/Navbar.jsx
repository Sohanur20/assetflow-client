import { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { FaBoxes, FaSignOutAlt, FaBars } from 'react-icons/fa';
import useAuth from '../hooks/useAuth';
import useCurrentUser from '../hooks/useCurrentUser';
import toast from 'react-hot-toast';

const XyzLogo = () => (
  <span className="flex items-center gap-2">
    <span className="bg-teal-700 text-white p-2 rounded-lg">
      <FaBoxes className="text-lg" />
    </span>
    <span className="leading-tight">
      <span className="block font-extrabold text-slate-800 text-lg">AssetFlow</span>
      <span className="block text-[11px] uppercase tracking-wider text-teal-700 font-semibold">by XYZ</span>
    </span>
  </span>
);

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { dbUser } = useCurrentUser();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const handleLogout = async () => {
    await logOut();
    toast.success('Logged out successfully');
    navigate('/');
  };

  const linkClass = ({ isActive }) =>
    `px-3 py-2 rounded-lg text-sm font-medium transition ${
      isActive ? 'bg-teal-700 text-white' : 'text-slate-600 hover:bg-teal-50 hover:text-teal-800'
    }`;

  let links = null;
  if (!user) {
    links = (
      <>
        <NavLink to="/" className={linkClass}>Home</NavLink>
        <NavLink to="/join-employee" className={linkClass}>Join as Employee</NavLink>
        <NavLink to="/join-hr" className={linkClass}>Join as HR Manager</NavLink>
        <NavLink to="/login" className={linkClass}>Login</NavLink>
      </>
    );
  } else if (dbUser?.role === 'hr') {
    links = (
      <>
        <NavLink to="/" className={linkClass}>Home</NavLink>
        <NavLink to="/asset-list" className={linkClass}>Asset List</NavLink>
        <NavLink to="/add-asset" className={linkClass}>Add an Asset</NavLink>
        <NavLink to="/all-requests" className={linkClass}>All Requests</NavLink>
        <NavLink to="/my-employees" className={linkClass}>My Employee List</NavLink>
        <NavLink to="/add-employee" className={linkClass}>Add an Employee</NavLink>
        <NavLink to="/profile" className={linkClass}>Profile</NavLink>
      </>
    );
  } else if (user) {
    links = (
      <>
        <NavLink to="/" className={linkClass}>Home</NavLink>
        <NavLink to="/my-assets" className={linkClass}>My Assets</NavLink>
        <NavLink to="/my-team" className={linkClass}>My Team</NavLink>
        <NavLink to="/request-asset" className={linkClass}>Request for an Asset</NavLink>
        <NavLink to="/profile" className={linkClass}>Profile</NavLink>
      </>
    );
  }

  // Logo: company logo for HR / affiliated employee, XYZ logo otherwise.
  const companyLogo = dbUser?.companyLogo;
  const showCompanyLogo = user && companyLogo && (dbUser?.role === 'hr' || dbUser?.hrEmail);
  const displayName = dbUser?.name || user?.displayName || '';
  const photo =
    dbUser?.photo ||
    user?.photoURL ||
    `https://ui-avatars.com/api/?name=${encodeURIComponent(displayName || 'User')}&background=0f766e&color=fff`;

  return (
    <header className="bg-white shadow-sm sticky top-0 z-40 border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-[72px] gap-3">
          <Link to="/" className="flex items-center gap-3 shrink-0">
            {showCompanyLogo ? (
              <>
                <img
                  src={companyLogo}
                  alt={dbUser?.companyName || 'Company logo'}
                  className="h-11 w-11 rounded-lg object-contain bg-slate-50 border border-slate-200"
                  onError={(e) => { e.currentTarget.style.display = 'none'; }}
                />
                <span className="leading-tight hidden sm:block">
                  <span className="block font-extrabold text-slate-800 text-lg">
                    {dbUser?.companyName || 'AssetFlow'}
                  </span>
                  <span className="block text-[11px] uppercase tracking-wider text-teal-700 font-semibold">
                    Powered by AssetFlow · XYZ
                  </span>
                </span>
              </>
            ) : (
              <XyzLogo />
            )}
          </Link>

          <nav className="hidden lg:flex items-center gap-1 flex-wrap justify-center">{links}</nav>

          <div className="flex items-center gap-3">
            {user && (
              <div className="hidden md:flex items-center gap-3">
                <div className="text-right leading-tight">
                  <p className="text-sm font-semibold text-slate-800">{displayName}</p>
                  <p className="text-xs text-slate-500">{dbUser?.role === 'hr' ? 'HR Manager' : 'Employee'}</p>
                </div>
                <img src={photo} alt={displayName} className="h-10 w-10 rounded-full object-cover border border-slate-200" />
                <button onClick={handleLogout} className="af-btn-primary !px-3.5">
                  <FaSignOutAlt /> Logout
                </button>
              </div>
            )}
            <button
              className="lg:hidden btn btn-ghost btn-sm"
              onClick={() => setOpen(!open)}
              aria-label="Toggle menu"
            >
              <FaBars className="text-xl" />
            </button>
          </div>
        </div>

        {open && (
          <nav className="lg:hidden pb-4 flex flex-col gap-1" onClick={() => setOpen(false)}>
            {links}
            {user && (
              <button onClick={handleLogout} className="af-btn-primary mt-2 w-fit">
                <FaSignOutAlt /> Logout ({displayName})
              </button>
            )}
          </nav>
        )}
      </div>
    </header>
  );
};

export default Navbar;
