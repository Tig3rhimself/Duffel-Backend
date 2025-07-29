
const express = require('express');
const Amadeus = require('amadeus');

const app = express();
const port = process.env.PORT || 3000;

// Amadeus client
const amadeus = new Amadeus({
  clientId: process.env.AMADEUS_API_KEY || 'xgOCgngImrcsPGADO0D4IsMkTgEEJJt1',
  clientSecret: process.env.AMADEUS_API_SECRET || '7YJQX5MaW3eGxlHRq'
});

// Root route
app.get('/', (req, res) => {
  res.send('Amadeus Flight API backend is running.');
});

// Search flights route
app.get('/api/search-flights', async (req, res) => {
  try {
    const { origin, destination, departureDate, adults } = req.query;

    if (!origin || !destination || !departureDate || !adults) {
      return res.status(400).json({ error: 'Missing required parameters.' });
    }

    const response = await amadeus.shopping.flightOffersSearch.get({
      originLocationCode: origin,
      destinationLocationCode: destination,
      departureDate,
      adults
    });

    if (!response.data || response.data.length === 0) {
      return res.status(404).json({ error: 'No flights found.' });
    }

    const cheapest = response.data.reduce((prev, curr) =>
      parseFloat(curr.price.total) < parseFloat(prev.price.total) ? curr : prev
    );

    res.json({
      price: cheapest.price,
      airline: cheapest.validatingAirlineCodes[0],
      duration: cheapest.itineraries[0].duration
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch flight data.' });
  }
});

app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
