import dns from 'dns';
import http from 'http';
import https from 'https';

dns.lookup('thebridie.com', (err, address, family) => {
  if (err) {
    console.error('DNS Lookup Error:', err);
    return;
  }
  console.log(`thebridie.com resolves to IP: ${address} (family: IPv${family})`);
});

dns.resolveMx('thebridie.com', (err, addresses) => {
  if (err) {
    console.error('MX Lookup Error:', err);
  } else {
    console.log('MX Records:', addresses);
  }
});

https.get('https://thebridie.com', (res) => {
  console.log('HTTPS GET Status Code:', res.statusCode);
  console.log('Headers:', res.headers);
}).on('error', (err) => {
  console.error('HTTPS GET Error:', err.message);
});
