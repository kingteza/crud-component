// scripts/generate-index.js
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function readIndexFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const exportMatches = content.match(/export\s*{\s*([^}]+)\s*}/g);
    if (!exportMatches) return [];

    return exportMatches.flatMap(match => {
      const names = match.replace(/export\s*{\s*|\s*}/g, '').split(',');
      return names.map(name => name.trim().split(' as ')[0]);
    });
  } catch {
    return [];
  }
}

async function generateExports(dir) {
  const exports = new Set();
  const items = await fs.readdir(dir);

  for (const item of items) {
    const fullPath = path.join(dir, item);
    const stat = await fs.stat(fullPath);
    
    if (stat.isDirectory()) {
      const indexPath = path.join(fullPath, 'index.tsx');
      try {
        await fs.access(indexPath);
        // If index file exists, use its exports
        const componentNames = await readIndexFile(indexPath);
        const relativePath = path.relative(dir, fullPath).replace(/\\/g, '/');
        componentNames.forEach(name => {
          exports.add(`export { ${name} } from './${relativePath}';`);
        });
      } catch {
        // If no index file, scan directory
        const files = await fs.readdir(fullPath);
        for (const file of files) {
          if (file.endsWith('.tsx') && !file.endsWith('index.tsx')) {
            const componentName = path.parse(file).name;
            const relativePath = path.relative(dir, fullPath).replace(/\\/g, '/');
            exports.add(`export { default as ${componentName} } from './${relativePath}/${file.replace('.tsx', '')}';`);
          }
        }

        // Handle nested directories
        const nestedDirs = await Promise.all(
          files.map(async file => {
            const nestedPath = path.join(fullPath, file);
            const stats = await fs.stat(nestedPath);
            return { file, isDirectory: stats.isDirectory() };
          })
        );

        for (const { file, isDirectory } of nestedDirs) {
          if (isDirectory) {
            const nestedPath = path.join(fullPath, file);
            const nestedIndexPath = path.join(nestedPath, 'index.tsx');
            
            try {
              await fs.access(nestedIndexPath);
              const componentNames = await readIndexFile(nestedIndexPath);
              const relativePath = path.relative(dir, nestedPath).replace(/\\/g, '/');
              componentNames.forEach(name => {
                exports.add(`export { ${name} } from './${relativePath}';`);
              });
            } catch {
              const nestedFiles = await fs.readdir(nestedPath);
              for (const nestedFile of nestedFiles) {
                if (nestedFile.endsWith('.tsx') && !nestedFile.endsWith('index.tsx')) {
                  const componentName = path.parse(nestedFile).name;
                  const relativePath = path.relative(dir, nestedPath).replace(/\\/g, '/');
                  exports.add(`export { default as ${componentName} } from './${relativePath}/${nestedFile.replace('.tsx', '')}';`);
                }
              }
            }
          }
        }
      }
    }
  }

  return `/* eslint-disable react-refresh/only-export-components */\n${Array.from(exports).join('\n')}`;
}

const targetDir = process.argv[2];
if (!targetDir) {
  console.error('Please provide the target directory path');
  process.exit(1);
}

const componentsDir = path.resolve(targetDir);
const outputFile = path.join(componentsDir, 'index.tsx');

try {
  const exportStatements = await generateExports(componentsDir);
  await fs.writeFile(outputFile, exportStatements);
  console.log('index.tsx generated successfully!');
} catch (error) {
  console.error('Error:', error);
  process.exit(1);
}