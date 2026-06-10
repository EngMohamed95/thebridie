import * as ftp from 'basic-ftp';

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
    const list = await client.list();
    console.log('Files on server:');
    list.forEach(f => console.log(' ', f.type === 2 ? '[DIR]' : '[FILE]', f.name));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.close();
  }
}
check();
