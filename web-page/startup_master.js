const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

function runService(name, dir, command, args = '') {
    const fullDir = path.resolve(__dirname, dir);
    console.log(`[ORCHESTRATOR] Launching ${name}...`);
    
    // On Windows, using cmd /c is the most reliable way to spawn processes
    // in new windows while handling special characters in paths.
    // The single quotes around -WorkingDirectory are CRITICAL for the '&' in the path.
    
    const psCommand = `Start-Process "cmd" -ArgumentList "/c ${command} ${args}" -WorkingDirectory '${fullDir}'`;
    
    const child = spawn('powershell', ['-Command', psCommand], {
        stdio: 'ignore',
        detached: true,
        shell: false
    });

    child.unref();
    return child;
}

function openBrowser(url) {
    spawn('powershell', ['-Command', `Start-Process "${url}"`], { shell: true });
}

// 0. Unified MERN Backend (Port 5001)
runService('Unified Backend', '../adminster/backend', 'npm', 'run dev -- --port 5001');

// 1. HR Backend (Port 8081)
runService('HR Backend', 'backend', 'npm', 'run dev');

// 2. Main Platform Hub & Landing Page (Port 3005)
runService('WorkPulse Main Hub', 'frontend', 'npm', 'run dev -- --port 3005');

// 4. Employee Backend (Port 8000)
const employeeBackendDir = path.resolve(__dirname, 'Employee/backend');
spawn('powershell', ['-Command', `Start-Process "cmd" -ArgumentList "/c python manage.py runserver 127.0.0.1:8000" -WorkingDirectory '${employeeBackendDir}'`], { 
    detached: true, 
    stdio: 'ignore' 
});

// 5. Employee Hub UI (Port 5173)
runService('Employee Hub UI', 'Employee/frontend', 'npm', 'run dev -- --port 5173');

// 6. Tech Lead API (Port 5000)
runService('Tech Lead API', 'tech_lead/backend', 'npm', 'run dev');

// 7. Tech Lead Hub UI (Port 3003)
runService('Tech Lead Hub UI', 'tech_lead/frontend', 'npm', 'run dev -- --port 3003');

// 8. IT Helpdesk API (Port 5005)
runService('IT Helpdesk API', 'IT Helpdesk Ticketing System/server', 'node', 'server.js');

// 9. IT Helpdesk Hub UI (Port 3004)
runService('IT Helpdesk Hub UI', 'IT Helpdesk Ticketing System/client', 'npm', 'run dev -- --port 3004');

// 10. AI Marketing & Sales (Port 3006)
runService('AI Marketing & Sales', 'marketing_sales', 'node', 'startup.js');

// 11. Location Tracker (Port 3007)
runService('Location Server', 'location/server', 'node', 'index.js');
runService('Location Client Hub', 'location/client', 'npm', 'run dev -- --port 3007');

console.log('All services launched in separate windows.');

// Open the Main WorkPulse Hub after a delay
setTimeout(() => {
    console.log('Opening WorkPulse Entry Point...');
    openBrowser('http://127.0.0.1:3005'); 
}, 8000);
