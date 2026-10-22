const express = require('express');
const asyncHandler = require('../utils/asyncHandler');

const router = express.Router();

const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

// GET /api/weather?city=<city> - proxy OpenWeather's current-weather endpoint
router.get(
  '/',
  asyncHandler(async (req, res) => {
    const { city } = req.query;

    if (!city || !city.trim()) {
      return res.status(400).json({ error: 'city query parameter is required' });
    }

    const url = `${OPENWEATHER_BASE_URL}?q=${encodeURIComponent(city)}&units=metric&appid=${process.env.OPENWEATHER_API_KEY}`;
    const response = await fetch(url);

    if (response.status === 404) {
      return res.status(404).json({ error: 'City not found' });
    }

    if (!response.ok) {
      return res.status(502).json({ error: 'Weather provider error' });
    }

    const data = await response.json();

    return res.json({
      city: data.name,
      country: data.sys?.country,
      temp: data.main?.temp,
      feelsLike: data.main?.feels_like,
      humidity: data.main?.humidity,
      description: data.weather?.[0]?.description,
      icon: data.weather?.[0]?.icon,
    });
  })
);

module.exports = router;
