import { Client } from 'ssh2';

const conn = new Client();

const commands = [
  'find /home/aljawharamatix/ -iname "*logo*" 2>/dev/null',
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
      if (err) { console.error('exec error:', err); runNext(); return; }
      
      stream.on('data', d => process.stdout.write(d.toString()));
      stream.stderr.on('data', d => process.stdout.write(d.toString()));
      stream.on('close', runNext);
    });
  };
  
  runNext();
});

conn.on('error', err => console.error('Connection error:', err.message));

conn.connect({
  host: 'aljawhara.matix.one',
  port: 22,
  username: 'aljawharamatix',
  password: '^!Z~-VWSpQe*,.lk',
  readyTimeout: 20000,
});
