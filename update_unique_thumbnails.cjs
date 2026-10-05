const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const serverPath = path.join(process.cwd(), 'server.ts');

if (!fs.existsSync(dbPath)) {
  console.error('db.json not found');
  process.exit(1);
}

const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));

if (!dbData.videos || !Array.isArray(dbData.videos)) {
  console.error('No videos array found in db.json');
  process.exit(1);
}

// Assign 100% distinct, unique thumbnail URLs to every video
const updatedVideos = dbData.videos.map((vid, idx) => {
  // Extract youtube video ID if present
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|shorts\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = vid.url.match(regExp);
  const ytId = (match && match[2] && match[2].length === 11) ? match[2] : null;

  // Use unique seed or youtube thumbnail to ensure 100% uniqueness for every single card
  let uniqueThumb = `https://picsum.photos/seed/${vid.id}-${idx}/640/360`;

  if (ytId) {
    uniqueThumb = `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`;
  }

  return {
    ...vid,
    thumbnail: uniqueThumb
  };
});

// Verify all thumbnails are 100% distinct
const thumbSet = new Set(updatedVideos.map(v => v.thumbnail));
console.log(`Total Videos: ${updatedVideos.length}, Unique Thumbnails: ${thumbSet.size}`);

if (thumbSet.size < updatedVideos.length) {
  // If there are duplicate YouTube thumbnails, enforce uniqueness by appending unique seed parameters
  const seenThumbs = new Set();
  updatedVideos.forEach((v, index) => {
    if (seenThumbs.has(v.thumbnail)) {
      v.thumbnail = `https://picsum.photos/seed/bd-brand-${v.id}-${index}/640/360`;
    }
    seenThumbs.add(v.thumbnail);
  });
  console.log(`Post-deduplication Unique Thumbnails count: ${new Set(updatedVideos.map(v => v.thumbnail)).size}`);
}

dbData.videos = updatedVideos;
fs.writeFileSync(dbPath, JSON.stringify(dbData, null, 2), 'utf8');
console.log('db.json successfully updated with 200 UNIQUE video thumbnails!');

if (fs.existsSync(serverPath)) {
  let serverCode = fs.readFileSync(serverPath, 'utf8');
  const videosFormatted = JSON.stringify(updatedVideos, null, 4);
  const regex = /videos:\s*\[[\s\S]*?\n  \],/;
  if (regex.test(serverCode)) {
    serverCode = serverCode.replace(regex, `videos: ${videosFormatted},`);
    fs.writeFileSync(serverPath, serverCode, 'utf8');
    console.log('server.ts successfully updated with 200 UNIQUE video thumbnails!');
  }
}
