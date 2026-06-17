import * as ftp from 'basic-ftp';
import https from 'https';

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

    console.log('Renaming .htaccess to .htaccess.bak ...');
    try {
      await client.rename('/.htaccess', '/.htaccess.bak');
      console.log('Renamed successfully!');
    } catch (e) {
      console.error('Rename failed:', e.message);
    }

    console.log('Waiting 3 seconds before testing HTTP request...');
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('Fetching https://thebridie.com...');
    https.get('https://thebridie.com', (res) => {
      console.log('HTTPS GET Status Code:', res.statusCode);
      console.log('Headers:', res.headers);
    }).on('error', (err) => {
      console.error('HTTPS GET Error:', err.message);
    });

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.close();
  }
}

run();
