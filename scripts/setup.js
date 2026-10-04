#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const rootDir = path.resolve(__dirname, '..');
const backendDir = path.join(rootDir, 'backend');
const frontendDir = path.join(rootDir, 'frontend');

console.log('🚀 Checking Udyog Setu environment & dependencies...\n');

// 1. Check Node version
const nodeVersion = parseInt(process.versions.node.split('.')[0], 10);
if (nodeVersion < 18) {
  console.error(`❌ Node.js version 18+ is required. Found v${process.versions.node}`);
  process.exit(1);
}
console.log(`✅ Node.js v${process.versions.node} detected.`);

// 2. Setup backend .env
const backendEnvPath = path.join(backendDir, '.env');
const backendEnvExample = path.join(backendDir, '.env.example');
if (!fs.existsSync(backendEnvPath) && fs.existsSync(backendEnvExample)) {
  fs.copyFileSync(backendEnvExample, backendEnvPath);
  console.log('✅ Created backend/.env from .env.example');
} else {
  console.log('✅ backend/.env already exists.');
}

// 3. Setup frontend .env.local
const frontendEnvPath = path.join(frontendDir, '.env.local');
const frontendEnvExample = path.join(frontendDir, '.env.example');
if (!fs.existsSync(frontendEnvPath) && fs.existsSync(frontendEnvExample)) {
  fs.copyFileSync(frontendEnvExample, frontendEnvPath);
  console.log('✅ Created frontend/.env.local from .env.example');
} else {
  console.log('✅ frontend/.env.local already exists.');
}

// 4. Install backend dependencies if missing
const backendNodeModules = path.join(backendDir, 'node_modules');
if (!fs.existsSync(backendNodeModules)) {
  console.log('📦 Installing backend dependencies...');
  execSync('npm --prefix backend install', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ Backend dependencies installed.');
} else {
  console.log('✅ Backend dependencies already installed.');
}

// 5. Install frontend dependencies if missing
const frontendNodeModules = path.join(frontendDir, 'node_modules');
if (!fs.existsSync(frontendNodeModules)) {
  console.log('📦 Installing frontend dependencies...');
  execSync('npm --prefix frontend install', { stdio: 'inherit', cwd: rootDir });
  console.log('✅ Frontend dependencies installed.');
} else {
  console.log('✅ Frontend dependencies already installed.');
}

console.log('\n✨ Setup complete! Everything is ready to run.\n');
