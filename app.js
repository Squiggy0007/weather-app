const form = document.getElementById('search-form');
const cityInput = document.getElementById('city-input');
const weatherResult = document.getElementById('weather-result');
const errorMessage = document.getElementById('error-message');

const locationEl = document.getElementById('location');
const conditionEl = document.getElementById('condition');
const tempEl = document.getElementById('temp');
const humidityEl = document.getElementById('humidity');
const windEl = document.getElementById('wind');
const weatherIconEl = document.getElementById('weather-icon');
const sunriseEl = document.getElementById('sunrise');
const sunsetEl = document.getElementById('sunset');

const forecastContainer = document.getElementById('forecast');
const forecastCardsContainer = document.getElementById('forecast-cards');

const hourlyContainer = document.getElementById('hourly-forecast');
const hourlyCardsContainer = document.getElementById('hourly-cards');

const toggleBtn = document.getElementById('toggle-btn');
const darkModeBtn = document.getElementById('dark-mode-btn');

let currentUnit = 'F';  // Default unit is Fahrenheit
let lastWeatherData = null;
let lastBackgroundImageUrl = '';

form.addEventListener('submit', (e) => {
  e.preventDefault();
  const city = cityInput.value.trim();
  if (city) {
    fetchWeather(city);
  }
});

toggleBtn.addEventListener('click', () => {
  currentUnit = currentUnit === 'F' ? 'C' : 'F';
  toggleBtn.textContent = currentUnit === 'F' ? 'Show °C' : 'Show °F';

  if (lastWeatherData) {
    displayWeather(lastWeatherData);
    displayForecast(lastWeatherData);
    displayHourly(lastWeatherData);
  }
});

darkModeBtn.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  darkModeBtn.textContent = document.body.classList.contains('dark-mode') ? 'Light Mode' : 'Dark Mode';
});

function cleanConditionText(text) {
  const lower = text.toLowerCase();

  if (lower.includes("thundery")) return "Thunderstorms";
  if (lower.includes("patchy rain")) return "Light Rain";
  if (lower.includes("moderate or heavy rain shower")) return "Rain Showers";
  if (lower.includes("partly cloudy")) return "Partly Cloudy";
  if (lower.includes("overcast")) return "Cloudy";

  return text;
}

async function fetchWeather(city) {
  errorMessage.classList.add('hidden');
  weatherResult.classList.add('hidden');
  forecastContainer.classList.add('hidden');
  hourlyContainer.classList.add('hidden');

  try {
    // Fetch weather data from deployed backend server
    const response = await fetch(`https://weather-app-backend-hl8d.onrender.com/weather?city=${encodeURIComponent(city)}`);
    if (!response.ok) {
      throw new Error('City not found or API error');
    }
    const data = await response.json();

    if (!data || !data.current) {
      throw new Error('No weather data available');
    }

    lastWeatherData = data;

    displayWeather(data);
    displayForecast(data);
    displayHourly(data);
  } catch (error) {
    forecastContainer.classList.add('hidden');
    hourlyContainer.classList.add('hidden');
    console.error('Fetch error:', error);
    errorMessage.textContent = error.message;
    errorMessage.classList.remove('hidden');
  }
}

function displayWeather(data) {
  const { location, current, forecast } = data;

  locationEl.textContent = `${location.name}, ${location.country}`;
  conditionEl.textContent = cleanConditionText(current.condition.text);
  humidityEl.textContent = current.humidity;

  if (currentUnit === 'F') {
    tempEl.textContent = `${current.temp_f} °F`;
    const windMph = (current.wind_kph * 0.621371).toFixed(1);
    windEl.textContent = `${windMph} mph`;
  } else {
    tempEl.textContent = `${current.temp_c} °C`;
    windEl.textContent = `${current.wind_kph.toFixed(1)} kph`;
  }

  weatherIconEl.src = current.condition.icon;
  weatherIconEl.alt = current.condition.text;

  if (forecast && forecast.forecastday && forecast.forecastday.length > 0) {
    const astro = forecast.forecastday[0].astro;
    sunriseEl.textContent = astro.sunrise;
    sunsetEl.textContent = astro.sunset;
  } else {
    sunriseEl.textContent = '-';
    sunsetEl.textContent = '-';
  }

  weatherResult.classList.remove('hidden');

  const weatherCondition = current.condition.text;

  if (!lastBackgroundImageUrl) {
    setDynamicBackground(weatherCondition, location.name);
  } else {
    document.body.style.backgroundImage = `url(${lastBackgroundImageUrl})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
  }
}

function displayForecast(data) {
  const forecastDays = data.forecast.forecastday;
  forecastCardsContainer.innerHTML = '';

  forecastDays.forEach(day => {
    const date = new Date(day.date);
    const dayName = date.toLocaleDateString(undefined, { weekday: 'short' });

    const highTemp = currentUnit === 'F' ? `${day.day.maxtemp_f} °F` : `${day.day.maxtemp_c} °C`;
    const lowTemp = currentUnit === 'F' ? `${day.day.mintemp_f} °F` : `${day.day.mintemp_c} °C`;

    const card = document.createElement('div');
    card.classList.add('forecast-card');
    card.innerHTML = `
      <h4>${dayName}</h4>
      <img src="${day.day.condition.icon}" alt="${day.day.condition.text}" />
      <p>${cleanConditionText(day.day.condition.text)}</p>
      <p><strong>High:</strong> ${highTemp}</p>
      <p><strong>Low:</strong> ${lowTemp}</p>
    `;
    forecastCardsContainer.appendChild(card);
  });

  forecastContainer.classList.remove('hidden');
}

function displayHourly(data) {
  const hourlyData = data.forecast.forecastday[0].hour;
  hourlyCardsContainer.innerHTML = '';

  hourlyData.forEach(hour => {
    const date = new Date(hour.time);
    const hourString = date.toLocaleTimeString(undefined, { hour: 'numeric', hour12: true });

    const temp = currentUnit === 'F' ? `${hour.temp_f} °F` : `${hour.temp_c} °C`;
    const wind = currentUnit === 'F' ? `${(hour.wind_kph * 0.621371).toFixed(1)} mph` : `${hour.wind_kph.toFixed(1)} kph`;

    const card = document.createElement('div');
    card.classList.add('hourly-card');
    card.innerHTML = `
      <h4>${hourString}</h4>
      <img src="${hour.condition.icon}" alt="${hour.condition.text}" />
      <p>${cleanConditionText(hour.condition.text)}</p>
      <p><strong>Temp:</strong> ${temp}</p>
      <p><strong>Wind:</strong> ${wind}</p>
    `;
    hourlyCardsContainer.appendChild(card);
  });

  hourlyContainer.classList.remove('hidden');
}

async function setDynamicBackground(query, cityName) {
  try {
    // Fetch Unsplash image URL from deployed backend server
    const response = await fetch(`https://weather-app-backend-hl8d.onrender.com/unsplash?query=${encodeURIComponent(cityName + ' ' + query + ' weather')}`);
    if (!response.ok) throw new Error('Unsplash image fetch failed');
    const data = await response.json();

    const imageUrl = data.urls.full;

    lastBackgroundImageUrl = imageUrl;

    document.body.style.backgroundImage = `url(${imageUrl})`;
    document.body.style.backgroundSize = 'cover';
    document.body.style.backgroundPosition = 'center';
    document.body.style.backgroundRepeat = 'no-repeat';
  } catch (error) {
    console.error('Error setting background:', error);
    document.body.style.background = 'linear-gradient(to right, #74ebd5, #9face6)';
    lastBackgroundImageUrl = '';
  }
}

// Horizontal scroll for hourly forecast
hourlyCardsContainer.addEventListener('wheel', (event) => {
  event.preventDefault();
  hourlyCardsContainer.scrollLeft += event.deltaY;
});
