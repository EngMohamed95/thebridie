import dns from 'dns';

dns.reverse('85.17.244.165', (err, hostnames) => {
  if (err) {
    console.error('Reverse DNS lookup failed:', err.message);
    return;
  }
  console.log('Hostnames resolving to this IP (Reverse DNS/PTR):');
  hostnames.forEach(h => console.log(' - ' + h));
});
