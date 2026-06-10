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

async function upload() {
  const client = new ftp.Client();
  try {
    await client.access(config);
    await client.cd('/public_html');
    await client.uploadFrom(
      path.join('C:', 'Users', 'aldawlia', 'Desktop', 'al-jawhara', 'htaccess-new'),
      '.htaccess'
    );
    console.log('.htaccess updated!');
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.close();
  }
}
upload();
