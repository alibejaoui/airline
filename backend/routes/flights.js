const express = require('express');
const Flight = require('../models/Flight');
const auth = require('../middleware/auth');

const router = express.Router();

const buildSearchQuery = ({ from, to, cabin, departureDate, status }) => {
  const query = {};

  if (from) {
    query.from = { $regex: new RegExp(from, 'i') };
  }

  if (to) {
    query.to = { $regex: new RegExp(to, 'i') };
  }

  if (cabin) {
    query.cabin = cabin;
  }

  if (status) {
    query.status = status;
  }

  if (departureDate) {
    const start = new Date(departureDate);
    const end = new Date(departureDate);
    start.setHours(0, 0, 0, 0);
    end.setHours(23, 59, 59, 999);
    query.departureTime = { $gte: start, $lte: end };
  }

  return query;
};

router.get('/', async (req, res) => {
  try {
    const query = buildSearchQuery(req.query);
    const flights = await Flight.find(query).sort({ departureTime: 1 });
    return res.json(flights);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to fetch flights' });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const flight = await Flight.findById(req.params.id);
    if (!flight) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    return res.json(flight);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to fetch flight' });
  }
});

router.post('/', auth, async (req, res) => {
  try {
    const flight = await Flight.create(req.body);
    return res.status(201).json(flight);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Unable to create flight', error });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const updated = await Flight.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updated) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    return res.json(updated);
  } catch (error) {
    console.error(error);
    return res.status(400).json({ message: 'Unable to update flight', error });
  }
});

router.delete('/:id', auth, async (req, res) => {
  try {
    const deleted = await Flight.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Flight not found' });
    }

    return res.json({ message: 'Flight deleted' });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to delete flight' });
  }
});

module.exports = router;

