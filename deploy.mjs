import * as ftp from 'basic-ftp';
import path from 'path';
import { fileURLToPath } from 'url';

const config = {
  host: '72.52.136.5', // Replace with your new FTP host (e.g., 'ftp.thebridie.com')
  user: 'thebridiecom',     // Replace with your new FTP username
  password: 'yH5+3-MNapc%AC{', // Replace with your new FTP password
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
