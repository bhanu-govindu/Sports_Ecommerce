// Hero background image.
// To use a local screenshot like the one you provided, place the image file
// at: frontend/public/hero.png
// It will then be served at the root path `/hero.png` by the dev server.
// This keeps the code free of static imports that would break the build if
// the file is missing. If you don't add a local `hero.png`, a remote image
// will be used instead.
// Remote default: high-quality composite sports equipment image (basketball, racket, shoe).
// You can still override it by placing a `hero.png` into `frontend/public/`.
// Using the new WebP image for better quality and compression
export const HERO_BG = '/hero.webp'

// Category background images - high energy action shots matching their sports
export const CATEGORIES = {
  BASKETBALL: 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=1280', // Basketball court and ball
  FOOTBALL: 'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=1280', // Football on stadium grass
  TENNIS: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1280', // Tennis court with net and ball
  CRICKET: 'https://images.pexels.com/photos/1308713/pexels-photo-1308713.jpeg?auto=compress&cs=tinysrgb&w=1280' // Cricket stadium and pitch
}

// Curated product imagery for consistent visuals across the app.
// Strategy:
// 1) If backend provides product.image_url -> use it.
// 2) Try to match by sport_type and category/product name keywords.
// 3) Fallback to a generic, high-quality image.

// Optional explicit mapping by product_id if you want per-product images.
// Example: export const PRODUCT_BY_ID = { 1: '/images/football-pro-ball.jpg' }
export const PRODUCT_BY_ID = {}

const IMG = {
  FOOTBALL: {
    BALL: 'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=1280',
    SHOES: 'https://images.pexels.com/photos/14088952/pexels-photo-14088952.jpeg?auto=compress&cs=tinysrgb&w=1280',
    GLOVES: 'https://images.pexels.com/photos/47731/football-american-ball-sport-47731.jpeg?auto=compress&cs=tinysrgb&w=1280',
    KIT: new URL('./football-jersey.jpg', import.meta.url).href,
    DEFAULT: 'https://images.pexels.com/photos/61135/pexels-photo-61135.jpeg?auto=compress&cs=tinysrgb&w=1280'
  },
  BASKETBALL: {
    BALL: 'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=1280',
    SHOES: 'https://images.pexels.com/photos/6532371/pexels-photo-6532371.jpeg?auto=compress&cs=tinysrgb&w=1280',
    HOOP: 'https://images.pexels.com/photos/1080882/pexels-photo-1080882.jpeg?auto=compress&cs=tinysrgb&w=1280',
    DEFAULT: 'https://images.pexels.com/photos/1103837/pexels-photo-1103837.jpeg?auto=compress&cs=tinysrgb&w=1280'
  },
  TENNIS: {
    RACKET: 'https://images.pexels.com/photos/573916/pexels-photo-573916.jpeg?auto=compress&cs=tinysrgb&w=1280',
    BALL: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1280',
    SHOES: 'https://images.pexels.com/photos/1492325/pexels-photo-1492325.jpeg?auto=compress&cs=tinysrgb&w=1280',
    DEFAULT: 'https://images.pexels.com/photos/1405355/pexels-photo-1405355.jpeg?auto=compress&cs=tinysrgb&w=1280'
  },
  CRICKET: {
    BAT: 'https://images.pexels.com/photos/1308713/pexels-photo-1308713.jpeg?auto=compress&cs=tinysrgb&w=1280',
    BALL: 'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=1280',
    GLOVES: 'https://images.pexels.com/photos/461307/pexels-photo-461307.jpeg?auto=compress&cs=tinysrgb&w=1280',
    PADS: 'https://images.pexels.com/photos/161493/cricket-sport-game-ball-161493.jpeg?auto=compress&cs=tinysrgb&w=1280',
    DEFAULT: 'https://images.pexels.com/photos/2570139/pexels-photo-2570139.jpeg?auto=compress&cs=tinysrgb&w=1280'
  },
  DEFAULT: 'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1280'
}

// Variant sets per sport to avoid identical images for many products
const SETS = {
  FOOTBALL: [
    'https://images.pexels.com/photos/47730/the-ball-stadion-football-the-pitch-47730.jpeg?auto=compress&cs=tinysrgb&w=1280',
    'https://images.pexels.com/photos/14088952/pexels-photo-14088952.jpeg?auto=compress&cs=tinysrgb&w=1280',
    'https://images.pexels.com/photos/3991879/pexels-photo-3991879.jpeg?auto=compress&cs=tinysrgb&w=1280',
    'https://images.pexels.com/photos/114296/pexels-photo-114296.jpeg?auto=compress&cs=tinysrgb&w=1280'
  ],
  BASKETBALL: [
    'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=1280',
    'https://images.pexels.com/photos/1103837/pexels-photo-1103837.jpeg?auto=compress&cs=tinysrgb&w=1280',
    'https://images.pexels.com/photos/1080882/pexels-photo-1080882.jpeg?auto=compress&cs=tinysrgb&w=1280',
    'https://images.pexels.com/photos/1752757/pexels-photo-1752757.jpeg?auto=compress&cs=tinysrgb&w=1280'
  ],
  TENNIS: [
    'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1280',
    'https://images.pexels.com/photos/573916/pexels-photo-573916.jpeg?auto=compress&cs=tinysrgb&w=1280',
    'https://images.pexels.com/photos/1405355/pexels-photo-1405355.jpeg?auto=compress&cs=tinysrgb&w=1280',
    'https://images.pexels.com/photos/1406003/pexels-photo-1406003.jpeg?auto=compress&cs=tinysrgb&w=1280'
  ],
  CRICKET: [
    'https://images.pexels.com/photos/1308713/pexels-photo-1308713.jpeg?auto=compress&cs=tinysrgb&w=1280',
    'https://images.pexels.com/photos/2570139/pexels-photo-2570139.jpeg?auto=compress&cs=tinysrgb&w=1280',
    'https://images.pexels.com/photos/1661950/pexels-photo-1661950.jpeg?auto=compress&cs=tinysrgb&w=1280',
    'https://images.pexels.com/photos/161493/cricket-sport-game-ball-161493.jpeg?auto=compress&cs=tinysrgb&w=1280'
  ],
  GENERIC: [
    'https://images.pexels.com/photos/209977/pexels-photo-209977.jpeg?auto=compress&cs=tinysrgb&w=1280',
    'https://images.pexels.com/photos/358042/pexels-photo-358042.jpeg?auto=compress&cs=tinysrgb&w=1280',
    'https://images.pexels.com/photos/1405355/pexels-photo-1405355.jpeg?auto=compress&cs=tinysrgb&w=1280',
    'https://images.pexels.com/photos/61135/pexels-photo-61135.jpeg?auto=compress&cs=tinysrgb&w=1280'
  ]
}

const kw = (s = '') => String(s).toLowerCase()
const hash = (s = '') => {
  let h = 5381
  for (let i = 0; i < s.length; i++) h = ((h << 5) + h) + s.charCodeAt(i)
  return Math.abs(h)
}
const pick = (key, arr) => arr[ arr.length ? (hash(String(key)) % arr.length) : 0 ]

export function getProductImage(product) {
  if (!product) return IMG.DEFAULT
  // 1) explicit field from backend, if available
  if (product.image_url) return product.image_url
  // 1b) explicit mapping by id (frontend override)
  if (product.product_id && PRODUCT_BY_ID[product.product_id]) return PRODUCT_BY_ID[product.product_id]

  const sport = String(product.sport_type || '').toUpperCase()
  const text = kw(product.category_name || product.product_name || '')
  const key = String(product.product_id || product.product_name || product.brand || product.category_name || 'sports')

  // Try fine categories first
  if (sport === 'FOOTBALL') {
    if (text.includes('shoe') || text.includes('boot') || text.includes('cleat')) return IMG.FOOTBALL.SHOES
    if (text.includes('glove')) return IMG.FOOTBALL.GLOVES
    if (text.includes('ball')) return IMG.FOOTBALL.BALL
    if (text.includes('kit') || text.includes('jersey')) return IMG.FOOTBALL.KIT
    return pick(key, SETS.FOOTBALL)
  }
  if (sport === 'BASKETBALL') {
    if (text.includes('shoe')) return IMG.BASKETBALL.SHOES
    if (text.includes('hoop') || text.includes('net') || text.includes('ring')) return IMG.BASKETBALL.HOOP
    if (text.includes('ball')) return IMG.BASKETBALL.BALL
    return pick(key, SETS.BASKETBALL)
  }
  if (sport === 'TENNIS') {
    if (text.includes('racket') || text.includes('racquet')) return IMG.TENNIS.RACKET
    if (text.includes('shoe')) return IMG.TENNIS.SHOES
    if (text.includes('ball')) return IMG.TENNIS.BALL
    return pick(key, SETS.TENNIS)
  }
  if (sport === 'CRICKET') {
    if (text.includes('bat')) return IMG.CRICKET.BAT
    if (text.includes('glove')) return IMG.CRICKET.GLOVES
    if (text.includes('pad')) return IMG.CRICKET.PADS
    if (text.includes('ball')) return IMG.CRICKET.BALL
    return pick(key, SETS.CRICKET)
  }

  // Generic guesses from keywords even if sport_type missing
  if (text.includes('racket') || text.includes('racquet')) return IMG.TENNIS.RACKET
  if (text.includes('cleat') || text.includes('boot')) return IMG.FOOTBALL.SHOES
  if (text.includes('jersey')) return IMG.FOOTBALL.KIT
  if (text.includes('basket')) return IMG.BASKETBALL.DEFAULT
  if (text.includes('shoe')) return IMG.TENNIS.SHOES

  return pick(key, SETS.GENERIC)
}
