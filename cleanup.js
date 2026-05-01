const { execSync } = require('child_process');

const ports = [3005, 5001, 8081, 5000, 5005, 3003, 3004, 3006, 3007, 3017, 8000, 5173];

console.log('[CLEANUP] Searching for processes on enterprise ports...');

ports.forEach(port => {
    try {
        const output = execSync(`netstat -ano | findstr :${port}`).toString();
        const lines = output.split('\n');
        const pids = new Set();
        
        lines.forEach(line => {
            const parts = line.trim().split(/\s+/);
            if (parts.length > 4) {
                const pid = parts[parts.length - 1];
                if (pid && pid !== '0' && !isNaN(pid)) {
                    pids.add(pid);
                }
            }
        });

        pids.forEach(pid => {
            console.log(`[CLEANUP] Killing PID ${pid} on Port ${port}...`);
            try {
                execSync(`taskkill /F /PID ${pid}`);
            } catch (e) {
                // Ignore errors if process is already gone
            }
        });
    } catch (e) {
        // No process found on this port
    }
});

console.log('[CLEANUP] System cleaned. Ready for fresh launch.');
