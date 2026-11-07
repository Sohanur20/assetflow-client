import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { FaCrown, FaUser } from 'react-icons/fa';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useCurrentUser from '../../hooks/useCurrentUser';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';

const PAGE_SIZE = 10;

// NOTE: team listing uses GET /team-members?hrEmail=<hr email> —
// the same endpoint powers the employee "My Team" page.
const MyEmployees = () => {
  const axiosSecure = useAxiosSecure();
  const { dbUser, refetchDbUser } = useCurrentUser();
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['team-members-hr', dbUser?.email],
    enabled: !!dbUser?.email,
    queryFn: async () => {
      const res = await axiosSecure.get(`/team-members?hrEmail=${encodeURIComponent(dbUser.email)}`);
      return res.data;
    },
  });

  const allMembers = data?.members || data?.team || (Array.isArray(data) ? data : []);
  // The HR manager entry itself is shown in the list but cannot be removed.
  const members = allMembers;
  const totalPages = Math.max(1, Math.ceil(members.length / PAGE_SIZE));
  const paged = members.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const handleRemove = async (member) => {
    const confirm = await Swal.fire({
      title: `Remove ${member.name} from the team?`,
      text: 'They will lose their affiliation with your company and your team count will go down by one.',
      icon: 'warning', showCancelButton: true, confirmButtonColor: '#b91c1c', confirmButtonText: 'Yes, remove',
    });
    if (!confirm.isConfirmed) return;
    await axiosSecure.patch(`/remove-from-team/${encodeURIComponent(member.email)}`);
    toast.success(`${member.name} removed from the team`);
    refetch();
    refetchDbUser();
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div>
      <Helmet><title>AssetFlow | My Employee List</title></Helmet>
      <h2 className="section-title">My Employee List</h2>
      <p className="section-subtitle">Everyone currently on the {dbUser?.companyName} team.</p>

      {members.length === 0 ? (
        <p className="mt-8 text-slate-500 text-sm">Your team is empty. Add employees from the Add an Employee page.</p>
      ) : (
        <div className="af-card overflow-x-auto mt-6">
          <table className="table af-table w-full min-w-[640px]">
            <thead><tr><th>Member</th><th>Name</th><th>Type</th><th>Action</th></tr></thead>
            <tbody>
              {paged.map((m) => {
                const isAdmin = m.role === 'hr';
                return (
                  <tr key={m._id || m.email}>
                    <td>
                      <img
                        src={m.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || 'User')}&background=0f766e&color=fff`}
                        alt={m.name}
                        className="h-11 w-11 rounded-full object-cover border border-slate-200"
                      />
                    </td>
                    <td className="font-medium">{m.name}<span className="block text-xs text-slate-400 font-normal">{m.email}</span></td>
                    <td>
                      {isAdmin
                        ? <span className="flex items-center gap-1.5 text-sm"><FaCrown className="text-amber-500" /> Admin</span>
                        : <span className="flex items-center gap-1.5 text-sm"><FaUser className="text-teal-600" /> Employee</span>}
                    </td>
                    <td>
                      {isAdmin ? (
                        <span className="text-xs text-slate-400">—</span>
                      ) : (
                        <button onClick={() => handleRemove(m)} className="btn btn-xs btn-error text-white">Remove From Team</button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />
    </div>
  );
};

export default MyEmployees;
