import * as ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';

// TODO: Replace with your new hosting FTP credentials
const config = {
  host: 'aljawhara.matix.one', // Replace with your new FTP host (e.g., 'ftp.thebridie.com')
  user: 'aljawharamatix',     // Replace with your new FTP username
  password: '^!Z~-VWSpQe*,.lk', // Replace with your new FTP password
  secure: true,
  secureOptions: { rejectUnauthorized: false },
  port: 21,
};

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const LOCAL_BUILD = path.join(__dirname, 'jawhara', 'build');
const REMOTE_DIR  = '/public_html';

async function deploy() {
  const client = new ftp.Client();
  client.ftp.verbose = false;

  try {
    console.log('Connecting...');
    await client.access(config);
    console.log('Connected!');
    console.log('Local path:', LOCAL_BUILD);
    console.log('Uploading to', REMOTE_DIR, '...');
    await client.ensureDir(REMOTE_DIR);
    await client.clearWorkingDir();
    await client.uploadFromDir(LOCAL_BUILD);
    console.log('Done! https://thebridie.com'); // TODO: Update to your new domain
  } catch (err) {
    console.error('Error:', err.message);
    console.error(err.stack);
  } finally {
    client.close();
  }
}

deploy();
