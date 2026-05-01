const { spawn } = require('child_process');
const path = require('path');

function runService(name, dir, command, args = '') {
    const fullDir = path.resolve(__dirname, dir);
    console.log(`Launching ${name} in ${fullDir}...`);
    
    // Using Start-Process to launch in a new window, which handles the complex paths better
    const psCommand = `Start-Process powershell -ArgumentList '-NoExit', '-Command', "cd '${fullDir}'; ${command} ${args}"`;
    
    spawn('powershell', ['-NoProfile', '-ExecutionPolicy', 'Bypass', '-Command', psCommand], {
        cwd: __dirname,
        stdio: 'inherit'
    });
}

console.log('--- STARTING FULL ENTERPRISE PROJECT FROM TECH LEAD MODULE ---');

// 1. HR Backend (Port 8081)
runService('HR Backend', '../backend', 'node', 'node_modules/tsx/dist/cli.mjs watch src/server.ts');

// 2. HR Frontend (Port 3000)
runService('HR Frontend', '../frontend', 'node', 'node_modules/vite/bin/vite.js');

// 3. Employee Backend (Port 8000 - Django)
runService('Employee Backend', '../xyz_Model/backend', '.\\venv\\Scripts\\python.exe', 'manage.py runserver 8000');

// 4. Employee Frontend (Port 5173)
runService('Employee Frontend', '../xyz_Model/frontend', 'node', 'node_modules/vite/bin/vite.js');

// 5. Tech Lead Backend (Port 5000)
runService('Tech Lead Backend', './backend', 'node', 'node_modules/nodemon/bin/nodemon.js src/index.js');

// 6. Tech Lead Frontend (Port 3001)
runService('Tech Lead Frontend', './frontend', 'node', 'node_modules/vite/bin/vite.js --port 3001');

console.log('All Enterprise Services launched in separate windows.');
