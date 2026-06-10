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
    const rootList = await client.list();
    console.log('--- ROOT FILES ---');
    rootList.forEach(f => console.log(' ', f.name, f.type, f.rawPermissions, f.permissions));
    
    await client.cd('/public_html/static');
    const staticList = await client.list();
    console.log('--- STATIC FILES ---');
    staticList.forEach(f => console.log(' ', f.name, f.type, f.rawPermissions, f.permissions));
  } catch (err) {
    console.error('Error:', err.message);
  } finally {
    client.close();
  }
}
check();
