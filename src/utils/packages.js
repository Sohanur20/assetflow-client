export const PACKAGES = [
  {
    id: 'basic',
    name: 'Starter Team',
    memberLimit: 5,
    price: 5,
    description: 'For small teams getting their first asset register in order.',
    features: ['Up to 5 team members', 'Unlimited asset records', 'Returnable & non-returnable tracking', 'Request approval workflow'],
  },
  {
    id: 'standard',
    name: 'Growing Team',
    memberLimit: 10,
    price: 8,
    popular: true,
    description: 'For departments that share laptops, tools and supplies every day.',
    features: ['Up to 10 team members', 'Unlimited asset records', 'Returnable & non-returnable tracking', 'Request approval workflow', 'Stock alerts for low quantities'],
  },
  {
    id: 'premium',
    name: 'Full Office',
    memberLimit: 20,
    price: 15,
    description: 'For whole offices that need one clear view of every company asset.',
    features: ['Up to 20 team members', 'Unlimited asset records', 'Returnable & non-returnable tracking', 'Request approval workflow', 'Stock alerts for low quantities', 'Printable asset hand-over documents'],
  },
];

export const getPackageById = (id) => PACKAGES.find((p) => p.id === id) || PACKAGES[0];
export const getPackageByLimit = (limit) =>
  PACKAGES.find((p) => p.memberLimit === Number(limit)) || PACKAGES[0];
