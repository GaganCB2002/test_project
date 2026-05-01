import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const mockData = {
  User: [
    { _id: '1', name: 'Admin User', email: 'admin@company.com', password: bcrypt.hashSync('password123', 12), role: 'admin', department: 'IT', isActive: true, toJSON: function() { const u = {...this}; delete u.password; return u; }, comparePassword: async function(p) { return bcrypt.compareSync(p, this.password); } },
    { _id: '2', name: 'Sarah Mitchell', email: 'sarah@company.com', password: bcrypt.hashSync('password123', 12), role: 'it_staff', department: 'IT Support', isActive: true, toJSON: function() { const u = {...this}; delete u.password; return u; }, comparePassword: async function(p) { return bcrypt.compareSync(p, this.password); } },
    { _id: '3', name: 'John Doe', email: 'john@company.com', password: bcrypt.hashSync('password123', 12), role: 'employee', department: 'Engineering', isActive: true, toJSON: function() { const u = {...this}; delete u.password; return u; }, comparePassword: async function(p) { return bcrypt.compareSync(p, this.password); } }
  ],
  Ticket: [
    { _id: '101', title: 'Laptop screen flickering', description: 'Screen flickers when moving.', category: 'hardware', priority: 'high', status: 'open', createdBy: '3', createdAt: new Date() },
    { _id: '102', title: 'VPN Issues', description: 'Cannot connect to VPN.', category: 'network', priority: 'medium', status: 'in_progress', createdBy: '3', createdAt: new Date() }
  ],
  Asset: [
    { _id: '201', name: 'Dell XPS 15', type: 'Laptop', serialNumber: 'SN001', category: 'laptop', status: 'assigned', assignedTo: '3' }
  ],
  Notification: []
};

export const setupMocks = () => {
  if (mongoose.connection.readyState !== 0) return;

  console.log('--- Setting up Mongoose Mocks ---');

  const models = ['User', 'Ticket', 'Asset', 'Notification'];

  models.forEach(modelName => {
    try {
      const Model = mongoose.model(modelName);
      
      Model.findOne = async (query) => {
        console.log(`Mock ${modelName}.findOne`, query);
        if (query.email) return mockData[modelName].find(u => u.email === query.email);
        return mockData[modelName][0];
      };

      Model.find = async (query) => {
        console.log(`Mock ${modelName}.find`, query);
        return mockData[modelName];
      };

      Model.findById = async (id) => {
        console.log(`Mock ${modelName}.findById`, id);
        return mockData[modelName].find(u => u._id === id.toString());
      };

      Model.create = async (data) => {
        console.log(`Mock ${modelName}.create`, data);
        const newItem = { ...data, _id: Math.random().toString(36).substr(2, 9), createdAt: new Date(), toJSON: function() { return this; } };
        mockData[modelName].push(newItem);
        return newItem;
      };

      Model.findByIdAndUpdate = async (id, update, options) => {
        console.log(`Mock ${modelName}.findByIdAndUpdate`, id, update);
        const index = mockData[modelName].findIndex(u => u._id === id.toString());
        if (index !== -1) {
          mockData[modelName][index] = { ...mockData[modelName][index], ...update };
          return mockData[modelName][index];
        }
        return null;
      };

      // Mock save for model instances
      Model.prototype.save = async function() {
        console.log(`Mock ${modelName}.prototype.save`);
        return this;
      };

    } catch (e) {
      console.error(`Failed to mock ${modelName}:`, e.message);
    }
  });
};
