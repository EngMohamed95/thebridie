import * as ftp from 'basic-ftp';
import fs from 'fs';
import path from 'path';

const config = {
  host: '72.52.136.5',
  user: 'thebridiecom',
  password: 'yH5+3-MNapc%AC{',
  secure: true,
  secureOptions: { rejectUnauthorized: false },
  port: 21,
};

const STRAY_FILES = [
  'asset-manifest.json',
  'favicon.ico',
  'logo192.png',
  'ceo.jpg',
  'logo512.png',
  'manifest.json',
  'index.html',
  'robots.txt',
  '.htaccess.bak',
  '.htaccess',
  'htaccess_downloaded',
  'htaccess_modified'
];

const STRAY_DIRS = [
  'static',
  'logos',
  'products-image',
  'api'
];

async function run() {
  const client = new ftp.Client();
  client.ftp.verbose = true;
  try {
    console.log('Connecting to FTP...');
    await client.access(config);
    console.log('Connected!');

    // 1. Download live db json from /api/data.json
    try {
      console.log('Trying to download data.json from /api/data.json...');
      await client.downloadTo('downloaded_data.json', '/api/data.json');
      console.log('Successfully downloaded database file!');
      const data = JSON.parse(fs.readFileSync('downloaded_data.json', 'utf8'));
      console.log('Collections in downloaded data.json:', Object.keys(data));
      
      // Save it to both public/api/data.json and as backup
      fs.copyFileSync('downloaded_data.json', 'thebridie/public/api/data.json');
      console.log('Saved to thebridie/public/api/data.json');
    } catch (e) {
      console.log('Could not download /api/data.json:', e.message);
    }

    // 2. Clean up stray files in root
    console.log('\nStarting cleanup of stray files in FTP root...');
    const list = await client.list('/');
    for (const item of list) {
      if (STRAY_FILES.includes(item.name)) {
        console.log(`Deleting file: ${item.name}`);
        try {
          await client.remove(item.name);
        } catch (e) {
          console.error(`Failed to delete file ${item.name}:`, e.message);
        }
      } else if (STRAY_DIRS.includes(item.name)) {
        console.log(`Deleting directory: ${item.name}`);
        try {
          await client.removeDir(item.name);
        } catch (e) {
          console.error(`Failed to delete directory ${item.name}:`, e.message);
        }
      } else {
        console.log(`Keeping system/safe item: ${item.name} (${item.type === 2 ? 'DIR' : 'FILE'})`);
      }
    }

    console.log('\nCleanup done!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.close();
  }
}

run();
