# How to Test Offline Mode (PWA)

## Testing on Desktop
1. Run `npm run build`.
2. Run `npm run preview`.
3. Open `http://localhost:4173`.
4. Open Chrome DevTools (F12) -> **Application** tab.
5. Go to **Service Workers** -> Check **"Offline"**.
6. Refresh the page. The app should still load.
