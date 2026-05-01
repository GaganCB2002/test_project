const fs = require('fs');
const path = require('path');

const apps = [
  { name: 'Gateway', dir: 'backend' },
  { name: 'Hub', dir: 'frontend' },
  { name: 'HR Dashboard', dir: 'master-dashboard' },
  { name: 'Employee UI', dir: 'Employee/frontend' },
  { name: 'Tech UI', dir: 'tech_lead/frontend' },
  { name: 'Helpdesk UI', dir: 'IT Helpdesk Ticketing System/client' },
  { name: 'Marketing UI', dir: 'marketing_sales/client' },
  { name: 'Location UI', dir: 'location/client' },
  { name: 'Tech API', dir: 'tech_lead/backend' },
  { name: 'Helpdesk API', dir: 'IT Helpdesk Ticketing System/server' },
  { name: 'Marketing API', dir: 'marketing_sales/server' },
  { name: 'Location API', dir: 'location/server' }
];

console.log('--- AURAHR INFRASTRUCTURE AUDIT ---\n');

apps.forEach(app => {
  const fullPath = path.resolve(__dirname, app.dir);
  const hasModules = fs.existsSync(path.join(fullPath, 'node_modules'));
  const hasPackage = fs.existsSync(path.join(fullPath, 'package.json'));
  
  console.log(`[${app.name.padEnd(15)}] Path: ${app.dir}`);
  console.log(`                Package.json: ${hasPackage ? '✅' : '❌'}`);
  console.log(`                Node Modules: ${hasModules ? '✅' : '❌'}`);
  
  if (hasPackage && !hasModules) {
    console.log(`                Action Required: run 'npm install' in this directory.`);
  }
  console.log('');
});
