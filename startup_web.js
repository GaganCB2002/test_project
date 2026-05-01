const { spawn } = require('child_process');
const path = require('path');

/**
 * Root Orchestrator: Delegates to the PowerShell Master Launcher
 * This is the most robust way to handle Windows path ampersands.
 */

console.log('=========================================');
console.log('AuraHR Enterprise Platform Orchestrator');
console.log('=========================================');
console.log('[ORCHESTRATOR] Delegating to PowerShell Master Launcher...');

const psScript = path.resolve(__dirname, 'Hr/start_full_project.ps1');

// Launch PowerShell script directly
const child = spawn('powershell.exe', ['-ExecutionPolicy', 'Bypass', '-File', psScript], {
    stdio: 'inherit'
});

child.on('error', (err) => {
    console.error('[ORCHESTRATOR] Failed to launch PowerShell Orchestrator:', err);
});
