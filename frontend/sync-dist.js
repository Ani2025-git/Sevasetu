import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function copyDir(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

const frontendDist = path.join(__dirname, 'dist');
const rootDist = path.join(__dirname, '..', 'dist');

// Copy both directions if one exists
if (fs.existsSync(frontendDist) && !fs.existsSync(rootDist)) {
  copyDir(frontendDist, rootDist);
  console.log('Synced dist from frontend/dist to root dist/');
} else if (fs.existsSync(rootDist) && !fs.existsSync(frontendDist)) {
  copyDir(rootDist, frontendDist);
  console.log('Synced dist from root dist/ to frontend/dist');
} else if (fs.existsSync(frontendDist) && fs.existsSync(rootDist)) {
  copyDir(frontendDist, rootDist);
  console.log('Synchronized dist folders across root and frontend');
}

