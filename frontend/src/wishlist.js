// Simple wishlist management using localStorage

const KEY = 'wishlist_ids';

const read = () => {
  try {
    const raw = localStorage.getItem(KEY);
    const arr = raw ? JSON.parse(raw) : [];
    return Array.isArray(arr) ? arr : [];
  } catch {
    return [];
  }
};

const write = (ids) => {
  try {
    localStorage.setItem(KEY, JSON.stringify(Array.from(new Set(ids))));
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
  if (!ids.includes(productId)) {
    ids.push(productId);
    write(ids);
  } else {
    write(ids);
  }
};

export const removeFromWishlist = (productId) => {
  const ids = read().filter((id) => String(id) !== String(productId));
  write(ids);
};

export const toggleWishlist = (productId) => {
  if (isLiked(productId)) removeFromWishlist(productId);
  else addToWishlist(productId);
};
