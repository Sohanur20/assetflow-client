import { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useQuery } from '@tanstack/react-query';
import Swal from 'sweetalert2';
import toast from 'react-hot-toast';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Pagination from '../../components/Pagination';
import LoadingSpinner from '../../components/LoadingSpinner';

const PAGE_SIZE = 10;

const AssetList = () => {
  const axiosSecure = useAxiosSecure();
  const [search, setSearch] = useState('');
  const [stock, setStock] = useState('');
  const [type, setType] = useState('');
  const [sort, setSort] = useState('');
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState(null);

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['hr-assets', search, stock, type, sort, page],
    queryFn: async () => {
      const params = new URLSearchParams({ page, limit: PAGE_SIZE });
      if (search) params.set('search', search);
      if (stock) params.set('stock', stock);
      if (type) params.set('type', type);
      if (sort) params.set('sort', sort);
      const res = await axiosSecure.get(`/assets/hr?${params.toString()}`);
      return res.data;
    },
  });

  const assets = data?.assets || data?.result || (Array.isArray(data) ? data : []);
  const totalPages = data?.totalPages || Math.max(1, Math.ceil((data?.total || assets.length) / PAGE_SIZE));

  const handleDelete = async (asset) => {
    const confirm = await Swal.fire({
      title: `Delete ${asset.productName}?`,
      text: 'This asset will be removed from your list permanently.',
      icon: 'warning', showCancelButton: true, confirmButtonColor: '#b91c1c', confirmButtonText: 'Yes, delete it',
    });
    if (!confirm.isConfirmed) return;
    await axiosSecure.delete(`/assets/${asset._id}`);
    Swal.fire({ icon: 'success', title: 'Deleted', text: 'The asset has been removed.', timer: 1600, showConfirmButton: false });
    refetch();
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      productName: form.productName.value.trim(),
      productType: form.productType.value,
      quantity: parseInt(form.quantity.value, 10),
    };
    await axiosSecure.patch(`/assets/${editing._id}`, payload);
    toast.success('Asset updated successfully');
    setEditing(null);
    refetch();
  };

  return (
    <div>
      <Helmet><title>AssetFlow | Asset List</title></Helmet>
      <h2 className="section-title">Asset List</h2>
      <p className="section-subtitle">All assets registered for your company, with quantities kept up to date.</p>

      <div className="af-card p-4 mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-4">
        <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Search by product name…" className="af-input" />
        <select value={stock} onChange={(e) => { setStock(e.target.value); setPage(1); }} className="af-input">
          <option value="">All stock statuses</option>
          <option value="available">Available</option>
          <option value="out-of-stock">Out of stock</option>
        </select>
        <select value={type} onChange={(e) => { setType(e.target.value); setPage(1); }} className="af-input">
          <option value="">All types</option>
          <option value="returnable">Returnable</option>
          <option value="non-returnable">Non-returnable</option>
        </select>
        <select value={sort} onChange={(e) => { setSort(e.target.value); setPage(1); }} className="af-input">
          <option value="">Sort by quantity</option>
          <option value="asc">Quantity: Low to High</option>
          <option value="desc">Quantity: High to Low</option>
        </select>
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : assets.length === 0 ? (
        <p className="mt-8 text-slate-500 text-sm">No assets found. Add your first asset from the Add an Asset page.</p>
      ) : (
        <div className="af-card overflow-x-auto mt-6">
          <table className="table af-table w-full min-w-[720px]">
            <thead><tr><th>Product Name</th><th>Product Type</th><th>Product Quantity</th><th>Date Added</th><th>Update</th><th>Delete</th></tr></thead>
            <tbody>
              {assets.map((a) => (
                <tr key={a._id}>
                  <td className="font-medium">{a.productName}</td>
                  <td className="capitalize">{a.productType}</td>
                  <td>{a.quantity}</td>
                  <td>{a.dateAdded ? new Date(a.dateAdded).toLocaleDateString() : '—'}</td>
                  <td><button onClick={() => setEditing(a)} className="btn btn-xs btn-outline">Update</button></td>
                  <td><button onClick={() => handleDelete(a)} className="btn btn-xs btn-error text-white">Delete</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <Pagination page={page} setPage={setPage} totalPages={totalPages} />

      {editing && (
        <div className="fixed inset-0 bg-slate-950/50 z-50 flex items-center justify-center p-4">
          <form onSubmit={handleUpdate} className="bg-white rounded-2xl shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-bold">Update Asset</h3>
            <div className="space-y-4 mt-4">
              <div>
                <label className="af-label">Product Name</label>
                <input name="productName" defaultValue={editing.productName} required className="af-input" />
              </div>
              <div>
                <label className="af-label">Product Type</label>
                <select name="productType" defaultValue={editing.productType} className="af-input">
                  <option value="returnable">Returnable</option>
                  <option value="non-returnable">Non-returnable</option>
                </select>
              </div>
              <div>
                <label className="af-label">Product Quantity</label>
                <input name="quantity" type="number" min="0" defaultValue={editing.quantity} required className="af-input" />
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button type="button" onClick={() => setEditing(null)} className="btn btn-outline flex-1">Cancel</button>
              <button type="submit" className="af-btn-primary flex-1">Save Changes</button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};

export default AssetList;
