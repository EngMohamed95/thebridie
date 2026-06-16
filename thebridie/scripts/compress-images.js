const fs = require('fs');
const path = require('path');
const { Jimp } = require('jimp');

const dir = path.join(__dirname, '..', 'public', 'products-image');

async function compress() {
  if (!fs.existsSync(dir)) {
    console.log('Directory not found:', dir);
    return;
  }

  // 1. Delete DSC01820.ARW if it exists
  const rawFile = path.join(dir, 'DSC01820.ARW');
  if (fs.existsSync(rawFile)) {
    console.log('Deleting unused raw camera file DSC01820.ARW (49.1 MB)...');
    fs.unlinkSync(rawFile);
  }

  const files = fs.readdirSync(dir);
  console.log(`Starting compression of ${files.length} images...`);

  for (const file of files) {
    const filePath = path.join(dir, file);
    const ext = path.extname(file).toLowerCase();

    if (ext === '.png' || ext === '.jpg' || ext === '.jpeg') {
      try {
        const stats = fs.statSync(filePath);
        const sizeMB = stats.size / 1024 / 1024;

        if (sizeMB > 0.5) {
          console.log(`Processing ${file} (${sizeMB.toFixed(2)} MB)...`);
          const image = await Jimp.read(filePath);
          
          // Resize to max width 800px
          if (image.width > 800) {
            image.resize({ w: 800 });
          }
          
          await image.write(filePath);
          const newStats = fs.statSync(filePath);
          const newSizeKB = newStats.size / 1024;
          console.log(` -> Compressed! New size: ${newSizeKB.toFixed(1)} KB`);
        } else {
          console.log(`Skipping ${file} (already small: ${(stats.size / 1024).toFixed(1)} KB)`);
        }
      } catch (err) {
        console.error(`Error processing ${file}:`, err.message);
      }
    }
  }

  console.log('All images processed!');
}

compress();
