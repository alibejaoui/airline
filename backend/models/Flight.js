const mongoose = require('mongoose');

const CABIN_CLASSES = ['Economy', 'Premium Economy', 'Business', 'First'];
const FLIGHT_STATUSES = ['scheduled', 'delayed', 'cancelled', 'completed'];

const flightSchema = new mongoose.Schema(
  {
    number: {
      type: String,
      required: true,
      uppercase: true,
      trim: true,
    },
    airline: {
      type: String,
      required: true,
      trim: true,
    },
    from: {
      type: String,
      required: true,
      trim: true,
    },
    to: {
      type: String,
      required: true,
      trim: true,
    },
    departureTime: {
      type: Date,
      required: true,
    },
    arrivalTime: {
      type: Date,
      required: true,
    },
    durationMinutes: {
      type: Number,
      required: true,
      min: 30,
    },
    cabin: {
      type: String,
      enum: CABIN_CLASSES,
      default: 'Economy',
    },
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    seats: {
      type: Number,
      required: true,
      min: 0,
    },
    status: {
      type: String,
      enum: FLIGHT_STATUSES,
      default: 'scheduled',
    },
    aircraft: {
      type: String,
      trim: true,
    },
  },
  { timestamps: true }
);

flightSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  transform: (_, ret) => {
    ret.id = ret._id;
    delete ret._id;
  },
});

module.exports = mongoose.model('Flight', flightSchema);

