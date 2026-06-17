import * as ftp from 'basic-ftp';
import fs from 'fs';
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

    console.log('Downloading .htaccess from root...');
    await client.downloadTo('htaccess_downloaded', '/.htaccess');
    console.log('Downloaded .htaccess content:');
    let content = fs.readFileSync('htaccess_downloaded', 'utf8');
    console.log(content);

    // Modify the content: comment out Options line
    let newContent = content.replace(/^Options\s+/m, '# Options ');
    console.log('\nModified .htaccess content:');
    console.log(newContent);

    fs.writeFileSync('htaccess_modified', newContent, 'utf8');

    console.log('\nUploading modified .htaccess back to root...');
    await client.uploadFrom('htaccess_modified', '/.htaccess');
    console.log('Uploaded!');

    // Let's wait a moment and fetch the site
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
