require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const User = require('./models/user.model');
const Category = require('./models/category.model');
const Event = require('./models/event.model');
const Registration = require('./models/registration.model');
const Message = require('./models/message.model');

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('MongoDB connected for seeding');

    // Delete in an order that respects references: children before parents
    await Message.deleteMany();
    await Registration.deleteMany();
    await Event.deleteMany();
    await Category.deleteMany();
    await User.deleteMany();
    console.log('Old data cleared');

    // Admin user
    const hashedPassword = await bcrypt.hash('Admin@123', 12);
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@eventpulse.com',
      password: hashedPassword,
      role: 'admin',
    });

    const attendeePassword = await bcrypt.hash('Attendee@123', 12);
    const attendee = await User.create({
      name: 'Sara Ahmed',
      email: 'sara@eventpulse.com',
      password: attendeePassword,
      role: 'attendee',
    });

    // Categories
    const categories = await Category.insertMany([
      { name: 'Music', description: 'Concerts, festivals and live performances' },
      { name: 'Tech', description: 'Conferences, workshops and hackathons' },
      { name: 'Sports', description: 'Tournaments and sporting events' },
    ]);

    // Events
    const events = await Event.insertMany([
      {
        title: 'Cairo Jazz Night',
        description: 'An evening of live jazz music in the heart of Cairo.',
        category: categories[0]._id,
        date: new Date('2026-10-15T19:00:00.000Z'),
        city: 'Cairo',
        venue: 'Cairo Opera House',
        capacity: 100,
        organizer: admin._id,
      },
      {
        title: 'Frontend Workshop',
        description: 'Hands-on workshop covering modern frontend development.',
        category: categories[1]._id,
        date: new Date('2026-09-20T10:00:00.000Z'),
        city: 'Alexandria',
        venue: 'Tech Hub Alexandria',
        capacity: 50,
        organizer: admin._id,
      },
      {
        title: 'AI Tech Summit',
        description: 'A summit exploring the latest trends and design in AI.',
        category: categories[1]._id,
        date: new Date('2026-11-05T09:00:00.000Z'),
        city: 'Cairo',
        venue: 'Cairo International Convention Center',
        capacity: 200,
        organizer: admin._id,
      },
      {
        title: 'City Football Cup',
        description: 'An amateur football tournament open to all residents.',
        category: categories[2]._id,
        date: new Date('2026-09-30T16:00:00.000Z'),
        city: 'Giza',
        venue: 'Giza Sports Stadium',
        capacity: 30,
        organizer: admin._id,
      },
    ]);

    // Sample registration
    await Registration.create({ event: events[0]._id, attendee: attendee._id });

    // Sample announcement
    await Message.create({
      event: events[0]._id,
      sender: admin._id,
      text: 'Welcome to Cairo Jazz Night! Doors open at 6:30 PM.',
    });

    console.log('Database seeded successfully:');
    console.log(`  ${categories.length} categories, ${events.length} events, 2 users`);
    console.log('  Admin login -> email: admin@eventpulse.com, password: Admin@123');

    process.exit(0);
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
}

seed();
