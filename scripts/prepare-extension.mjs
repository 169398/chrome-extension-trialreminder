import { existsSync, mkdirSync, copyFileSync, readdirSync, lstatSync, cpSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const outDir = join(__dirname, '..', 'out');
const extensionDir = join(__dirname, '..', 'extension-dist');

// Create extension directory
if (!existsSync(extensionDir)) {
  mkdirSync(extensionDir);
}

// Copy manifest and background script
copyFileSync(
  join(__dirname, '..', 'public', 'manifest.json'),
  join(extensionDir, 'manifest.json')
);
copyFileSync(
  join(__dirname, '..', 'public', 'background.js'),
  join(extensionDir, 'background.js')
);

// Copy icons
const iconsDir = join(extensionDir, 'icons');
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir);
}
['16', '48', '128'].forEach(size => {
  copyFileSync(
    join(__dirname, '..', 'public', 'icons', `icon${size}.png`),
    join(iconsDir, `icon${size}.png`)
  );
});

// Copy build files
readdirSync(outDir).forEach(file => {
  if (!file.startsWith('_')) {
    const srcPath = join(outDir, file);
    const destPath = join(extensionDir, file);
    if (lstatSync(srcPath).isDirectory()) {
      cpSync(srcPath, destPath, { recursive: true });
    } else {
      copyFileSync(srcPath, destPath);
    }
  }
});

console.log('Extension files prepared in extension-dist directory'); 