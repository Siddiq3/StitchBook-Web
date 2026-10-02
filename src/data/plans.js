// Matches the monthly plans in tailor-backend/src/services/subscription.service.js.
// Checkout always uses the server's authoritative price.
export const plans = {
  basic: {
    label: 'Basic',
    planName: 'Basic',
    amount: 299,
    display: '₹299 / month',
    description: 'For the independent tailor.',
    access: 'Shop owner',
    staffLimit: 0
  },
  team: {
    label: 'Team',
    planName: 'Team',
    amount: 399,
    display: '₹399 / month',
    description: 'For a shop that works together.',
    access: 'Owner + 2 staff members',
    staffLimit: 2,
    badge: 'Made for small teams'
  },
  pro: {
    label: 'Pro',
    planName: 'Pro',
    amount: 599,
    display: '₹599 / month',
    description: 'For a growing tailoring business.',
    access: 'Owner + 5 staff members',
    staffLimit: 5,
    badge: 'Room to grow'
  }
};
