// Wishlist management using localStorage, namespaced per user
import { getCustomer } from './auth'

const baseKey = 'wishlist_ids';
const keyForCurrentUser = () => {
  try {
    const c = getCustomer();
    return c && c.customer_id ? `${baseKey}_${c.customer_id}` : `${baseKey}_guest`;
  } catch {
    return `${baseKey}_guest`;
  }
};

// One-time migration: move legacy key 'wishlist_ids' to guest namespace
try {
  const legacy = localStorage.getItem(baseKey);
  if (legacy && !localStorage.getItem(`${baseKey}_guest`)) {
    localStorage.setItem(`${baseKey}_guest`, legacy);
    localStorage.removeItem(baseKey);
  }
} catch {}

const read = () => {
  try {
    const raw = localStorage.getItem(keyForCurrentUser());
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

const write = (ids) => {
  try {
    localStorage.setItem(keyForCurrentUser(), JSON.stringify(Array.from(new Set(ids))));
    try { window.dispatchEvent(new CustomEvent('wishlistChange')); } catch {}
  } catch {}
};

export const getWishlist = () => read();

export const isLiked = (productId) => {
  const ids = read();
  return ids.includes(String(productId)) || ids.includes(Number(productId));
};

export const addToWishlist = (productId) => {
  const ids = read();
  if (!ids.map(String).includes(String(productId))) {
    ids.push(productId);
  }
  write(ids);
};

export const removeFromWishlist = (productId) => {
  const ids = read().filter((id) => String(id) !== String(productId));
  write(ids);
};

export const toggleWishlist = (productId) => {
  if (isLiked(productId)) removeFromWishlist(productId);
  else addToWishlist(productId);
};

// When auth changes (login/logout), notify listeners so UIs refresh their view of the wishlist
try {
  window.addEventListener('authChange', () => {
    try { window.dispatchEvent(new CustomEvent('wishlistChange')); } catch {}
  });
} catch {}
