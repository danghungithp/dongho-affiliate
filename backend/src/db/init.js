import { initDb } from './sqlite.js';

// Initialize DB on server start
initDb().then(() => {
  console.log('SQLite DB initialized');
});
