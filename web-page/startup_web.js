const { spawn } = require('child_process');
const path = require('path');

function runService(name, dir, command, args = '') {
    const fullDir = path.resolve(__dirname, dir);
    console.log(`[ORCHESTRATOR] Launching ${name}...`);
    
    // On Windows, using cmd /c is the most reliable way
    const psCommand = `Start-Process "cmd" -ArgumentList "/c ${command} ${args}" -WorkingDirectory '${fullDir}'`;
    
    const child = spawn('powershell', ['-Command', psCommand], {
        stdio: 'ignore',
        detached: true,
        shell: false
    });

    child.unref();
    return child;
}

// Launch Backend
runService('AuraHR Backend', 'web-page/backend', 'npm', 'run dev');

// Launch Frontend
runService('AuraHR Frontend', 'web-page/frontend', 'npm', 'run dev');

console.log('Centralized AuraHR Platform launched.');
console.log('Backend: http://127.0.0.1:8081');
console.log('Frontend: http://127.0.0.1:3005');

setTimeout(() => {
    console.log('Opening AuraHR Hub...');
    spawn('powershell', ['-Command', `Start-Process "http://127.0.0.1:3005"`], { shell: true });
}, 5000);
