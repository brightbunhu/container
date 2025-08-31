import connectDB from './mongodb';
import User from './models/User';
import Item from './models/Item';
import Component from './models/Component';
import KnowledgeBase from './models/KnowledgeBase';
import WorkLog from './models/WorkLog';
import bcrypt from 'bcryptjs';

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany({});
    await Item.deleteMany({});
    await Component.deleteMany({});
    await KnowledgeBase.deleteMany({});
    await WorkLog.deleteMany({});

    // Hash password for all users
    const defaultPassword = 'password123';
    const hashedPassword = await bcrypt.hash(defaultPassword, 12);

    // Seed Users
    const users = await User.create([
      {
        name: 'Admin User',
        email: 'admin@example.com',
        password: hashedPassword,
        role: 'ADMIN',
        status: 'ACTIVE',
        lastLoginAt: new Date(),
        avatar: 'https://i.pravatar.cc/150?u=admin@example.com',
      },
      {
        name: 'Holly OD',
        email: 'hod@example.com',
        password: hashedPassword,
        role: 'HOD',
        status: 'ACTIVE',
        department: 'Technology',
        lastLoginAt: new Date(),
        avatar: 'https://i.pravatar.cc/150?u=hod@example.com',
      },
      {
        name: 'Sam OS',
        email: 'hos@example.com',
        password: hashedPassword,
        role: 'HOS',
        status: 'ACTIVE',
        department: 'Technology',
        section: 'Hardware Support',
        lastLoginAt: new Date(),
        avatar: 'https://i.pravatar.cc/150?u=hos@example.com',
      },
      {
        name: 'Technician Tom',
        email: 'tech1@example.com',
        password: hashedPassword,
        role: 'TECHNICIAN',
        status: 'ACTIVE',
        department: 'Technology',
        section: 'Hardware Support',
        lastLoginAt: new Date(),
        avatar: 'https://i.pravatar.cc/150?u=tech1@example.com',
      },
      {
        name: 'Technician Tanya',
        email: 'tech2@example.com',
        password: hashedPassword,
        role: 'TECHNICIAN',
        status: 'SUSPENDED',
        department: 'Technology',
        section: 'Hardware Support',
        lastLoginAt: new Date(Date.now() - 24 * 60 * 60 * 1000),
        avatar: 'https://i.pravatar.cc/150?u=tech2@example.com',
      },
      {
        name: 'Employee Eve',
        email: 'employee1@example.com',
        password: hashedPassword,
        role: 'EMPLOYEE',
        status: 'ACTIVE',
        department: 'Sales',
        lastLoginAt: new Date(),
        avatar: 'https://i.pravatar.cc/150?u=employee1@example.com',
      },
    ]);

    // Seed Items
    const items = await Item.create([
      {
        assetTag: 'DT-2023-001',
        name: 'Dell Optiplex 7080',
        type: 'COMPUTER',
        status: 'DEAD',
        specs: {
          cpu: 'Intel Core i7-10700',
          ram: '16GB DDR4',
          storage: '512GB SSD',
          model: 'Optiplex 7080',
          serial: 'S/N: 12345ABC',
        },
        issueHistory: [
          {
            reportedBy: 'Employee Eve',
            description: 'Computer not powering on',
            severity: 'HIGH',
            diagnosis: 'Power supply failure',
            recommendedReusableParts: ['PSU'],
            createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
          },
        ],
        reusableParts: [
          {
            componentId: 'comp-001',
            name: '16GB DDR4 RAM',
            compatibleTypes: ['DDR4'],
            condition: 'GOOD',
            extractedFromIssueId: 'issue-001',
          },
        ],
        location: {
          site: 'Main Office',
          room: 'IT Department',
          shelf: 'A1',
        },
        notes: 'Power supply needs replacement',
      },
      {
        assetTag: 'DT-2023-002',
        name: 'HP LaserJet Pro M404n',
        type: 'PRINTER',
        status: 'ALIVE',
        specs: {
          model: 'LaserJet Pro M404n',
          serial: 'S/N: 67890DEF',
        },
        issueHistory: [],
        reusableParts: [],
        location: {
          site: 'Main Office',
          room: 'Print Room',
        },
        notes: 'Working properly',
      },
    ]);

    // Seed Components
    const components = await Component.create([
      {
        name: '16GB DDR4 RAM',
        category: 'RAM',
        specs: { capacity: '16GB', type: 'DDR4', speed: '3200MHz' },
        compatibilityTags: ['DDR4', 'Desktop'],
        quantity: 5,
        condition: 'GOOD',
      },
      {
        name: '500W Power Supply',
        category: 'PSU',
        specs: { wattage: '500W', efficiency: '80+ Bronze' },
        compatibilityTags: ['ATX', 'Desktop'],
        quantity: 3,
        condition: 'GOOD',
      },
      {
        name: '1TB SATA SSD',
        category: 'SSD',
        specs: { capacity: '1TB', interface: 'SATA', speed: '550MB/s' },
        compatibilityTags: ['SATA', '2.5inch'],
        quantity: 8,
        condition: 'GOOD',
      },
      {
        name: 'GTX 1660 Graphics Card',
        category: 'GPU',
        specs: { memory: '6GB GDDR5', interface: 'PCIe 3.0' },
        compatibilityTags: ['PCIe', 'Gaming'],
        quantity: 2,
        condition: 'FAIR',
      },
    ]);

    // Seed Knowledge Base
    const knowledgeBases = await KnowledgeBase.create([
      {
        title: 'Power Supply Replacement Guide',
        productType: 'Desktop Computer',
        symptoms: ['Computer not powering on', 'No response when power button pressed'],
        steps: [
          { order: 1, text: 'Unplug all power cables from the computer' },
          { order: 2, text: 'Remove the side panel of the computer case' },
          { order: 3, text: 'Locate the power supply unit' },
          { order: 4, text: 'Disconnect all power cables from motherboard and components' },
          { order: 5, text: 'Remove the old power supply' },
          { order: 6, text: 'Install the new power supply' },
          { order: 7, text: 'Reconnect all power cables' },
          { order: 8, text: 'Test the computer' },
        ],
        createdBy: 'Technician Tom',
        status: 'APPROVED',
        approvedBy: 'Sam OS',
        approvedAt: new Date(),
        sources: ['Manufacturer Manual', 'Technical Documentation'],
        relatedComponents: ['PSU'],
        version: 1,
        changelog: [
          {
            at: new Date(),
            by: 'Technician Tom',
            note: 'Initial creation',
          },
        ],
      },
    ]);

    // Seed Work Logs
    const workLogs = await WorkLog.create([
      {
        openedBy: 'Employee Eve',
        assignedTo: 'Technician Tom',
        itemId: items[0]._id,
        issueSummary: 'Computer not powering on - suspected power supply failure',
        stepsTaken: [
          {
            at: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000),
            by: 'Technician Tom',
            note: 'Diagnosed power supply failure',
          },
          {
            at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000),
            by: 'Technician Tom',
            note: 'Ordered replacement power supply',
          },
        ],
        status: 'IN_PROGRESS',
        usedComponents: [],
      },
    ]);

    console.log('Database seeded successfully!');
    console.log(`Created ${users.length} users`);
    console.log(`Created ${items.length} items`);
    console.log(`Created ${components.length} components`);
    console.log(`Created ${knowledgeBases.length} knowledge base entries`);
    console.log(`Created ${workLogs.length} work logs`);

  } catch (error) {
    console.error('Error seeding database:', error);
  }
};

export default seedData;


