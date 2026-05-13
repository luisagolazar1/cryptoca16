const KEY = 'fxca16_favorites';

export function getFavorites() {
  try {
    return JSON.parse(localStorage.getItem(KEY) || '[]');
  } catch { return []; }
}

export function toggleFavorite(symbol) {
  const favs = getFavorites();
  const idx = favs.indexOf(symbol);
  if (idx === -1) favs.push(symbol);
  else favs.splice(idx, 1);
  localStorage.setItem(KEY, JSON.stringify(favs));
  return favs;
}

export function isFavorite(symbol) {
  return getFavorites().includes(symbol);
}
