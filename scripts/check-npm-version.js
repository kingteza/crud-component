#!/usr/bin/env node

/**
 * Custom semantic-release plugin to check if version exists on npm
 * If it exists, it will bump to the next patch version automatically
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function bumpPatchVersion(version) {
  const [major, minor, patch] = version.split('.').map(Number);
  return `${major}.${minor}.${patch + 1}`;
}

async function checkVersionExists(packageName, version) {
  try {
    const command = `npm view ${packageName}@${version} version 2>&1`;
    const result = execSync(command, { encoding: 'utf-8', stdio: 'pipe' }).trim();
    return result === version;
  } catch (error) {
    // Version doesn't exist or npm command failed
    return false;
  }
}

export default {
  async prepare(pluginConfig, context) {
    const { nextRelease, logger } = context;
    
    if (!nextRelease || !nextRelease.version) {
      return;
    }

    // Get package name from package.json
    const packageJsonPath = path.join(process.cwd(), 'package.json');
    let packageName = '@kingteza/crud-component';
    
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
      packageName = packageJson.name || packageName;
    } catch (error) {
      logger.warn(`Could not read package.json: ${error.message}`);
    }

    const calculatedVersion = nextRelease.version;
    let versionToUse = calculatedVersion;

    try {
      logger.log(`Checking if version ${calculatedVersion} exists on npm for ${packageName}`);
      
      const versionExists = await checkVersionExists(packageName, calculatedVersion);
      
      if (versionExists) {
        logger.warn(`⚠️  Version ${calculatedVersion} already exists on npm!`);
        versionToUse = bumpPatchVersion(calculatedVersion);
        logger.log(`📦 Automatically bumping to ${versionToUse}`);
        
        // Update nextRelease object
        nextRelease.version = versionToUse;
        nextRelease.gitTag = `v${versionToUse}`;
        nextRelease.name = `v${versionToUse}`;
        
        // Update package.json
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf-8'));
        packageJson.version = versionToUse;
        fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');
        
        logger.log(`✅ Updated package.json version to ${versionToUse}`);
        logger.log(`✅ Release will proceed with version ${versionToUse}`);
      } else {
        logger.log(`✅ Version ${calculatedVersion} is available for publishing.`);
      }
    } catch (error) {
      logger.warn(`⚠️  Could not verify npm version existence: ${error.message}`);
      logger.warn('Proceeding with release anyway...');
    }
  }
};

