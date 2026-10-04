#!/usr/bin/env node

const { spawn, exec } = require('child_process');
const http = require('http');
const path = require('path');

const rootDir = path.resolve(__dirname, '..');

// Step 1: Run setup first
require('./setup.js');

console.log('🔄 Starting Backend (:4000) & Frontend (:3000)...\n');

const npmCmd = process.platform === 'win32' ? 'npm.cmd' : 'npm';

// Start backend
const backend = spawn(npmCmd, ['--prefix', 'backend', 'run', 'dev'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
});

// Start frontend
const frontend = spawn(npmCmd, ['--prefix', 'frontend', 'run', 'dev'], {
  cwd: rootDir,
  stdio: 'inherit',
  shell: true,
});

function openBrowser(url) {
  const start =
    process.platform === 'darwin'
      ? 'open'
      : process.platform === 'win32'
      ? 'start'
      : 'xdg-open';
  exec(`${start} ${url}`, (err) => {
    if (err) {
      console.log(`ℹ️ Frontend ready at ${url}`);
    } else {
      console.log(`🌐 Opened browser automatically at ${url}`);
    }
  });
}

// Poll for frontend ready
let browserOpened = false;
const checkInterval = setInterval(() => {
  const req = http.get('http://localhost:3000', (res) => {
    if (res.statusCode >= 200 && res.statusCode < 400 && !browserOpened) {
      browserOpened = true;
      clearInterval(checkInterval);
      console.log('\n🎉 Frontend is live at http://localhost:3000');
      openBrowser('http://localhost:3000');
    }
  });
  req.on('error', () => {
    // Still booting
  });
}, 1000);

// Cleanup on exit
function shutdown() {
  console.log('\n🛑 Shutting down Udyog Setu servers...');
  clearInterval(checkInterval);
  backend.kill();
  frontend.kill();
  process.exit();
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
