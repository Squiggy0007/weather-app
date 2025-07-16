# Weather App

A responsive and dynamic weather dashboard that provides real-time weather conditions, hourly forecasts, and a 3-day forecast for any city. Built using HTML, CSS, and JavaScript, and powered by the WeatherAPI and Unsplash API.

## Features

- **Current Weather**: Displays temperature, condition, humidity, wind speed, sunrise, and sunset.
- **3-Day Forecast**: Shows daily high and low temperatures and weather conditions.
- **Hourly Forecast**: Horizontal scrollable view of hourly temperature, wind, and condition.
- **Temperature Unit Toggle**: Switch between Fahrenheit and Celsius.
- **Dark Mode**: Toggle between light and dark themes.
- **Dynamic Backgrounds**: Background images change based on the city and weather conditions using the Unsplash API.
- **Responsive Design**: Optimized for both desktop and mobile screens.

## Technologies Used

- HTML5
- CSS3
- JavaScript (ES6)
- [WeatherAPI](https://www.weatherapi.com/)
- [Unsplash API](https://unsplash.com/developers)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/your-username/weather-app.git
   ```

2. **Add your API keys:**
   - Sign up at [WeatherAPI](https://www.weatherapi.com/) and [Unsplash](https://unsplash.com/developers) to get your API keys.
   - Replace the placeholders in `app.js`:
     ```js
     const apiKey = 'YOUR_WEATHER_API_KEY';
     const unsplashAccessKey = 'YOUR_UNSPLASH_ACCESS_KEY';
     ```

3. **Open the app:**
   - Open `index.html` in your browser to run the app locally.

## License

This project is open source and available under the [MIT License](LICENSE).
