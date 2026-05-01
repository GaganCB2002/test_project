const fs = require('fs');
const path = require('path');

const dirs = [
    'storage/employee_data/documents',
    'storage/employee_data/images',
    'storage/employee_data/videos',
    'storage/employee_data/zip',
    'storage/tech_leads_data/documents',
    'storage/tech_leads_data/images',
    'storage/tech_leads_data/videos'
];

dirs.forEach(dir => {
    const fullPath = path.join(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
        fs.mkdirSync(fullPath, { recursive: true });
        console.log(`Created: ${fullPath}`);
    } else {
        console.log(`Exists: ${fullPath}`);
    }
});
