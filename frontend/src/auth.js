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

// Get the authenticated admin
export const getAdmin = () => {
  try {
    const admin = localStorage.getItem('admin');
    return admin ? JSON.parse(admin) : null;
  } catch {
    return null;
  }
};

// Set the authenticated admin
export const setAdmin = (admin) => {
  if (admin) {
    localStorage.setItem('admin', JSON.stringify(admin));
    // notify listeners about auth change
    try { window.dispatchEvent(new CustomEvent('authChange', { detail: admin })); } catch (e) {}
  }
};

// Clear the authenticated admin
export const clearAdmin = () => {
  localStorage.removeItem('admin');
  try { window.dispatchEvent(new CustomEvent('authChange', { detail: null })); } catch (e) {}
};

// Check if admin is authenticated
export const isAdminAuthenticated = () => {
  const admin = getAdmin();
  return !!admin && admin.email === 'admin@dbms.com';
};
