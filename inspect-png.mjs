import fs from 'fs';
import path from 'path';

function getPngDimensions(filePath) {
  try {
    const buffer = fs.readFileSync(filePath);
    // Check if it's a valid PNG
    if (buffer.readUInt32BE(0) !== 0x89504E47) {
      return null;
    }
    const width = buffer.readUInt32BE(16);
    const height = buffer.readUInt32BE(20);
    return { width, height };
  } catch (err) {
    return null;
  }
}

const dir = 'thebridie/public';
console.log('PNG Image dimensions:');
const files = [
  'favicon.ico',
  'logo192.png',
  'logo512.png',
  'logos/fav-icon.png',
  'logos/carrefour.png',
  'logos/chilis.png',
  'logos/lulu.png',
  'logos/starbucks.png',
  'logos/sultan.png',
  'logos/talabat.png'
];

files.forEach(f => {
  const fullPath = path.join(dir, f);
  if (fs.existsSync(fullPath)) {
    const dims = getPngDimensions(fullPath);
    if (dims) {
      console.log(` - ${f}: ${dims.width}x${dims.height} (${fs.statSync(fullPath).size} bytes)`);
    } else {
      console.log(` - ${f}: Not a valid PNG or error (${fs.statSync(fullPath).size} bytes)`);
    }
  } else {
    console.log(` - ${f}: File does not exist`);
  }
});
