import { Helmet } from 'react-helmet-async';
import { useNavigate } from 'react-router-dom';
import useCurrentUser from '../../hooks/useCurrentUser';
import PackageCards from '../../components/PackageCards';

// HR "increase limit" view: picking a package goes to payment for it.
const Packages = () => {
  const navigate = useNavigate();
  const { dbUser } = useCurrentUser();

  const handleSelect = (pkg) => {
    navigate('/payment', { state: { pkg } });
  };

  return (
    <div>
      <Helmet><title>AssetFlow | Packages</title></Helmet>
      <h2 className="section-title">Increase Your Member Limit</h2>
      <p className="section-subtitle">
        {dbUser?.companyName ? `${dbUser.companyName} currently allows ${dbUser.memberLimit ?? 0} members with ${dbUser.teamCount ?? 0} already on the team. ` : ''}
        Pay for a package below and your member limit will be updated as soon as the payment succeeds.
      </p>
      <div className="mt-8">
        <PackageCards onSelect={handleSelect} selectLabel="Pay for This Package" />
      </div>
    </div>
  );
};

export default Packages;
