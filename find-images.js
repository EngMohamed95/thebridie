import fs from 'fs';
import path from 'path';

function getFiles(dir, files = []) {
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const name = path.join(dir, file);
    if (name.includes('node_modules') || name.includes('.git') || name.includes('build')) continue;
    if (fs.statSync(name).isDirectory()) {
      getFiles(name, files);
    } else {
      if (/\.(png|jpg|jpeg|svg|gif|webp)$/i.test(name)) {
        files.push(name);
      }
    }
  }
  return files;
}

const images = getFiles('.');
console.log('Found images:');
images.forEach(img => console.log(' -', img));
