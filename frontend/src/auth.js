// Get the authenticated customer
export const getCustomer = () => {
  try {
    const customer = localStorage.getItem('customer');
    return customer ? JSON.parse(customer) : null;
  } catch {
    return null;
  }
};

// Set the authenticated customer
export const setCustomer = (customer) => {
  if (customer) {
    localStorage.setItem('customer', JSON.stringify(customer));
    // notify listeners about auth change
    try { window.dispatchEvent(new CustomEvent('authChange', { detail: customer })); } catch (e) {}
  }
};

// Clear the authenticated customer
export const clearCustomer = () => {
  localStorage.removeItem('customer');
  try { window.dispatchEvent(new CustomEvent('authChange', { detail: null })); } catch (e) {}
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!getCustomer();
};