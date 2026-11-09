require('dotenv').config();
const mongoose = require('mongoose');
const Flight = require('../models/Flight');
const connectDB = require('../db');

const flights = [
  {
    number: 'MA100',
    airline: 'Maervia Airways',
    from: 'Tunis (TUN)',
    to: 'Paris (CDG)',
    departureTime: new Date('2025-12-10T09:30:00.000Z'),
    arrivalTime: new Date('2025-12-10T12:15:00.000Z'),
    durationMinutes: 165,
    cabin: 'Economy',
    price: 470.0,
    seats: 120,
    status: 'scheduled',
    aircraft: 'Airbus A320',
  },
  {
    number: 'TU216',
    airline: 'Maervia Airways',
    from: 'Tunis (TUN)',
    to: 'Paris (CDG)',
    departureTime: new Date('2025-02-05T08:15:00.000Z'),
    arrivalTime: new Date('2025-02-05T11:25:00.000Z'),
    durationMinutes: 190,
    cabin: 'Economy',
    price: 189,
    seats: 42,
    status: 'scheduled',
    aircraft: 'A320',
  },
  {
    number: 'MA200',
    airline: 'Maervia Airways',
    from: 'Paris (CDG)',
    to: 'Tunis (TUN)',
    departureTime: new Date('2025-12-15T14:00:00.000Z'),
    arrivalTime: new Date('2025-12-15T16:45:00.000Z'),
    durationMinutes: 165,
    cabin: 'Economy',
    price: 490.0,
    seats: 100,
    status: 'scheduled',
    aircraft: 'Airbus A320',
  },
];

async function seedFlights() {
  try {
    await connectDB();
    console.log('Connected to MongoDB ✔');

    // Supprimer les anciens vols (optionnel - commente cette ligne si tu veux garder les existants)
    // await Flight.deleteMany({});
    // console.log('Cleared existing flights');

    // Insérer les nouveaux vols
    const insertedFlights = await Flight.insertMany(flights);
    console.log(`✅ Successfully inserted ${insertedFlights.length} flights:`);
    insertedFlights.forEach((flight) => {
      console.log(`  - ${flight.number}: ${flight.from} → ${flight.to} (${flight.departureTime.toISOString().split('T')[0]})`);
    });

    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding flights:', error);
    process.exit(1);
  }
}

seedFlights();

