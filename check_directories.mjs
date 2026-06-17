import * as ftp from 'basic-ftp';

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

    // Check if we can cd to /public_html
    try {
      console.log('Trying to cd to /public_html...');
      await client.cd('/public_html');
      console.log('Successfully cd-ed to /public_html. Current dir:', client.pwd);
      const list = await client.list();
      console.log(`Contents of /public_html (count: ${list.length}):`);
      list.forEach(f => console.log(` - ${f.name} (type: ${f.type}, size: ${f.size})`));
    } catch (e) {
      console.log('Failed to cd to /public_html:', e.message);
    }

    // Check if we can cd to /www
    try {
      console.log('\nTrying to cd to /www...');
      await client.cd('/www');
      console.log('Successfully cd-ed to /www. Current dir:', client.pwd);
      const list = await client.list();
      console.log(`Contents of /www (count: ${list.length}):`);
      list.forEach(f => console.log(` - ${f.name} (type: ${f.type}, size: ${f.size})`));
    } catch (e) {
      console.log('Failed to cd to /www:', e.message);
    }

  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.close();
  }
}

run();
