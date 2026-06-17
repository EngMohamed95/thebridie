import * as ftp from 'basic-ftp';
import fs from 'fs';

const config = {
  host: '72.52.136.5',
  user: 'thebridiecom',
  password: 'yH5+3-MNapc%AC{',
  secure: true,
  secureOptions: { rejectUnauthorized: false },
  port: 21,
};

async function run() {
  const client = new ftp.Client();
  try {
    console.log('Connecting to FTP...');
    await client.access(config);
    console.log('Connected!');

    console.log('--- Listing FTP root (/) contents ---');
    const rootList = await client.list('/');
    for (const item of rootList) {
      console.log(` - ${item.name} (type: ${item.type}, size: ${item.size} bytes, permissions: ${JSON.stringify(item.permissions)})`);
    }

    // Try listing public_html if it exists
    const hasPublicHtml = rootList.some(item => item.name === 'public_html' && item.type === 2);
    if (hasPublicHtml) {
      console.log('--- Listing /public_html contents ---');
      const phList = await client.list('/public_html');
      for (const item of phList) {
        console.log(` - public_html/${item.name} (type: ${item.type}, size: ${item.size} bytes)`);
      }
    } else {
      console.log('No public_html folder in root!');
    }

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.close();
  }
}

run();
