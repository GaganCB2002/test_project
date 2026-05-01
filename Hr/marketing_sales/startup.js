const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function runProcess(name, command, args, cwd) {
  console.log(`Starting ${name}...`);
  // On Windows, use 'node' to run the JS file directly to avoid shell path issues
  const process = spawn(command, args, {
    cwd,
    stdio: 'inherit'
  });

  process.on('close', (code) => {
    console.log(`${name} process exited with code ${code}`);
  });

  return process;
}

const rootDir = __dirname;
const serverDir = path.join(rootDir, 'server');
const clientDir = path.join(rootDir, 'client');

// Paths to binaries
const nodemonPath = path.join(serverDir, 'node_modules', 'nodemon', 'bin', 'nodemon.js');
const vitePath = path.join(clientDir, 'node_modules', 'vite', 'bin', 'vite.js');

// Start Backend
runProcess('Backend', 'node', [nodemonPath, 'server.js'], serverDir);

// Start Frontend
runProcess('Frontend', 'node', [vitePath], clientDir);
