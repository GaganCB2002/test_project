import mongoose from 'mongoose';
import { seedData } from '../data/seed';
import User from '../models/User';
import Employee from '../models/Employee';
import Attendance from '../models/Attendance';
import Payroll from '../models/Payroll';
import Performance from '../models/Performance';
import bcrypt from 'bcryptjs';

export const seedDatabase = async () => {
  try {
    const userCount = await User.countDocuments();
    if (userCount > 0) {
      console.log('[SEED] Database already has data. Skipping seed.');
      return;
    }

    console.log('[SEED] Seeding initial data...');

    // Seed Users
    const hashedUsers = seedData.users.map(u => ({
      ...u,
      passwordHash: bcrypt.hashSync(u.passwordSeed || 'Password@123', 10)
    }));
    await User.insertMany(hashedUsers);
    console.log(`[SEED] Inserted ${hashedUsers.length} users.`);

    // Seed Employees
    await Employee.insertMany(seedData.employees);
    console.log(`[SEED] Inserted ${seedData.employees.length} employees.`);

    // Seed Payroll
    await Payroll.insertMany(seedData.payroll);
    console.log(`[SEED] Inserted ${seedData.payroll.length} payroll records.`);

    // Seed Performance
    const performanceWithCycle = seedData.performance.map(p => ({
      ...p,
      reviewCycle: 'Q1 2026'
    }));
    await Performance.insertMany(performanceWithCycle);
    console.log(`[SEED] Inserted ${seedData.performance.length} performance records.`);

    console.log('[SEED] Seeding completed successfully.');
  } catch (error) {
    console.error('[SEED] Error during seeding:', error);
  }
};
