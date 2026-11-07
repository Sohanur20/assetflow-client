import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { FaCrown, FaUser } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useCurrentUser from '../../hooks/useCurrentUser';
import LoadingSpinner from '../../components/LoadingSpinner';

// NOTE: team listing uses GET /team-members?hrEmail=<hr email>.
// The same endpoint powers the HR "My Employee List" page.
const MyTeam = () => {
  const axiosSecure = useAxiosSecure();
  const { dbUser, dbUserLoading } = useCurrentUser();

  const { data, isLoading } = useQuery({
    queryKey: ['team-members', dbUser?.hrEmail],
    enabled: !!dbUser?.hrEmail,
    queryFn: async () => {
      const res = await axiosSecure.get(`/team-members?hrEmail=${encodeURIComponent(dbUser.hrEmail)}`);
      return res.data;
    },
  });

  if (dbUserLoading || isLoading) return <LoadingSpinner />;

  if (!dbUser?.hrEmail) {
    return (
      <div>
        <Helmet><title>AssetFlow | My Team</title></Helmet>
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-6">
          <p className="font-semibold">You are not affiliated with any company yet. Please contact your HR Manager.</p>
          <p className="text-sm mt-1">Once your HR Manager adds you to their team, your team members will be listed here.</p>
        </div>
      </div>
    );
  }

  const members = data?.members || data?.team || (Array.isArray(data) ? data : []);

  return (
    <div>
      <Helmet><title>AssetFlow | My Team</title></Helmet>
      <h2 className="section-title">My Team — {dbUser.companyName || 'Your Company'}</h2>
      <p className="section-subtitle">Everyone who works with you under the same HR Manager.</p>

      {members.length === 0 ? (
        <p className="mt-8 text-slate-500 text-sm">No team members found yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 mt-8">
          {members.map((m) => {
            const isAdmin = m.role === 'hr';
            return (
              <div key={m._id || m.email} className="af-card p-5 flex items-center gap-4">
                <img
                  src={m.photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(m.name || 'User')}&background=0f766e&color=fff`}
                  alt={m.name}
                  className="h-14 w-14 rounded-full object-cover border border-slate-200"
                />
                <div>
                  <p className="font-semibold">{m.name}</p>
                  <p className="text-sm text-slate-500 flex items-center gap-1.5 mt-0.5">
                    {isAdmin
                      ? <><FaCrown className="text-amber-500" /> HR Manager (Admin)</>
                      : <><FaUser className="text-teal-600" /> Employee</>}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyTeam;
