import { FaCheckCircle, FaUsers } from 'react-icons/fa';
import { PACKAGES } from '../utils/packages';

const PackageCards = ({ onSelect, selectLabel = 'Choose Plan' }) => (
  <div className="grid gap-6 md:grid-cols-3">
    {PACKAGES.map((pkg) => (
      <div
        key={pkg.id}
        className={`af-card p-6 flex flex-col relative ${pkg.popular ? 'ring-2 ring-teal-600' : ''}`}
      >
        {pkg.popular && (
          <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-teal-700 text-white text-xs font-semibold px-3 py-1 rounded-full">
            Most Popular
          </span>
        )}
        <h3 className="text-lg font-bold text-slate-800">{pkg.name}</h3>
        <p className="text-sm text-slate-500 mt-1 flex-1">{pkg.description}</p>
        <div className="mt-4 flex items-end gap-1">
          <span className="text-4xl font-extrabold text-teal-700">${pkg.price}</span>
          <span className="text-slate-500 text-sm mb-1">/ package</span>
        </div>
        <p className="mt-1 text-sm font-medium text-slate-600 flex items-center gap-2">
          <FaUsers className="text-teal-600" /> Maximum {pkg.memberLimit} employees
        </p>
        <ul className="mt-4 space-y-2 text-sm text-slate-600">
          {pkg.features.map((f) => (
            <li key={f} className="flex gap-2">
              <FaCheckCircle className="text-teal-600 mt-0.5 shrink-0" /> {f}
            </li>
          ))}
        </ul>
        {onSelect && (
          <button onClick={() => onSelect(pkg)} className="af-btn-primary w-full mt-6">
            {selectLabel}
          </button>
        )}
      </div>
    ))}
  </div>
);

export default PackageCards;
