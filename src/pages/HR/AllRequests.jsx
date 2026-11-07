import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';

const PAGE_SIZE = 10;

const statusBadge = (s) => {
  const map = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-error', returned: 'badge-info', cancelled: 'badge-ghost' };
  return <span className={`badge ${map[s] || 'badge-ghost'} capitalize`}>{s}</span>;
};

const AllRequests = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['hr-requests', search, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: PAGE_SIZE });
      if (search) params.set('search', search);
      const res = await axiosSecure.get(`/requests/hr?${params.toString()}`);
      return res.data;
    },
  });

  const requests = data?.requests || data?.result || (Array.isArray(data) ? data : []);
  const totalPages = data?.totalPages || Math.max(1, Math.ceil((data?.total || requests.length) / PAGE_SIZE));

  const handleApprove = async (r) => {
    const confirm = await Swal.fire({
      title: `Approve ${r.assetName}?`,
      text: `${r.requesterName} will receive this asset and its stock will go down by one.`,
      icon: 'question', showCancelButton: true, confirmButtonColor: '#0f766e', confirmButtonText: 'Yes, approve',
    });
    if (!confirm.isConfirmed) return;
    await axiosSecure.patch(`/requests/approve/${r._id}`);
    toast.success('Request approved');
    refetch();
  };

  const handleReject = async (r) => {
    const confirm = await Swal.fire({
      title: `Reject ${r.assetName} request?`,
      text: `${r.requesterName} will see this request as rejected.`,
      icon: 'warning', showCancelButton: true, confirmButtonColor: '#b91c1c', confirmButtonText: 'Yes, reject',
    });
    if (!confirm.isConfirmed) return;
    await axiosSecure.patch(`/requests/reject/${r._id}`);
    toast.success('Request rejected');
    refetch();
  };

  return (
    <div>
      <Helmet><title>AssetFlow | All Requests</title></Helmet>
      <h2 className="section-title">All Requests</h2>
      <p className="section-subtitle">Review asset requests from your employees and approve or reject them.</p>

      <div className="af-card p-4 mt-6">
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by requester name or email…" className="af-input" />
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : requests.length === 0 ? (
        <p className="mt-8 text-slate-500 text-sm">No requests found for your company yet.</p>
      ) : (
        <div className="af-card overflow-x-auto mt-6">
          <table className="table af-table w-full min-w-[900px]">
            <thead>
              <tr><th>Asset Name</th><th>Asset Type</th><th>Email of Requester</th><th>Name of Requester</th><th>Request Date</th><th>Additional Note</th><th>Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id}>
                  <td className="font-medium">{r.assetName}</td>
                  <td className="capitalize">{r.assetType}</td>
                  <td>{r.requesterEmail}</td>
                  <td>{r.requesterName}</td>
                  <td>{new Date(r.requestDate).toLocaleDateString()}</td>
                  <td className="max-w-[180px] truncate" title={r.additionalNote}>{r.additionalNote || '—'}</td>
                  <td>{statusBadge(r.status)}</td>
                  <td>
                    <div className="flex gap-2">
                      <button disabled={r.status !== 'pending'} onClick={() => handleApprove(r)} className="btn btn-xs bg-teal-700 hover:bg-teal-800 text-white border-none disabled:opacity-40">Approve</button>
                      <button disabled={r.status !== 'pending'} onClick={() => handleReject(r)} className="btn btn-xs btn-error text-white disabled:opacity-40">Reject</button>
                    </div>
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

export default AllRequests;
