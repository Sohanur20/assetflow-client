import { Helmet } from 'react-helmet-async';
import { Link, Navigate } from 'react-router-dom';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, Pagination as SwiperPagination, Navigation } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/pagination';
import 'swiper/css/navigation';
import { useQuery } from '@tanstack/react-query';
import { PieChart, Pie, Cell, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { FaBullhorn, FaCalendarAlt, FaLightbulb, FaExclamationTriangle } from 'react-icons/fa';
import useAuth from '../../hooks/useAuth';
import useCurrentUser from '../../hooks/useCurrentUser';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import PackageCards from '../../components/PackageCards';
import LoadingSpinner from '../../components/LoadingSpinner';

const NOTICES = [
  { title: 'Quarterly asset audit', text: 'Please confirm the assets assigned to you before the end of this month so the register stays accurate.' },
  { title: 'Return policy reminder', text: 'Returnable items such as laptops and phones must be handed back before your final working day.' },
  { title: 'New stock arrived', text: 'Wireless keyboards, mouse units and notebooks have been restocked and are ready to request.' },
];

const EVENTS = [
  { date: 'Nov 15', title: 'Asset handover day', text: 'Collect newly approved equipment from the HR desk between 10am and 4pm.' },
  { date: 'Nov 22', title: 'Inventory review meeting', text: 'Team leads review low-stock items and plan the next purchase order.' },
  { date: 'Dec 02', title: 'Office equipment maintenance', text: 'Shared printers and meeting-room devices will be serviced during the morning.' },
];

const PublicHome = () => (
  <div>
    <Swiper
      modules={[Autoplay, SwiperPagination, Navigation]}
      autoplay={{ delay: 4500, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      loop
      className="rounded-2xl overflow-hidden shadow"
    >
      <SwiperSlide>
        <div className="relative h-[380px] md:h-[440px]">
          <img
            src="https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1600&q=80"
            alt="Modern office workspace"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/60 flex items-center">
            <div className="px-6 md:px-14 max-w-2xl text-white">
              <p className="text-teal-300 font-semibold uppercase tracking-wide text-sm">For HR Managers</p>
              <h1 className="text-3xl md:text-5xl font-extrabold mt-2 leading-tight">Every company asset, accounted for.</h1>
              <p className="mt-3 text-slate-200">Register your company, add your equipment and supplies, and approve employee requests from one clear dashboard.</p>
              <Link to="/join-hr" className="af-btn-primary mt-6">Join as HR Manager</Link>
            </div>
          </div>
        </div>
      </SwiperSlide>
      <SwiperSlide>
        <div className="relative h-[380px] md:h-[440px]">
          <img
            src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"
            alt="Team working together in an office"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <div className="absolute inset-0 bg-slate-950/60 flex items-center">
            <div className="px-6 md:px-14 max-w-2xl text-white">
              <p className="text-teal-300 font-semibold uppercase tracking-wide text-sm">For Employees</p>
              <h1 className="text-3xl md:text-5xl font-extrabold mt-2 leading-tight">Request what you need, in minutes.</h1>
              <p className="mt-3 text-slate-200">Browse the assets your company offers, send a request to your HR Manager, and track its status from your own account.</p>
              <Link to="/join-employee" className="af-btn-primary mt-6">Join as an Employee</Link>
            </div>
          </div>
        </div>
      </SwiperSlide>
    </Swiper>

    <section className="mt-16">
      <h2 className="section-title text-center">About AssetFlow</h2>
      <p className="section-subtitle mx-auto text-center">
        AssetFlow is built by XYZ to solve a problem every growing company knows: equipment gets
        handed out, supplies get used, and nobody is quite sure who has what.
      </p>
      <div className="grid md:grid-cols-3 gap-6 mt-8">
        {[
          { title: 'One clear register', text: 'HR Managers keep a single list of returnable assets like laptops and desks, and non-returnable supplies like pens and paper — with quantities always up to date.' },
          { title: 'Simple requests', text: 'Employees request the items they need and follow the request from pending to approved, instead of chasing emails and paper forms.' },
          { title: 'Fair hand-backs', text: 'When a returnable asset comes back, the return is recorded and the stock count updates automatically, ready for the next team member.' },
        ].map((c) => (
          <div key={c.title} className="af-card p-6">
            <h3 className="font-bold text-lg text-teal-800">{c.title}</h3>
            <p className="text-sm text-slate-600 mt-2 leading-relaxed">{c.text}</p>
          </div>
        ))}
      </div>
    </section>

    <section className="mt-16">
      <h2 className="section-title text-center">Packages</h2>
      <p className="section-subtitle mx-auto text-center">Choose the team size that fits your company. You can increase your limit at any time.</p>
      <div className="mt-8">
        <PackageCards />
      </div>
    </section>
  </div>
);

const NoticeBoard = () => (
  <div className="af-card p-6">
    <h3 className="font-bold text-lg flex items-center gap-2"><FaBullhorn className="text-teal-700" /> Notice Board</h3>
    <ul className="mt-4 space-y-4">
      {NOTICES.map((n) => (
        <li key={n.title} className="border-l-4 border-teal-600 pl-3">
          <p className="font-semibold text-sm">{n.title}</p>
          <p className="text-sm text-slate-500">{n.text}</p>
        </li>
      ))}
    </ul>
  </div>
);

const UpcomingEvents = () => (
  <div className="af-card p-6">
    <h3 className="font-bold text-lg flex items-center gap-2"><FaCalendarAlt className="text-teal-700" /> Upcoming Events</h3>
    <ul className="mt-4 space-y-4">
      {EVENTS.map((e) => (
        <li key={e.title} className="flex gap-3">
          <span className="bg-teal-50 text-teal-800 font-bold text-xs rounded-lg px-2.5 py-2 text-center h-fit min-w-[52px]">{e.date}</span>
          <span>
            <p className="font-semibold text-sm">{e.title}</p>
            <p className="text-sm text-slate-500">{e.text}</p>
          </span>
        </li>
      ))}
    </ul>
  </div>
);

const statusBadge = (s) => {
  const map = {
    pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-error',
    returned: 'badge-info', cancelled: 'badge-ghost',
  };
  return <span className={`badge ${map[s] || 'badge-ghost'} capitalize`}>{s}</span>;
};

const EmployeeHome = ({ dbUser }) => {
  const axiosSecure = useAxiosSecure();
  const { data, isLoading } = useQuery({
    queryKey: ['employee-home', dbUser?.email],
    queryFn: async () => (await axiosSecure.get('/employee-home')).data,
  });

  if (isLoading) return <LoadingSpinner />;
  const pending = data?.pendingRequests || [];
  const monthly = data?.monthlyRequests || [];

  return (
    <div>
      <h2 className="section-title">Welcome back, {dbUser?.name}</h2>
      {!dbUser?.hrEmail ? (
        <div className="mt-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-6 flex gap-3">
          <FaExclamationTriangle className="text-xl shrink-0 mt-0.5" />
          <div>
            <p className="font-semibold">You are not affiliated with any company yet. Please contact your HR Manager.</p>
            <p className="text-sm mt-1">Once your HR Manager adds you to their team, the assets of your company will appear here and you will be able to request them.</p>
          </div>
        </div>
      ) : (
        <>
          <section className="mt-8">
            <h3 className="font-bold text-xl mb-4">My Pending Requests</h3>
            {pending.length === 0 ? (
              <p className="text-slate-500 text-sm">You have no pending requests right now.</p>
            ) : (
              <div className="af-card overflow-x-auto">
                <table className="table af-table w-full">
                  <thead><tr><th>Asset</th><th>Type</th><th>Request Date</th><th>Status</th></tr></thead>
                  <tbody>
                    {pending.map((r) => (
                      <tr key={r._id}>
                        <td className="font-medium">{r.assetName}</td>
                        <td className="capitalize">{r.assetType}</td>
                        <td>{new Date(r.requestDate).toLocaleDateString()}</td>
                        <td>{statusBadge(r.status)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>

          <section className="mt-10">
            <h3 className="font-bold text-xl mb-4">My Monthly Requests</h3>
            {monthly.length === 0 ? (
              <p className="text-slate-500 text-sm">You have not requested any asset this month yet.</p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                {monthly.map((r) => (
                  <div key={r._id} className="af-card p-4">
                    <div className="flex items-center justify-between gap-2">
                      <p className="font-semibold">{r.assetName}</p>
                      {statusBadge(r.status)}
                    </div>
                    <p className="text-sm text-slate-500 mt-1 capitalize">{r.assetType} · {new Date(r.requestDate).toLocaleDateString()}</p>
                  </div>
                ))}
              </div>
            )}
          </section>
        </>
      )}
      <div className="grid md:grid-cols-2 gap-6 mt-10">
        <NoticeBoard />
        <UpcomingEvents />
      </div>
    </div>
  );
};

const COLORS = ['#0f766e', '#94a3b8'];

const HRHome = ({ dbUser }) => {
  const axiosSecure = useAxiosSecure();
  const { data, isLoading } = useQuery({
    queryKey: ['hr-stats', dbUser?.email],
    queryFn: async () => (await axiosSecure.get('/hr-stats')).data,
  });

  if (isLoading) return <LoadingSpinner />;
  const pending = data?.pendingRequests || [];
  const top = data?.topRequested || [];
  const limited = data?.limitedStock || [];
  const pieData = data?.pieData || [
    { name: 'Returnable', value: 0 },
    { name: 'Non-returnable', value: 0 },
  ];

  return (
    <div>
      <h2 className="section-title">{dbUser?.companyName} — Dashboard</h2>
      <p className="section-subtitle">A quick view of requests, popular items and stock that needs attention.</p>

      <div className="grid lg:grid-cols-2 gap-6 mt-8">
        <section className="af-card p-6">
          <h3 className="font-bold text-lg mb-4">Pending Requests</h3>
          {pending.length === 0 ? (
            <p className="text-sm text-slate-500">No requests are waiting for your review.</p>
          ) : (
            <ul className="space-y-3">
              {pending.slice(0, 5).map((r) => (
                <li key={r._id} className="flex items-center justify-between gap-3 border-b border-slate-100 pb-2">
                  <span>
                    <span className="font-medium block">{r.assetName}</span>
                    <span className="text-xs text-slate-500">{r.requesterName} · {new Date(r.requestDate).toLocaleDateString()}</span>
                  </span>
                  {statusBadge(r.status)}
                </li>
              ))}
            </ul>
          )}
          <Link to="/all-requests" className="text-teal-700 text-sm font-semibold mt-4 inline-block">Review all requests →</Link>
        </section>

        <section className="af-card p-6">
          <h3 className="font-bold text-lg mb-4">Requested Items by Type</h3>
          {pieData.every((d) => !d.value) ? (
            <p className="text-sm text-slate-500">No requests yet, so there is nothing to chart.</p>
          ) : (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={pieData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={85} label>
                    {pieData.map((entry, i) => (
                      <Cell key={entry.name} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          )}
        </section>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mt-6">
        <section className="af-card p-6">
          <h3 className="font-bold text-lg mb-4">Top Most Requested Items</h3>
          {top.length === 0 ? (
            <p className="text-sm text-slate-500">No item has been requested yet.</p>
          ) : (
            <ul className="space-y-3">
              {top.slice(0, 4).map((item, i) => (
                <li key={item._id || item.assetName} className="flex items-center justify-between">
                  <span className="font-medium">{i + 1}. {item.assetName}</span>
                  <span className="badge badge-outline">{item.count ?? item.requestCount ?? 0} requests</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        <section className="af-card p-6">
          <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
            <FaExclamationTriangle className="text-amber-500" /> Limited Stock Items
          </h3>
          {limited.length === 0 ? (
            <p className="text-sm text-slate-500">Every item has a healthy quantity of 10 or more.</p>
          ) : (
            <ul className="space-y-3">
              {limited.map((a) => (
                <li key={a._id} className="flex items-center justify-between">
                  <span className="font-medium">{a.productName}</span>
                  <span className="badge badge-warning">Only {a.quantity} left</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mt-6">
        <NoticeBoard />
        <div className="af-card p-6">
          <h3 className="font-bold text-lg flex items-center gap-2"><FaLightbulb className="text-teal-700" /> Quick Tips for HR Managers</h3>
          <ul className="mt-4 space-y-3 text-sm text-slate-600 list-disc pl-5">
            <li>Review pending requests daily so employees are not left waiting for equipment they need to start work.</li>
            <li>Keep quantities honest — update stock as soon as new supplies arrive so the Request page stays accurate.</li>
            <li>Watch the limited stock list before items hit zero; reordering early avoids urgent purchases.</li>
            <li>When someone leaves the company, remove them from your team list so their access and records stay tidy.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const { user, loading } = useAuth();
  const { dbUser, dbUserLoading } = useCurrentUser();

  return (
    <>
      <Helmet>
        <title>AssetFlow | Home</title>
      </Helmet>
      {loading || (user && dbUserLoading) ? (
        <LoadingSpinner />
      ) : !user ? (
        <PublicHome />
      ) : dbUser?.role === 'hr' ? (
        dbUser.paid !== true ? (
          <Navigate to="/payment" state={{ pkg: undefined }} replace />
        ) : (
          <HRHome dbUser={dbUser} />
        )
      ) : dbUser ? (
        <EmployeeHome dbUser={dbUser} />
      ) : (
        <PublicHome />
      )}
    </>
  );
};

export default Home;
