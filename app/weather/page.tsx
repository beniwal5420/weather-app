'use client'; // Enable client-side rendering

import React, { useState, useEffect } from 'react';
import './weather.css'; // Ensure the CSS file is properly imported

const Weather = () => {
    const [weatherData, setWeatherData] = useState(null);
    const [city, setCity] = useState('Toronto'); // Default city
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Function to fetch weather data
    const fetchWeather = async () => {
        setLoading(true);
        setError(null);
        try {
            const url = `http://localhost:3000/api/weather?city=${city}&units=metric`;
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error('Failed to fetch weather data');
            }
            const data = await response.json();
            // Adjust to fit the actual response structure
            setWeatherData({
                name: data.city_name,
                country: data.country,
                temp: data.temp,
                description: data.weather_description
            });
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    // Fetch data on component mount and when city changes
    useEffect(() => {
        fetchWeather();
    }, [city]);

    return (
        <div className="weather-container">
            <div className="search-bar">
                <input
                    type="text"
                    placeholder="Enter city"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    className="search-input"
                />
                <button onClick={fetchWeather} className="search-button">
                    Search
                </button>
            </div>

            {loading && <div className="loading">Loading...</div>}
            {error && <div className="error">{error}</div>}

            {weatherData && !loading && !error && (
                <div className="weather-info">
                    <h1>{weatherData.name}, {weatherData.country}</h1>
                    <p>Temperature: {weatherData.temp}°C</p>
                    <p>Description: {weatherData.description}</p>
                </div>
            )}
        </div>
    );
};

export default Weather;
