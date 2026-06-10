import { Client } from 'ssh2';

const conn = new Client();

conn.on('ready', () => {
  console.log('SSH Connected!');
  conn.exec('find / -name "*MobileJawharaLogo*" 2>/dev/null', (err, stream) => {
    if (err) throw err;
    stream.on('data', (data) => {
      console.log('Found:', data.toString());
    });
    stream.stderr.on('data', (data) => {
      console.error('STDERR:', data.toString());
    });
    stream.on('close', () => {
      conn.end();
    });
  });
});

conn.on('error', err => console.error('Connection error:', err.message));

conn.connect({
  host: '85.17.244.165',
  port: 22,
  username: 'root',
  password: 'Hzj5utDMZ5QE9tJ4',
  readyTimeout: 30000,
});
