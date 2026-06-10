import * as ftp from 'basic-ftp';

const config = {
  host: 'aljawhara.matix.one',
  user: 'aljawharamatix',
  password: '^!Z~-VWSpQe*,.lk',
  secure: true,
  secureOptions: { rejectUnauthorized: false },
  port: 21,
};

async function checkOld() {
  const client = new ftp.Client();
  try {
    await client.access(config);
    console.log('Connected to old FTP server!');
    
    // Check public_html
    await client.cd('/public_html');
    const rootList = await client.list();
    // Check FTP root /
    try {
      await client.cd('/');
      console.log('\nInside FTP root /:');
      const rootList = await client.list();
      rootList.forEach(f => console.log(' ', f.type === 2 ? '[DIR]' : '[FILE]', f.name));
    } catch (err) {
      console.log('Error listing FTP root:', err.message);
    }

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.close();
  }
}
checkOld();
