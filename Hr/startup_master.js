const { spawn } = require('child_process');
const path = require('path');

async function runService(name, dir, command, args = '', env = {}) {
    const fullDir = path.resolve(__dirname, dir);
    console.log(`[ORCHESTRATOR] Launching ${name}...`);

    // Prepare environment variables
    const envString = Object.entries(env)
        .map(([key, value]) => `$env:${key}='${value}';`)
        .join(' ');

    // Robust PowerShell escaping
    const innerCommand = `${envString} Set-Location -LiteralPath \\"${fullDir}\\"; ${command} ${args}`;
    const psCommand = `Start-Process powershell.exe -ArgumentList \\"-NoExit\\", \\"-Command\\", \\"${innerCommand}\\"`;
    
    spawn('powershell.exe', ['-Command', psCommand], {
        stdio: 'ignore',
        detached: true,
        shell: true
    });

    // Small delay to prevent process overlap
    await new Promise(resolve => setTimeout(resolve, 800));
}

function openBrowser(url) {
    // Use 'start' command specifically for Windows URLs
    spawn('cmd', ['/c', 'start', url], { detached: true, stdio: 'ignore' });
}

async function startAll() {
    console.log('[ORCHESTRATOR] Expected ports: gateway 8081, portal 3005, employee 8000/5173, tech 5000/3003, helpdesk 5005/3004, location 3017/3007.');

    // 1. HR Backend / Auth Gateway (Port 8081)
    await runService('HR Backend Gateway', 'backend', 'npm', 'run dev', { PORT: 8081 });

    // 1.5 Adminster Unified Backend (Port 5001)
    await runService('Adminster Backend', '../adminster/backend', 'npm', 'run dev');

    // 2. Main Platform Hub & Landing Page (Port 3005)
    await runService('WorkPulse Hub', '../web-page/frontend', 'npm', 'run dev -- --port 3005 --host 127.0.0.1');

    // 4. Employee Ecosystem (Port 8000)
    await runService('Employee API', 'Employee/backend', 'python', 'manage.py runserver 127.0.0.1:8000');

    // 5. Employee Hub UI (Port 5173)
    await runService('Employee Hub UI', 'Employee/frontend', 'npm', 'run dev -- --port 5173 --host 127.0.0.1');

    // 6. Tech Lead API (Port 5000)
    await runService('Tech Lead API', 'tech_lead/backend', 'npm', 'run dev', { PORT: 5000 });

    // 7. Tech Lead Hub UI (Port 3003)
    await runService('Tech Lead Hub UI', 'tech_lead/frontend', 'npm', 'run dev -- --port 3003 --host 127.0.0.1');

    // 8. IT Helpdesk API (Port 5005)
    await runService('IT Helpdesk API', 'IT Helpdesk Ticketing System/server', 'node', 'server.js', { PORT: 5005, CLIENT_URL: 'http://127.0.0.1:3004' });

    // 9. IT Helpdesk Hub UI (Port 3004)
    await runService('IT Helpdesk Hub UI', 'IT Helpdesk Ticketing System/client', 'npm', 'run dev -- --port 3004 --host 127.0.0.1');

    // 10. AI Marketing & Sales (Port 3006)
    await runService('AI Marketing & Sales', 'marketing_sales', 'node', 'startup.js');

    // 11. Location Tracker (Port 3007)
    await runService('Location Server', 'Location/server', 'node', 'index.js', { PORT: 3017, CLIENT_URL: 'http://127.0.0.1:3007' });
    await runService('Location Client Hub', 'Location/client', 'npm', 'run dev -- --port 3007 --host 127.0.0.1');

    console.log('All services launched in separate windows.');

    // Open the Main WorkPulse Hub after a delay
    setTimeout(() => {
        console.log('Opening WorkPulse Entry Point...');
        openBrowser('http://127.0.0.1:3005'); 
    }, 12000);
}

startAll();
