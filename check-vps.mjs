import { Client } from 'ssh2';

const conn = new Client();

const commands = [
  'echo "=== OS Version ==="',
  'cat /etc/os-release',
  'echo "=== Web Servers ==="',
  'nginx -v 2>&1 || echo "Nginx not found"',
  'apache2 -v 2>&1 || echo "Apache2 not found"',
  'httpd -v 2>&1 || echo "httpd not found"',
  'echo "=== Runtimes ==="',
  'php -v 2>&1 || echo "PHP not found"',
  'node -v 2>&1 || echo "Node not found"',
  'npm -v 2>&1 || echo "npm not found"',
  'echo "=== Process Managers & Services ==="',
  'pm2 -v 2>&1 || echo "PM2 not found"',
  'systemctl status nginx 2>&1 | head -n 5 || true',
  'systemctl status apache2 2>&1 | head -n 5 || true',
  'echo "=== Done ==="'
];

conn.on('ready', () => {
  console.log('SSH Connected to VPS!');
  
  let cmdIndex = 0;
  
  const runNext = () => {
    if (cmdIndex >= commands.length) {
      conn.end();
      return;
    }
    
    const cmd = commands[cmdIndex++];
    console.log('\n$ ' + cmd);
    
    conn.exec(cmd, (err, stream) => {
      if (err) {
        console.error('exec error:', err);
        runNext();
        return;
      }
      
      stream.on('data', d => process.stdout.write(d.toString()));
      stream.stderr.on('data', d => process.stdout.write(d.toString()));
      stream.on('close', runNext);
    });
  };
  
  runNext();
});

conn.on('error', err => console.error('Connection error:', err.message));

conn.connect({
  host: '85.17.244.165',
  port: 22,
  username: 'root',
  password: 'Hzj5utDMZ5QE9tJ4',
  readyTimeout: 30000,
});
