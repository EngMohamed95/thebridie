import { Client } from 'ssh2';

const conn = new Client();

const commands = [
  'hostname',
  'hostname -f',
  'cat /etc/hostname',
  'echo "=== Network Interfaces & IPs ==="',
  'ip addr show | grep -w inet',
];

conn.on('ready', () => {
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
