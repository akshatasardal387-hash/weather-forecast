# Weather Forecast

A responsive weather forecast web application that displays current weather information and a 5-day forecast for searched cities.

## Features

- Search weather by city name
- Get weather using current location
- Display current temperature
- Display humidity, wind speed and feels-like temperature
- Weather condition icons
- 5-day weather forecast
- Celsius / Fahrenheit toggle for current temperature
- Recently searched cities
- Extreme temperature alert above 40°C
- Dynamic rainy weather background
- Responsive design for mobile, tablet and desktop
- Error handling for invalid searches

## Technologies Used

- HTML
- CSS
- JavaScript
- Tailwind CSS
- WeatherAPI

## How to Run

1. Clone or download the project.
2. Create a copy of `config.example.js` and rename it to `config.js`.
3. Open `config.js` and replace `YOUR_WEATHERAPI_KEY` with your WeatherAPI key.
4. Open `index.html` in a browser.

## Project Structure

```text
weather-forecast/
│
├── index.html
├── style.css
├── script.js
├── config.example.js
├── config.js
├── .gitignore
└── README.md