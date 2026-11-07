import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import { PDFDownloadLink } from '@react-pdf/renderer';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useCurrentUser from '../../hooks/useCurrentUser';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';
import AssetPdf from './AssetPdf';

const PAGE_SIZE = 10;

const statusBadge = (s) => {
  const map = { pending: 'badge-warning', approved: 'badge-success', rejected: 'badge-error', returned: 'badge-info', cancelled: 'badge-ghost' };
  return <span className={`badge ${map[s] || 'badge-ghost'} capitalize`}>{s}</span>;
};

const MyAssets = () => {
  const axiosSecure = useAxiosSecure();
  const { dbUser } = useCurrentUser();
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['my-requests', search, status, type, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: PAGE_SIZE });
      if (search) params.set('search', search);
      if (status) params.set('status', status);
      if (type) params.set('type', type);
      const res = await axiosSecure.get(`/requests/my?${params.toString()}`);
      return res.data;
    },
  });

  const requests = data?.requests || data?.result || (Array.isArray(data) ? data : []);
  const totalPages = data?.totalPages || Math.max(1, Math.ceil((data?.total || requests.length) / PAGE_SIZE));

  const handleCancel = async (id) => {
    const confirm = await Swal.fire({
      title: 'Cancel this request?', text: 'The request will be marked as cancelled.',
      icon: 'warning', showCancelButton: true, confirmButtonColor: '#b91c1c', confirmButtonText: 'Yes, cancel it',
    });
    if (!confirm.isConfirmed) return;
    await axiosSecure.patch(`/requests/cancel/${id}`);
    toast.success('Request cancelled');
    refetch();
  };

  const handleReturn = async (id) => {
    const confirm = await Swal.fire({
      title: 'Return this asset?', text: 'The asset will go back into company stock.',
      icon: 'question', showCancelButton: true, confirmButtonColor: '#0f766e', confirmButtonText: 'Yes, return it',
    });
    if (!confirm.isConfirmed) return;
    await axiosSecure.patch(`/requests/return/${id}`);
    Swal.fire({ icon: 'success', title: 'Returned', text: 'Thank you — the asset has been marked as returned.', timer: 1800, showConfirmButton: false });
    refetch();
  };

  return (
    <div>
      <Helmet><title>AssetFlow | My Assets</title></Helmet>
      <h2 className="section-title">My Requested Assets</h2>
      <p className="section-subtitle">Track every asset you have requested, print approved hand-over documents and return items when you are done.</p>

      <div className="af-card p-4 mt-6 grid gap-3 md:grid-cols-3">
        <input
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          placeholder="Search by asset name…"
          className="af-input"
        />
        <select value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); }} className="af-input">
          <option value="">All statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="returned">Returned</option>
        </select>
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="af-input">
          <option value="">All types</option>
          <option value="returnable">Returnable</option>
          <option value="non-returnable">Non-returnable</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : requests.length === 0 ? (
        <p className="mt-8 text-slate-500 text-sm">No requested assets match your search. When you request an asset, it will appear here.</p>
      ) : (
        <div className="af-card overflow-x-auto mt-6">
          <table className="table af-table w-full min-w-[760px]">
            <thead>
              <tr><th>Asset Name</th><th>Asset Type</th><th>Request Date</th><th>Approval Date</th><th>Request Status</th><th>Action</th></tr>
            </thead>
            <tbody>
              {requests.map((r) => (
                <tr key={r._id}>
                  <td className="font-medium">{r.assetName}</td>
                  <td className="capitalize">{r.assetType}</td>
                  <td>{new Date(r.requestDate).toLocaleDateString()}</td>
                  <td>{r.approvalDate ? new Date(r.approvalDate).toLocaleDateString() : '—'}</td>
                  <td>{statusBadge(r.status)}</td>
                  <td>
                    <div className="flex flex-wrap gap-2">
                      {r.status === 'pending' && (
                        <button onClick={() => handleCancel(r._id)} className="btn btn-xs btn-error text-white">Cancel</button>
                      )}
                      {r.status === 'approved' && (
                        <PDFDownloadLink
                          document={<AssetPdf request={r} dbUser={dbUser} />}
                          fileName={`${r.assetName}-details.pdf`}
                          className="btn btn-xs btn-outline"
                        >
                          {({ loading }) => (loading ? 'Preparing…' : 'Print')}
                        </PDFDownloadLink>
                      )}
                      {r.status === 'approved' && r.assetType === 'returnable' && (
                        <button onClick={() => handleReturn(r._id)} className="btn btn-xs bg-teal-700 hover:bg-teal-800 text-white border-none">Return</button>
                      )}
                      {r.status === 'returned' && (
                        <button disabled className="btn btn-xs">Returned</button>
                      )}
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

export default MyAssets;
