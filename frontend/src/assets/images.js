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