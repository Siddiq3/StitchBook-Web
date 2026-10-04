// Matches the public monthly plans in StitchBook-Backend/src/services/subscription.service.js.
// Checkout always uses the server's authoritative price.

const commonIncluded = [
  { label: 'Customers', value: 'Unlimited', included: true },
  { label: 'Orders', value: 'Unlimited', included: true },
  { label: 'Measurements', value: 'Included', included: true },
  { label: 'Payments', value: 'Included', included: true },
  { label: 'Invoices & WhatsApp sharing', value: 'Included', included: true },
  { label: 'Business dashboard', value: 'Included', included: true },
];

export const plans = {
  basic: {
    label: 'Basic',
    planName: 'Basic',
    amount: 299,
    display: '₹299 / month',
    description: 'For a solo tailor.',
    bestFor: 'Solo tailor',
    access: '1 owner',
    staffLimit: 0,
    badge: null,
    featureRows: [
      ...commonIncluded,
      { label: 'Staff login', value: 'Not included', included: false },
      { label: 'Staff assignment', value: 'Not included', included: false },
      { label: 'Staff work & earnings ledger', value: 'Not included', included: false },
      { label: 'Reports', value: 'Basic', included: true },
      { label: 'Future automation', value: 'Not included', included: false },
      { label: 'Priority support', value: 'Not included', included: false },
    ],
  },
  team: {
    label: 'Team',
    planName: 'Team',
    amount: 399,
    display: '₹399 / month',
    description: 'For a small tailoring shop.',
    bestFor: 'Small shop',
    access: '1 owner + 2 staff logins',
    staffLimit: 2,
    badge: 'Most popular',
    featureRows: [
      ...commonIncluded,
      { label: 'Staff login', value: '2 staff', included: true },
      { label: 'Staff assignment', value: 'Included', included: true },
      { label: 'Staff work & earnings ledger', value: 'Included', included: true },
      { label: 'Reports', value: 'Full', included: true },
      { label: 'Future automation', value: 'Limited when available', included: true, planned: true },
      { label: 'Priority support', value: 'Not included', included: false },
    ],
  },
  pro: {
    label: 'Pro',
    planName: 'Pro',
    amount: 599,
    display: '₹599 / month',
    description: 'For a growing tailoring business.',
    bestFor: 'Growing shop',
    access: '1 owner + 5 staff logins',
    staffLimit: 5,
    badge: 'Room to grow',
    featureRows: [
      ...commonIncluded,
      { label: 'Staff login', value: '5 staff', included: true },
      { label: 'Staff assignment', value: 'Included', included: true },
      { label: 'Staff work & earnings ledger', value: 'Included', included: true },
      { label: 'Reports', value: 'Advanced', included: true },
      { label: 'Future automation', value: 'Full when available', included: true, planned: true },
      { label: 'Priority support', value: 'Included', included: true },
    ],
  },
};
