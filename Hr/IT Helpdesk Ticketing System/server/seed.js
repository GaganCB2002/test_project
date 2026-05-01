import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import User from './models/User.js';
import Ticket from './models/Ticket.js';
import Asset from './models/Asset.js';

dotenv.config();

const users = [
  { name: 'Admin User', email: 'admin@company.com', password: 'password123', role: 'admin', department: 'IT' },
  { name: 'Sarah Mitchell', email: 'sarah@company.com', password: 'password123', role: 'it_staff', department: 'IT Support' },
  { name: 'Mike Chen', email: 'mike@company.com', password: 'password123', role: 'it_staff', department: 'IT Support' },
  { name: 'John Doe', email: 'john@company.com', password: 'password123', role: 'employee', department: 'Engineering' },
  { name: 'Emily Davis', email: 'emily@company.com', password: 'password123', role: 'employee', department: 'Marketing' },
  { name: 'James Wilson', email: 'james@company.com', password: 'password123', role: 'employee', department: 'Sales' },
];

const tickets = [
  { title: 'Laptop screen flickering', description: 'My laptop screen started flickering intermittently. It happens especially when I move the laptop.', category: 'hardware', priority: 'high', status: 'open', createdByIndex: 3 },
  { title: 'VPN connection issues', description: 'Cannot connect to company VPN. Getting timeout errors after the latest Windows update.', category: 'network', priority: 'medium', status: 'in_progress', createdByIndex: 4 },
  { title: 'Software installation request', description: 'Need Adobe Creative Suite installed for design work.', category: 'software', priority: 'low', status: 'resolved', createdByIndex: 5 },
  { title: 'Keyboard not working', description: 'Several keys on my keyboard are not responding. Need replacement.', category: 'hardware', priority: 'critical', status: 'open', createdByIndex: 3 },
  { title: 'Email access problem', description: 'Cannot access my email account after password reset.', category: 'access', priority: 'high', status: 'open', createdByIndex: 4 },
];

const assets = [
  { name: 'Dell XPS 15 Laptop', type: 'Latitude XPS 9520', serialNumber: 'SN-DELL-001', category: 'laptop', status: 'assigned', assignedToIndex: 3, purchaseDate: new Date('2023-01-15'), warrantyExpiry: new Date('2026-01-15'), location: 'Office 301' },
  { name: 'Dell UltraSharp Monitor', type: 'U2722D', serialNumber: 'SN-DELL-002', category: 'monitor', status: 'assigned', assignedToIndex: 3, purchaseDate: new Date('2023-01-15'), warrantyExpiry: new Date('2026-01-15'), location: 'Office 301' },
  { name: 'MacBook Pro 14', type: 'M3 Pro', serialNumber: 'SN-APPL-001', category: 'laptop', status: 'available', purchaseDate: new Date('2024-03-01'), warrantyExpiry: new Date('2027-03-01'), location: 'IT Storage' },
  { name: 'Mechanical Keyboard', type: 'Logitech MX Mechanical', serialNumber: 'SN-LOGI-001', category: 'keyboard', status: 'assigned', assignedToIndex: 4, purchaseDate: new Date('2023-06-01'), warrantyExpiry: new Date('2025-06-01'), location: 'Office 405' },
  { name: 'Wireless Mouse', type: 'Logitech MX Master 3', serialNumber: 'SN-LOGI-002', category: 'mouse', status: 'assigned', assignedToIndex: 3, purchaseDate: new Date('2023-01-15'), warrantyExpiry: new Date('2025-01-15'), location: 'Office 301' },
  { name: 'Headset', type: 'Sony WH-1000XM5', serialNumber: 'SN-SONY-001', category: 'headset', status: 'maintenance', purchaseDate: new Date('2023-03-01'), warrantyExpiry: new Date('2025-03-01'), location: 'IT Repair' },
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/it_helpdesk');
    console.log('Connected to MongoDB');

    await User.deleteMany({});
    await Ticket.deleteMany({});
    await Asset.deleteMany({});
    console.log('Cleared existing data');

    const createdUsers = await User.insertMany(users.map(u => ({ ...u, password: bcrypt.hashSync(u.password, 12) })));
    console.log('Created ' + createdUsers.length + ' users');

    const ticketDocs = tickets.map(t => ({
      ...t,
      createdBy: createdUsers[t.createdByIndex]._id,
      assignedTo: t.assignedToIndex !== undefined ? createdUsers[t.assignedToIndex]._id : null,
      comments: [],
      attachments: []
    }));
    const createdTickets = await Ticket.insertMany(ticketDocs);
    console.log('Created ' + createdTickets.length + ' tickets');

    const assetDocs = assets.map(a => ({
      ...a,
      assignedTo: a.assignedToIndex !== undefined ? createdUsers[a.assignedToIndex]._id : null,
      history: a.assignedToIndex !== undefined ? [{
        action: 'assigned',
        to: createdUsers[a.assignedToIndex]._id,
        date: new Date()
      }] : []
    }));
    const createdAssets = await Asset.insertMany(assetDocs);
    console.log('Created ' + createdAssets.length + ' assets');

    console.log('\nSeed completed successfully!');
    console.log('\nDemo accounts:');
    console.log('  Admin: admin@company.com / password123');
    console.log('  IT Staff: sarah@company.com / password123');
    console.log('  Employee: john@company.com / password123');

    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
