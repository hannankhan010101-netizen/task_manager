import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import WeatherWidget from '../components/WeatherWidget.jsx';
import * as api from '../api.js';

vi.mock('../api.js');

describe('WeatherWidget', () => {
  beforeEach(() => {
    vi.resetAllMocks();
  });

  it('shows weather details on a successful search', async () => {
    const user = userEvent.setup();
    api.getWeather.mockResolvedValue({
      city: 'London',
      country: 'GB',
      temp: 15.4,
      feelsLike: 14.1,
      humidity: 70,
      description: 'light rain',
      icon: '10d',
    });

    render(<WeatherWidget />);

    await user.type(screen.getByLabelText('City name'), 'London');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByText('London, GB')).toBeInTheDocument();
    expect(screen.getByText('15°C')).toBeInTheDocument();
    expect(screen.getByText('light rain')).toBeInTheDocument();
    expect(screen.getByAltText(/weather icon/i)).toHaveAttribute(
      'src',
      'https://openweathermap.org/img/wn/10d@2x.png',
    );
  });

  it('shows a city-not-found message on error', async () => {
    const user = userEvent.setup();
    api.getWeather.mockRejectedValue(new Error('City not found'));

    render(<WeatherWidget />);

    await user.type(screen.getByLabelText('City name'), 'Nowhereville');
    await user.click(screen.getByRole('button', { name: /search/i }));

    expect(await screen.findByRole('alert')).toHaveTextContent(/not found/i);
  });
});
