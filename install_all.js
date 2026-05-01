const { execSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const directories = [
    '.',
    'adminster/backend',
    'web-page/frontend',
    'Hr',
    'Hr/backend',
    'Hr/frontend',
    'Hr/Employee/frontend',
    'Hr/tech_lead/backend',
    'Hr/tech_lead/frontend',
    'Hr/IT Helpdesk Ticketing System/client',
    'Hr/IT Helpdesk Ticketing System/server',
    'Hr/marketing_sales',
    'Hr/Location/client',
    'Hr/Location/server'
];

console.log('Starting massive installation process...');

directories.forEach(dir => {
    const fullPath = path.resolve(__dirname, dir);
    if (fs.existsSync(fullPath)) {
        console.log(`\n--- Installing in: ${dir} ---`);
        try {
            // Check if package.json exists
            if (fs.existsSync(path.join(fullPath, 'package.json'))) {
                execSync('npm install', { cwd: fullPath, stdio: 'inherit' });
            } else {
                console.log(`Skipping ${dir} - no package.json found.`);
            }
        } catch (error) {
            console.error(`Error installing in ${dir}:`, error.message);
        }
    } else {
        console.warn(`Directory not found: ${dir}`);
    }
});

console.log('\nAll installations completed!');
