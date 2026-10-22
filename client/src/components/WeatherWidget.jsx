import { useState } from 'react';
import { getWeather } from '../api.js';

const STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

function WeatherWidget() {
  const [city, setCity] = useState('');
  const [status, setStatus] = useState(STATUS.IDLE);
  const [weather, setWeather] = useState(null);
  const [errorMessage, setErrorMessage] = useState('');

  async function handleSubmit(event) {
    event.preventDefault();
    const trimmedCity = city.trim();
    if (!trimmedCity) {
      return;
    }

    setStatus(STATUS.LOADING);
    setErrorMessage('');

    try {
      const result = await getWeather(trimmedCity);
      setWeather(result);
      setStatus(STATUS.SUCCESS);
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Something went wrong.';
      const isNotFound = /not found|404/i.test(message);
      setErrorMessage(isNotFound ? `City "${trimmedCity}" not found.` : message);
      setStatus(STATUS.ERROR);
    }
  }

  return (
    <section className="weather-widget" aria-label="Weather lookup">
      <h2>Weather</h2>
      <form onSubmit={handleSubmit} className="weather-widget__form">
        <label className="visually-hidden" htmlFor="weather-city">
          City name
        </label>
        <input
          id="weather-city"
          type="text"
          value={city}
          onChange={(event) => setCity(event.target.value)}
          placeholder="Enter a city"
          aria-label="City name"
          className="weather-widget__input"
        />
        <button type="submit" className="button button--primary">
          Search
        </button>
      </form>

      {status === STATUS.LOADING && (
        <p className="weather-widget__status" role="status">
          Loading weather…
        </p>
      )}

      {status === STATUS.ERROR && (
        <p className="weather-widget__status weather-widget__status--error" role="alert">
          {errorMessage}
        </p>
      )}

      {status === STATUS.SUCCESS && weather && (
        <div className="weather-widget__result">
          <img
            src={`https://openweathermap.org/img/wn/${weather.icon}@2x.png`}
            alt={`Weather icon: ${weather.description}`}
            className="weather-widget__icon"
          />
          <div className="weather-widget__details">
            <p className="weather-widget__location">
              {weather.city}, {weather.country}
            </p>
            <p className="weather-widget__temp">{Math.round(weather.temp)}°C</p>
            <p className="weather-widget__description">{weather.description}</p>
            <p className="weather-widget__meta">
              Feels like {Math.round(weather.feelsLike)}°C · Humidity {weather.humidity}%
            </p>
          </div>
        </div>
      )}
    </section>
  );
}

export default WeatherWidget;
