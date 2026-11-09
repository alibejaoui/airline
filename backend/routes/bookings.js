const express = require('express');
const Booking = require('../models/Booking');
const Flight = require('../models/Flight');
const auth = require('../middleware/auth');

const router = express.Router();

router.get('/', auth, async (req, res) => {
  try {
    const query = req.user.role === 'admin' ? {} : { user: req.user.id };
    const bookings = await Booking.find(query)
      .populate('flight')
      .populate('user', 'name email');
    return res.json(bookings);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to fetch bookings' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const { flightId, seats } = req.body;
    if (!flightId || !seats) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const flight = await Flight.findById(flightId);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    if (flight.seats < seats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    // Ne pas retirer les sièges immédiatement - on le fera après le paiement
    // flight.seats -= seats;
    // await flight.save();

    const booking = await Booking.create({
      user: req.user.id,
      flight: flightId,
      seats,
      status: 'pending', // En attente de paiement
      paymentStatus: 'pending',
      totalPrice: flight.price * seats,
    });

    return res.status(201).json(
      await booking.populate([
        { path: 'flight' },
        { path: 'user', select: 'name email' },
      ])
    );
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Unable to create booking', error });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { seats, status } = req.body;
    const query =
      req.user.role === 'admin'
        ? { _id: req.params.id }
        : { _id: req.params.id, user: req.user.id };

    const booking = await Booking.findOne(query).populate('flight');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (typeof seats === 'number' && seats !== booking.seats) {
      const seatDiff = seats - booking.seats;
      const flight = booking.flight;

      if (seatDiff > 0 && flight.seats < seatDiff) {
        return res.status(400).json({ message: 'Not enough seats available' });
      }

      flight.seats -= seatDiff;
      await flight.save();

      booking.seats = seats;
      booking.totalPrice = flight.price * seats;
    }

    if (status) {
      booking.status = status;
    }

    await booking.save();

    return res.json(
      await booking.populate([
        { path: 'flight' },
        { path: 'user', select: 'name email' },
      ])
    );
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Unable to update booking', error });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const query =
      req.user.role === 'admin'
        ? { _id: req.params.id }
        : { _id: req.params.id, user: req.user.id };

    const booking = await Booking.findOne(query).populate('flight');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    booking.flight.seats += booking.seats;
    await booking.flight.save();
    await booking.deleteOne();

    return res.json({ message: 'Booking cancelled' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to delete booking' });
  }
});

// Route pour finaliser le paiement et confirmer la réservation
router.post('/:id/payment', auth, async (req, res) => {
  try {
    const { paymentMethod } = req.body;
    const query =
      req.user.role === 'admin'
        ? { _id: req.params.id }
        : { _id: req.params.id, user: req.user.id };

    const booking = await Booking.findOne(query).populate('flight');
    if (!booking) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    if (booking.paymentStatus === 'completed') {
      return res.status(400).json({ message: 'Booking already paid' });
    }

    // Retirer les sièges du vol maintenant que le paiement est confirmé
    const flight = booking.flight;
    if (flight.seats < booking.seats) {
      return res.status(400).json({ message: 'Not enough seats available' });
    }

    flight.seats -= booking.seats;
    await flight.save();

    // Mettre à jour la réservation
    booking.status = 'confirmed';
    booking.paymentStatus = 'completed';
    booking.paymentMethod = paymentMethod || 'credit_card';
    booking.paymentDate = new Date();
    await booking.save();

    return res.json(
      await booking.populate([
        { path: 'flight' },
        { path: 'user', select: 'name email' },
      ])
    );
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to process payment', error });
  }
});

module.exports = router;

