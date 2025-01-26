import React, { useState, useEffect } from 'react';
import { Search, Cloud, Sun, CloudRain, Wind, Loader2 } from 'lucide-react';

// OpenWeatherMap API key - Definining the API endpoint and API key
const API_KEY = '3dd8cf3813bbf85305e0749a01ea2490';
const BASE_URL = 'https://api.openweathermap.org/data/2.5';

interface WeatherData {
  name: string;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  wind: {
    speed: number;
  };
}

function App() {
  const [city, setCity] = useState('London');
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWeather = async (searchCity: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(
        `${BASE_URL}/weather?q=${searchCity}&appid=${API_KEY}&units=metric`
      );
      
      if (!response.ok) {
        throw new Error('City not found');
      }
      
      const data = await response.json();
      setWeather(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch weather data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchWeather(city);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    fetchWeather(city);
  };

  const getWeatherIcon = (weatherMain: string) => {
    switch (weatherMain.toLowerCase()) {
      case 'clouds':
        return <Cloud className="w-20 h-20 text-gray-600" />;
      case 'rain':
        return <CloudRain className="w-20 h-20 text-blue-600" />;
      case 'clear':
        return <Sun className="w-20 h-20 text-yellow-500" />;
      default:
        return <Sun className="w-20 h-20 text-yellow-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500 to-purple-100 flex items-center justify-center p-4">
      <div className="bg-white/90 backdrop-blur-sm w-full max-w-md rounded-2xl shadow-xl p-6">
        <form onSubmit={handleSubmit} className="mb-6">
          <div className="relative">
            <input
              type="text"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Enter city name..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />
            <button
              type="submit"
              className="absolute right-2 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>
        </form>

        {loading && (
          <div className="flex justify-center items-center">
            <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          </div>
        )}

        {error && (
          <div className="text-red-500 text-center p-4 bg-red-100 rounded-lg">
            {error}
          </div>
        )}

        {weather && !loading && !error && (
          <div
          className={`text-center p-4 rounded-lg ${
            weather.name === "New York"
              ? "bg-blue-100"
              : weather.name === "London"
              ? "bg-gray-100"
              : weather.name === "Tokyo"
              ? "bg-red-100"
              : "bg-green-100" // Default background color
          }`}>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">{weather.name}</h2>
            <div className="flex justify-center mb-4">
              {getWeatherIcon(weather.weather[0].main)}
            </div>
            <div className="mb-4">
              <p className="text-5xl font-bold text-gray-800">
                {Math.round(weather.main.temp)}°C
              </p>
              <p className="text-gray-600 mt-1">{weather.weather[0].description}</p>
            </div>
            <div className="grid grid-cols-2 gap-4 bg-gray-100 rounded-lg p-4">
              <div>
                <p className="text-gray-600">Feels Like</p>
                <p className="text-xl font-semibold">
                  {Math.round(weather.main.feels_like)}°C
                </p>
              </div>
              <div>
                <p className="text-gray-600">Humidity</p>
                <p className="text-xl font-semibold">{weather.main.humidity}%</p>
              </div>
              <div className="col-span-2">
                <p className="text-gray-600">Wind Speed</p>
                <div className="flex items-center justify-center gap-2">
                  <Wind className="w-5 h-5 text-gray-600" />
                  <p className="text-xl font-semibold">{weather.wind.speed} m/s</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;