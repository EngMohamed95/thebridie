const ftp = require('basic-ftp');
const path = require('path');
const fs = require('fs');

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
  client.ftp.verbose = true;
  try {
    await client.access(config);
    console.log('FTP Connected!');
    
    console.log('Listing /public_html/logos:');
    await client.cd('/public_html/logos');
    const list = await client.list();
    for (const item of list) {
      if (item.name === 'thebridie-logo.png') {
        console.log(`FOUND: ${item.name}, size: ${item.size} bytes`);
      }
    }
    
    // Let's force upload it from our local public folder to the server
    const localLogoPath = path.join(__dirname, 'public', 'logos', 'thebridie-logo.png');
    console.log('Uploading local logo directly from:', localLogoPath);
    await client.uploadFrom(localLogoPath, 'thebridie-logo.png');
    console.log('Upload complete.');
    
    const list2 = await client.list();
    for (const item of list2) {
      if (item.name === 'thebridie-logo.png') {
        console.log(`AFTER UPLOAD: ${item.name}, size: ${item.size} bytes`);
      }
    }
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.close();
  }
}

run();
