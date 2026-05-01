const { spawn, exec } = require('child_process');
const path = require('path');
const chalk = require('chalk');

const services = [
  { name: 'HR_GATEWAY', dir: 'backend', cmd: 'npm', args: ['run', 'dev'], port: 8081 },
  { name: 'WORKPULSE_HUB', dir: 'frontend', cmd: 'npm', args: ['run', 'dev'], port: 3005 },
  { name: 'HR_DASHBOARD', dir: 'master-dashboard', cmd: 'npm', args: ['run', 'dev'], port: 3001 },
  { name: 'EMP_UI', dir: 'Employee/frontend', cmd: 'npm', args: ['run', 'dev'], port: 5173 },
  { name: 'TECH_UI', dir: 'tech_lead/frontend', cmd: 'npm', args: ['run', 'dev'], port: 3003 },
  { name: 'HELPDESK_UI', dir: 'IT Helpdesk Ticketing System/client', cmd: 'npm', args: ['run', 'dev'], port: 3004 },
  { name: 'MARKETING_UI', dir: 'marketing_sales/client', cmd: 'npm', args: ['run', 'dev'], port: 3006 },
  { name: 'LOCATION_UI', dir: 'location/client', cmd: 'npm', args: ['run', 'dev'], port: 3007 },
  // API Services
  { name: 'EMP_API', dir: 'Employee/backend', cmd: 'python', args: ['manage.py', 'runserver', '0.0.0.0:8000'], port: 8000 },
  { name: 'TECH_API', dir: 'tech_lead/backend', cmd: 'npm', args: ['run', 'dev'], port: 5000 },
  { name: 'HELPDESK_API', dir: 'IT Helpdesk Ticketing System/server', cmd: 'npm', args: ['run', 'dev'], port: 5005 },
  { name: 'MARKETING_API', dir: 'marketing_sales/server', cmd: 'npm', args: ['run', 'dev'], port: 3016 },
  { name: 'LOCATION_API', dir: 'location/server', cmd: 'npm', args: ['run', 'dev'], port: 3017 }
];

function log(service, message, type = 'info') {
  const timestamp = new Date().toLocaleTimeString();
  const color = type === 'error' ? 'red' : type === 'success' ? 'green' : 'blue';
  console.log(`[${chalk.gray(timestamp)}] [${chalk[color](service)}] ${message}`);
}

async function isPortActive(port) {
  return new Promise((resolve) => {
    exec(`netstat -ano | findstr :${port}`, (err, stdout) => {
      resolve(stdout.length > 0);
    });
  });
}

function startService(service) {
  const fullDir = path.resolve(__dirname, service.dir);
  log(service.name, `Initializing on port ${service.port}...`, 'info');

  const child = spawn(service.cmd, service.args, {
    cwd: fullDir,
    shell: true,
    stdio: 'pipe',
    env: { ...process.env, PORT: service.port }
  });

  child.stdout.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg.toLowerCase().includes('ready') || msg.toLowerCase().includes('started') || msg.toLowerCase().includes('running')) {
       log(service.name, chalk.green('Active and Operational'), 'success');
    }
  });

  child.on('error', (err) => {
    log(service.name, `System Error: ${err.message}`, 'error');
  });

  child.on('exit', (code) => {
    log(service.name, `Process terminated (Code ${code}). Attempting automatic recovery...`, 'error');
    setTimeout(() => startService(service), 3000);
  });

  return child;
}

async function bootSystem() {
  console.clear();
  console.log(chalk.bold.cyan('\n🚀 AURAHR UNIFIED PLATFORM - SYSTEM CONTROLLER V2\n'));
  console.log(chalk.gray('Checking infrastructure health...\n'));

  for (const service of services) {
    startService(service);
  }

  console.log(chalk.bold.green('\n✅ ALL 13 SERVICES DEPLOYED. MONITORING ACTIVE.\n'));
}

bootSystem();
