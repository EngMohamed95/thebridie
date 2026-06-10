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

async function check() {
  const client = new ftp.Client();
  try {
    await client.access(config);
    await client.cd('/public_html');
    
    await client.downloadTo('downloaded-htaccess', '.htaccess');
    const content = fs.readFileSync('downloaded-htaccess', 'utf8');
    console.log('--- .htaccess CONTENT ---');
    console.log(content);
    console.log('------------------------');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.close();
  }
}
check();
