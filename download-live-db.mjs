import * as ftp from 'basic-ftp';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const config = {
  host: 'aljawhara.matix.one',
  user: 'aljawharamatix',
  password: '^!Z~-VWSpQe*,.lk',
  secure: true,
  secureOptions: { rejectUnauthorized: false },
  port: 21,
};

async function downloadLive() {
  const client = new ftp.Client();
  try {
    await client.access(config);
    console.log('Connected to old FTP server!');
    
    const localDir = path.join(__dirname, 'jawhara', 'public', 'api');
    const localPath = path.join(localDir, 'data.json');
    const backupPath = path.join(localDir, 'data.json.bak');
    
    // Backup local if it exists
    if (fs.existsSync(localPath)) {
      fs.copyFileSync(localPath, backupPath);
      console.log('Backed up local data.json to data.json.bak');
    }
    
    await client.downloadTo(localPath, '/public_html/api/data.json');
    console.log('Downloaded production data.json successfully to ' + localPath);
    
  } catch (err) {
    console.error('Error downloading:', err.message);
  } finally {
    client.close();
  }
}
downloadLive();
