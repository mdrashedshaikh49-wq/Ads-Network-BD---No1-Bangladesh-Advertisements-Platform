const fs = require('fs');
const dbPath = './db.json';
const db = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
db.videos = [];
fs.writeFileSync(dbPath, JSON.stringify(db, null, 2));
console.log('Successfully deleted all videos from db.json');
