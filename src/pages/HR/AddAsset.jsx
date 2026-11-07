import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useCurrentUser from '../../hooks/useCurrentUser';

const AddAsset = () => {
  const axiosSecure = useAxiosSecure();
  const { dbUser } = useCurrentUser();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = e.target;
    const payload = {
      productName: form.productName.value.trim(),
      productType: form.productType.value,
      quantity: parseInt(form.quantity.value, 10),
      dateAdded: new Date().toISOString(),
      hrEmail: dbUser?.email,
      companyName: dbUser?.companyName,
      companyLogo: dbUser?.companyLogo,
    };
    try {
      const res = await axiosSecure.post('/assets', payload);
      if (res.data?.insertedId || res.status === 200 || res.status === 201) {
        Swal.fire({ icon: 'success', title: 'Asset added!', text: `${payload.productName} is now in your asset list.` });
        form.reset();
        navigate('/asset-list');
      }
    } catch (error) {
      Swal.fire({ icon: 'error', title: 'Could not add asset', text: error.response?.data?.message || error.message });
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <Helmet><title>AssetFlow | Add an Asset</title></Helmet>
      <div className="af-card p-8">
        <h2 className="text-2xl font-bold">Add an Asset</h2>
        <p className="text-sm text-slate-500 mt-2">Add equipment or supplies so your employees can request them.</p>
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="af-label">Product Name</label>
            <input name="productName" required placeholder="e.g. Dell Laptop, Office Chair, Notebook" className="af-input" />
          </div>
          <div>
            <label className="af-label">Product Type</label>
            <select name="productType" className="af-input" defaultValue="returnable">
              <option value="returnable">Returnable</option>
              <option value="non-returnable">Non-returnable</option>
            </select>
            <p className="text-xs text-slate-400 mt-1">Returnable items come back to stock when an employee returns them. Non-returnable supplies are consumed.</p>
          </div>
          <div>
            <label className="af-label">Product Quantity</label>
            <input name="quantity" type="number" min="1" required placeholder="e.g. 10" className="af-input" />
          </div>
          <button type="submit" className="af-btn-primary w-full">Add Asset</button>
        </form>
      </div>
    </div>
  );
};

export default AddAsset;
