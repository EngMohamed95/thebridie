import * as ftp from 'basic-ftp';
import path from 'path';

const config = {
  host: 'aljawhara.matix.one',
  user: 'aljawharamatix',
  password: '^!Z~-VWSpQe*,.lk',
  secure: true,
  secureOptions: { rejectUnauthorized: false },
  port: 21,
};

const LOCAL = path.join('C:', 'Users', 'aldawlia', 'Desktop', 'al-jawhara', 'server-files');

async function upload() {
  const client = new ftp.Client();
  try {
    await client.access(config);
    console.log('Connected!');
    await client.ensureDir('/jawhara-api');
    await client.uploadFromDir(LOCAL);
    console.log('API files uploaded to /jawhara-api');
    
    // List what's there
    const list = await client.list();
    list.forEach(f => console.log(' -', f.name));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.close();
  }
}
upload();
