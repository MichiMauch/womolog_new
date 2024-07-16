import React, { useEffect, useState } from 'react';
import { Box, Typography } from '@mui/material';
import ReactAnimatedWeather from 'react-animated-weather';

interface WeatherProps {
  latitude: number;
  longitude: number;
}

interface WeatherData {
  main: {
    temp: number;
  };
  weather: {
    icon: string;
  }[];
}

const iconMapping: { [key: string]: string } = {
  '01d': 'CLEAR_DAY',
  '01n': 'CLEAR_NIGHT',
  '02d': 'PARTLY_CLOUDY_DAY',
  '02n': 'PARTLY_CLOUDY_NIGHT',
  '03d': 'CLOUDY',
  '03n': 'CLOUDY',
  '04d': 'CLOUDY',
  '04n': 'CLOUDY',
  '09d': 'RAIN',
  '09n': 'RAIN',
  '10d': 'RAIN',
  '10n': 'RAIN',
  '11d': 'SLEET',
  '11n': 'SLEET',
  '13d': 'SNOW',
  '13n': 'SNOW',
  '50d': 'FOG',
  '50n': 'FOG',
};

const Weather: React.FC<WeatherProps> = ({ latitude, longitude }) => {
  const [weatherData, setWeatherData] = useState<WeatherData | null>(null);

  useEffect(() => {
    const fetchWeather = async () => {
      try {
        const response = await fetch(`/api/weather?latitude=${latitude}&longitude=${longitude}`);
        if (!response.ok) {
          throw new Error('Failed to fetch weather data');
        }
        const data = await response.json();
        setWeatherData(data);
      } catch (error) {
        console.error('Error fetching weather data:', error);
      }
    };

    fetchWeather();
  }, [latitude, longitude]);

  if (!weatherData) {
    return null;
  }

  const icon = iconMapping[weatherData.weather[0].icon] || 'CLEAR_DAY';

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <ReactAnimatedWeather
        icon={icon}
        color="white"
        size={50}
        animate={true}
      />
      <Typography variant="subtitle1" component="p" style={{ color: 'white' }}>
        {Math.round(weatherData.main.temp)}°C
      </Typography>
    </Box>
  );
};

export default Weather;
