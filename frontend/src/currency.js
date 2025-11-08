export const formatINR = (value) => {
  const number = Number(value || 0);
  try {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2,
    }).format(number);
  } catch {
    // Fallback if Intl is unavailable
    return `₹${number.toFixed(2)}`;
  }
};
