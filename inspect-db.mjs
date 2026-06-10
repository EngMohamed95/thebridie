import { Client } from 'ssh2';

const conn = new Client();

const commands = [
  'echo "=== Docker Containers ==="',
  'docker ps 2>&1 || echo "Docker not installed/running"',
  'echo "=== Listening Ports ==="',
  'ss -tlnp | grep -E "3306|mysql|mariadb"',
  'echo "=== MySQL processes ==="',
  'ps aux | grep -iE "mysql|mariadb" | grep -v grep',
  'echo "=== MySQL info ==="',
  'mysqladmin -u aljwhra -pM5LLBcpan5bX4Jka variables | grep -E "port|version|socket"',
];

conn.on('ready', () => {
  console.log('SSH Connected!');
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
