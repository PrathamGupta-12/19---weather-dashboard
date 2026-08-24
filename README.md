# Weather Dashboard

A responsive weather dashboard built using **HTML, CSS, and JavaScript** that allows users to search for a city and view its current weather conditions along with a multi-day forecast.

The project uses the **Open-Meteo Geocoding API** to find a city's coordinates and the **Open-Meteo Weather API** to retrieve weather information.

---

## Features

- Search for any city
- Display current temperature
- Display current weather condition
- Display feels-like temperature
- Display relative humidity
- Display wind speed
- Display surface pressure
- Display upcoming weather forecast
- Convert WMO weather codes into readable weather conditions
- Automatically identify the searched city's country
- Handle invalid or unknown cities
- Reset weather information while loading a new search
- Responsive user interface

---

## Technologies Used

- HTML5
- CSS3
- JavaScript
- Open-Meteo Geocoding API
- Open-Meteo Weather API

---

## JavaScript Concepts Practiced

This project helped me practice:

- `fetch()`
- `async/await`
- Promises
- API requests
- JSON data handling
- DOM manipulation
- Event listeners
- Template literals
- Functions
- Arrays
- Objects
- Loops
- Conditional statements
- Error handling with `try...catch`
- Working with external APIs
- Dynamic UI updates
- Data transformation
- Date formatting with `Date`
- `toLocaleDateString()`
- Mapping API weather codes to readable conditions

---

## APIs Used

### 1. Open-Meteo Geocoding API

The Geocoding API is used to convert the searched city name into geographical coordinates.

```text
https://geocoding-api.open-meteo.com/v1/search
```

The application retrieves:

- City name
- Country
- Latitude
- Longitude

These coordinates are then used to request weather information.

---

### 2. Open-Meteo Weather API

The Weather API is used to retrieve:

- Current temperature
- Apparent temperature
- Weather condition code
- Relative humidity
- Wind speed
- Surface pressure
- Daily maximum temperature
- Daily weather codes

```text
https://api.open-meteo.com/v1/forecast
```

---

## How It Works

### 1. Search for a City

The user enters a city name into the search box.

The input is cleaned using:

```js
let citySearch = searchedCity.value.trim().toLowerCase();
```

---

### 2. Find the City's Coordinates

The application sends the city name to the Open-Meteo Geocoding API.

```js
let response = await fetch(
    `${geoCodingApi}${citySearch}&count=1&language=en&format=json`
);
```

The first matching location is selected and its latitude and longitude are extracted.

---

### 3. Fetch Weather Data

The latitude and longitude are then used to construct the weather API request.

```js
let weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max`;
```

---

### 4. Display Current Weather

The application extracts the current weather information and updates the DOM.

It displays:

- Temperature
- Weather condition
- Feels-like temperature
- Humidity
- Wind speed
- Surface pressure

---

### 5. Convert Weather Codes

Open-Meteo provides weather conditions as WMO weather codes.

The project converts these numerical codes into readable conditions.

For example:

```js
0 → ☀️ Clear sky
2 → ⛅ Partly cloudy
3 → ☁️ Overcast
45 → 🌫️ Fog
61 → 🌧️ Rain
71 → ❄️ Snow
95 → ⛈️ Thunderstorm
```

This is handled using the `generateWeatherCondition()` function.

---

### 6. Display Forecast

The daily weather data is used to update the forecast cards.

The project converts dates into weekday names using:

```js
dateObject.toLocaleDateString('en-US', {
    weekday: 'short'
});
```

The forecast then displays the day, weather icon, and maximum temperature.

---

## ⚠️ Error Handling

The application handles several possible problems:

### Empty Search

If the search box is empty:

```text
Please enter a city.
```

is displayed.

### City Not Found

If the API does not return a matching city:

```text
😕 City not found. Try another city.
```

is displayed.

### API / Network Error

If an API request fails:

```text
⚠️ Unable to load weather.
```

is displayed.

The application also resets the weather information when a new search begins.

---

## Purpose

This project was built to practice working with **real-world APIs** and understand how JavaScript can fetch external data and dynamically update a webpage.

It combines:

**API → JavaScript → Data Processing → DOM Manipulation → User Interface**

---

## 👨‍💻 Author

**Krishna Gupta**

Built as part of my JavaScript learning journey while practicing API integration, asynchronous JavaScript, and DOM manipulation.
