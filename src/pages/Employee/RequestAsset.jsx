import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useCurrentUser from '../../hooks/useCurrentUser';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';

const PAGE_SIZE = 10;

const RequestAsset = () => {
  const axiosSecure = useAxiosSecure();
  const { dbUser, dbUserLoading } = useCurrentUser();
  const [search, setSearch] = useState('');
  const [availability, setAvailability] = useState('');
  const [type, setType] = useState('');
  const [page, setPage] = useState(1);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [note, setNote] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const { data, isLoading } = useQuery({
    queryKey: ['employee-assets', search, availability, type, page, dbUser?.hrEmail],
    enabled: !!dbUser?.hrEmail,
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: PAGE_SIZE });
      if (search) params.set('search', search);
      if (availability) params.set('availability', availability);
      if (type) params.set('type', type);
      const res = await axiosSecure.get(`/assets/employee?${params.toString()}`);
      return res.data;
    },
  });

  const assets = data?.assets || data?.result || (Array.isArray(data) ? data : []);
  const totalPages = data?.totalPages || Math.max(1, Math.ceil((data?.total || assets.length) / PAGE_SIZE));

  const handleRequest = async () => {
    if (!selectedAsset) return;
    setSubmitting(true);
    try {
      const payload = {
        assetId: selectedAsset._id,
        assetName: selectedAsset.productName,
        assetType: selectedAsset.productType,
        requesterName: dbUser.name,
        requesterEmail: dbUser.email,
        hrEmail: dbUser.hrEmail,
        companyName: dbUser.companyName || selectedAsset.companyName,
        companyLogo: dbUser.companyLogo || selectedAsset.companyLogo,
        additionalNote: note,
      };
      await axiosSecure.post('/requests', payload);
      Swal.fire({ icon: 'success', title: 'Request sent!', text: `${selectedAsset.productName} has been requested from your HR Manager.` });
      setSelectedAsset(null);
      setNote('');
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Request failed', text: error.response?.data?.message || error.message });
    } finally {
      setSubmitting(false);
    }
  };

  if (dbUserLoading) return <LoadingSpinner />;

  if (!dbUser?.hrEmail) {
    return (
      <div>
        <Helmet><title>AssetFlow | Request for an Asset</title></Helmet>
        <div className="bg-amber-50 border border-amber-200 text-amber-800 rounded-2xl p-6">
          <p className="font-semibold">You are not affiliated with any company yet. Please contact your HR Manager.</p>
          <p className="text-sm mt-1">Your HR Manager needs to add you to their team before you can see and request company assets.</p>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Helmet><title>AssetFlow | Request for an Asset</title></Helmet>
      <h2 className="section-title">Request for an Asset</h2>
      <p className="section-subtitle">Browse the assets offered by {dbUser.companyName || 'your company'} and send a request to your HR Manager.</p>

      <div className="af-card p-4 mt-6 grid gap-3 md:grid-cols-3">
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by asset name…" className="af-input" />
        <select value={availability} onChange={(e) => { setAvailability(e.target.value); setPage(1); }} className="af-input">
          <option value="">All availability</option>
          <option value="available">Available</option>
          <option value="out-of-stock">Out of stock</option>
        </select>
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="af-input">
          <option value="">All types</option>
          <option value="returnable">Returnable</option>
          <option value="non-returnable">Non-returnable</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : assets.length === 0 ? (
        <p className="mt-8 text-slate-500 text-sm">No assets match your search right now.</p>
      ) : (
        <div className="af-card overflow-x-auto mt-6">
          <table className="table af-table w-full min-w-[640px]">
            <thead><tr><th>Asset Name</th><th>Asset Type</th><th>Availability</th><th>Action</th></tr></thead>
            <tbody>
              {assets.map((a) => {
                const available = Number(a.quantity) > 0;
                return (
                  <tr key={a._id}>
                    <td className="font-medium">{a.productName}</td>
                    <td className="capitalize">{a.productType}</td>
                    <td>
                      {available
                        ? <span className="badge badge-success">Available</span>
                        : <span className="badge badge-error">Out of stock</span>}
                    </td>
                    <td>
                      <button
                        disabled={!available}
                        onClick={() => { setSelectedAsset(a); setNote(''); }}
                        className="btn btn-sm bg-teal-700 hover:bg-teal-800 text-white border-none disabled:opacity-40"
                      >
                        Request
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />

      {selectedAsset && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold">Request: {selectedAsset.productName}</h3>
            <p className="text-sm text-slate-500 mt-1 capitalize">{selectedAsset.productType} asset</p>
            <label className="af-label mt-5">Additional Notes</label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={3}
              placeholder="Anything your HR Manager should know — for example, why you need it or when."
              className="af-input"
            />
            <div className="flex gap-3 mt-6">
              <button onClick={() => setSelectedAsset(null)} className="btn btn-outline flex-1">Close</button>
              <button onClick={handleRequest} disabled={submitting} className="af-btn-primary flex-1">
                {submitting ? 'Sending…' : 'Request'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default RequestAsset;
