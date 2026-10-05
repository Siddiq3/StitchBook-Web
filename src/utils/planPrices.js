export function formatPrice(amount) {
  return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 2, minimumFractionDigits: 0 }).format(amount);
}
export function applyPrices(details, rows) {
  if (!Array.isArray(rows)) throw new Error('Invalid price list');
  return Object.fromEntries(Object.entries(details).map(([key, plan]) => {
    const matches = rows.filter(row => row.key === key);
    const price = matches[0];
    if (matches.length !== 1 || price.currency !== 'INR' || price.duration !== 'month' ||
        typeof price.amount !== 'number' || !Number.isFinite(price.amount) || price.amount < 1 ||
        price.amount > 100000 || Math.abs(price.amount * 100 - Math.round(price.amount * 100)) > 0.000001) {
      throw new Error('Invalid price list');
    }
    return [key, { ...plan, amount: price.amount, price: formatPrice(price.amount), display: `${formatPrice(price.amount)} / month` }];
  }));
}
