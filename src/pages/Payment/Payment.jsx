import { useMemo, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { useLocation, useNavigate, useSearchParams } from 'react-router-dom';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import Swal from 'sweetalert2';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import useCurrentUser from '../../hooks/useCurrentUser';
import { getPackageById, PACKAGES } from '../../utils/packages';
import LoadingSpinner from '../../components/LoadingSpinner';

const stripeKey = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY;
const stripePromise = stripeKey ? loadStripe(stripeKey) : null;

const CheckoutForm = ({ pkg, dbUser }) => {
  const stripe = useStripe();
  const elements = useElements();
  const axiosSecure = useAxiosSecure();
  const navigate = useNavigate();
  const { refetchDbUser } = useCurrentUser();
  const [processing, setProcessing] = useState(false);
  const [cardError, setCardError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!stripe || !elements) return;
    setProcessing(true);
    setCardError('');
    try {
      const intentRes = await axiosSecure.post('/create-payment-intent', { price: pkg.price });
      const clientSecret = intentRes.data.clientSecret;

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
          billing_details: { name: dbUser?.name || 'HR Manager', email: dbUser?.email },
        },
      });

      if (error) {
        setCardError(error.message);
        setProcessing(false);
        return;
      }

      if (paymentIntent.status === 'succeeded') {
        await axiosSecure.post('/payments', {
          email: dbUser.email,
          hrEmail: dbUser.email,
          transactionId: paymentIntent.id,
          price: pkg.price,
          amount: pkg.price,
          packageName: pkg.name,
          packageId: pkg.id,
          memberLimit: pkg.memberLimit,
          date: new Date().toISOString(),
        });
        await refetchDbUser();
        Swal.fire({
          icon: 'success',
          title: 'Payment successful!',
          text: `Your member limit is now ${pkg.memberLimit}. Welcome to AssetFlow, ${dbUser.companyName || 'your company'}!`,
        });
        navigate('/');
      }
    } catch (err) {
      Swal.fire({ icon: 'error', title: 'Payment failed', text: err.response?.data?.message || err.message });
    } finally {
      setProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-6">
      <label className="af-label">Card Details</label>
      <div className="border border-slate-300 rounded-lg px-3 py-3 bg-white">
        <CardElement options={{ style: { base: { fontSize: '16px', color: '#1e293b' } } }} />
      </div>
      {cardError && <p className="text-sm text-red-600 mt-2">{cardError}</p>}
      <button type="submit" disabled={!stripe || processing} className="af-btn-primary w-full mt-5">
        {processing ? 'Processing…' : `Pay $${pkg.price}`}
      </button>
      <p className="text-xs text-slate-400 mt-3 text-center">
        Test mode: use card 4242 4242 4242 4242 with any future expiry date and any CVC.
      </p>
    </form>
  );
};

const Payment = () => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { dbUser, dbUserLoading } = useCurrentUser();
  const navigate = useNavigate();

  const pkg = useMemo(() => {
    if (location.state?.pkg) return location.state.pkg;
    const q = searchParams.get('package');
    if (q) {
      const byId = PACKAGES.find((p) => p.id === q);
      if (byId) return byId;
      const byLimit = PACKAGES.find((p) => p.memberLimit === Number(q));
      if (byLimit) return byLimit;
    }
    if (dbUser?.packageId) return getPackageById(dbUser.packageId);
    if (dbUser?.memberLimit) return PACKAGES.find((p) => p.memberLimit === Number(dbUser.memberLimit)) || PACKAGES[0];
    return null;
  }, [location.state, searchParams, dbUser]);

  if (dbUserLoading) return <LoadingSpinner />;

  return (
    <div className="max-w-lg mx-auto">
      <Helmet><title>AssetFlow | Payment</title></Helmet>
      <div className="af-card p-8">
        <h2 className="text-2xl font-bold text-center">Complete Your Payment</h2>
        {!pkg ? (
          <div className="text-center mt-4">
            <p className="text-sm text-slate-500">No package was selected. Choose a package to continue.</p>
            <button onClick={() => navigate('/packages')} className="af-btn-primary mt-5">View Packages</button>
          </div>
        ) : (
          <>
            <div className="bg-teal-50 border border-teal-100 rounded-xl p-5 mt-6 text-center">
              <p className="text-sm text-slate-500">{dbUser?.companyName || 'Your company'}</p>
              <p className="text-xl font-bold mt-1">{pkg.name}</p>
              <p className="text-sm text-slate-600 mt-1">Up to {pkg.memberLimit} team members</p>
              <p className="text-4xl font-extrabold text-teal-700 mt-2">${pkg.price}</p>
            </div>

            {!stripePromise ? (
              <div className="mt-6 bg-amber-50 border border-amber-200 text-amber-800 rounded-xl p-4 text-sm">
                <p className="font-semibold">Stripe key not configured.</p>
                <p className="mt-1">
                  Add your Stripe publishable key as <code>VITE_STRIPE_PUBLISHABLE_KEY</code> in the client
                  <code> .env</code> file (and the matching secret key on the server) to enable card payments.
                  The checkout flow below is fully wired and will activate as soon as the key is present.
                </p>
                <button
                  onClick={() => navigate('/packages')}
                  className="btn btn-sm btn-outline mt-3"
                >
                  Back to Packages
                </button>
              </div>
            ) : (
              <Elements stripe={stripePromise}>
                <CheckoutForm pkg={pkg} dbUser={dbUser} />
              </Elements>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Payment;
