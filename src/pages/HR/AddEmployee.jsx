import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useCurrentUser from '../../hooks/useCurrentUser';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';

const PAGE_SIZE = 10;

// NOTE: per assignment update, there is NO Member Type column on this page.
const AddEmployee = () => {
  const axiosSecure = useAxiosSecure();
  const { dbUser, refetchDbUser } = useCurrentUser();
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState([]);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['unaffiliated-users', page],
    queryFn: async () => {
      const res = await axiosSecure.get(`/unaffiliated-users?page=${page}&limit=${PAGE_SIZE}`);
      return res.data;
    },
  });

  const users = data?.users || data?.result || (Array.isArray(data) ? data : []);
  const totalPages = data?.totalPages || Math.max(1, Math.ceil((data?.total || users.length) / PAGE_SIZE));

  const teamCount = dbUser?.teamCount ?? 0;
  const memberLimit = dbUser?.memberLimit ?? 0;
  const limitReached = teamCount >= memberLimit;

  const toggleSelected = (email) => {
    setSelected((prev) => (prev.includes(email) ? prev.filter((e) => e !== email) : [...prev, email]));
  };

  const refreshAll = () => { refetch(); refetchDbUser(); };

  const handleAddSingle = async (person) => {
    if (limitReached) {
      Swal.fire({ icon: 'warning', title: 'Package limit reached', text: 'Increase your package limit to add more members.' });
      return;
    }
    await axiosSecure.patch('/add-to-team', { email: person.email, hrEmail: dbUser.email });
    toast.success(`${person.name} added to your team`);
    setSelected((prev) => prev.filter((e) => e !== person.email));
    refreshAll();
  };

  const handleAddSelected = async () => {
    if (selected.length === 0) {
      toast.error('Select at least one member first');
      return;
    }
    if (teamCount + selected.length > memberLimit) {
      Swal.fire({
        icon: 'warning', title: 'Not enough room in your package',
        text: `You selected ${selected.length} members but only ${Math.max(memberLimit - teamCount, 0)} place(s) remain. Increase your limit or select fewer members.`,
      });
      return;
    }
    // CHALLENGE: all selected members are added with ONE single API call.
    await axiosSecure.patch('/add-selected-to-team', { emails: selected, hrEmail: dbUser.email });
    Swal.fire({ icon: 'success', title: 'Team updated!', text: `${selected.length} member(s) added to your team.` });
    setSelected([]);
    refreshAll();
  };

  return (
    <div>
      <Helmet><title>AssetFlow | Add an Employee</title></Helmet>
      <h2 className="section-title">Add an Employee</h2>
      <p className="section-subtitle">Add registered employees who are not affiliated with any company yet.</p>

      <div className="af-card p-6 mt-6 flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div>
          <p className="font-bold text-lg">Your Package: {dbUser?.packageName || '—'}</p>
          <p className="text-sm text-slate-500 mt-1">
            Team members: <span className="font-semibold text-slate-700">{teamCount}</span> / {memberLimit} allowed
          </p>
          {limitReached && (
            <p className="text-sm text-amber-600 font-medium mt-1">Your package limit is full. Increase the limit to add more members.</p>
          )}
        </div>
        <Link to="/packages" className="af-btn-primary">Increase Limit</Link>
      </div>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <button onClick={handleAddSelected} disabled={selected.length === 0} className="af-btn-primary">
          Add Selected Members to the Team ({selected.length})
        </button>
        <span className="text-sm text-slate-500">Tick the checkbox beside each person, then use this button to add them all at once.</span>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : users.length === 0 ? (
        <p className="mt-8 text-slate-500 text-sm">There are no unaffiliated employees available right now.</p>
      ) : (
        <div className="af-card overflow-x-auto mt-4">
          <table className="table af-table w-full min-w-[560px]">
            <thead><tr><th>Select</th><th>Image</th><th>Name</th><th>Action</th></tr></thead>
            <tbody>
              {users.map((u) => (
                <tr key={u._id || u.email}>
                  <td>
                    <input
                      type="checkbox"
                      className="checkbox checkbox-primary"
                      checked={selected.includes(u.email)}
                      onChange={() => toggleSelected(u.email)}
                    />
                  </td>
                  <td>
                    <img
                      src={u.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(u.name || 'User')}&background=0f766e&color=fff`}
                      alt={u.name}
                      className="h-11 w-11 rounded-full object-cover border border-slate-200"
                    />
                  </td>
                  <td className="font-medium">{u.name}<span className="block text-xs text-slate-400 font-normal">{u.email}</span></td>
                  <td>
                    <button disabled={limitReached} onClick={() => handleAddSingle(u)} className="btn btn-sm bg-teal-700 hover:bg-teal-800 text-white border-none disabled:opacity-40">
                      Add to the Team
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

export default AddEmployee;
