const fs = require('fs');
const path = require('path');

const dbPath = path.join(process.cwd(), 'db.json');
const serverPath = path.join(process.cwd(), 'server.ts');

if (fs.existsSync(dbPath) && fs.existsSync(serverPath)) {
  const dbData = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
  let serverCode = fs.readFileSync(serverPath, 'utf8');

  const videosFormatted = JSON.stringify(dbData.videos, null, 4);
  
  // Replace videos: [...] in INITIAL_DB
  const regex = /videos:\s*\[[\s\S]*?\n  \],/
  if (regex.test(serverCode)) {
    serverCode = serverCode.replace(regex, `videos: ${videosFormatted},`);
    fs.writeFileSync(serverPath, serverCode, 'utf8');
    console.log('server.ts successfully updated with 50 company videos!');
  } else {
    console.error('Could not match videos array pattern in server.ts');
  }
}
