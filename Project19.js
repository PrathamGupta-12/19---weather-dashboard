let searchedCity = document.querySelector('.city-search');

let searchBtn = document.querySelector('.search-container');

let geoCodingApi = 'https://geocoding-api.open-meteo.com/v1/search?name=';

let cityNameArea = document.querySelector('.city-name');

searchBtn.addEventListener('submit' , async (e) => {

    e.preventDefault();

    let citySearch = searchedCity.value.trim().toLowerCase();

    if (citySearch === '') {
        cityNameArea.innerHTML = 'Please enter a city.';
        resetWeatherDetails();
        return;
    }

    try {

        resetWeatherDetails();

        currentTempArea.innerText = 'Loading...';

        let response = await fetch(`${geoCodingApi}${citySearch}&count=1&language=en&format=json`);

        if (!response.ok) {
            cityNameArea.innerHTML = '⚠️ Unable to find the city. Please try again.';
            resetWeatherDetails();
            return;
        }

        let data = await response.json();

        if (!data.results || data.results.length === 0) {
            cityNameArea.innerHTML = '😕 City not found. Try another city.';
            resetWeatherDetails();
            return;
        }

        let locationData = data.results[0];

        let latitude = locationData.latitude;
        let longitude = locationData.longitude;

        let weatherApi = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,apparent_temperature,weather_code,wind_speed_10m,relative_humidity_2m,surface_pressure&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max`;

        let weatherResponse = await fetch(weatherApi);

        if (!weatherResponse.ok) {
            throw new Error('Failed to fetch weather.');
        }

        let weatherData = await weatherResponse.json();

        displayCity(locationData);

        displayWeather(weatherData);

        console.log(weatherData);

    }

    catch (error) {

        console.log(error);
        resetWeatherDetails();
        cityNameArea.innerHTML = '⚠️ Unable to load weather.';


    }
})

function displayCity(cityObject) {

    cityNameArea.innerText = `${cityObject.name}, ${cityObject.country}`;
}


function generateWeatherCondition(weatherCode) {
    
    const weatherWMOCode = {
        0 : '☀️ Clear sky',
        1 : '🌤️ Mainly clear',
        2 : '⛅ Partly cloudy',
        3 : '☁️ Overcast',
        45 : '🌫️ Fog',
        51 : '🌧️ Drizzle',
        61 : '🌧️ Rain',
        71 : '❄️ Snow',
        80 : '🌦️ Rain showers',
        95 : '⛈️ Thunderstorm',
        56: '🌧️ Freezing drizzle',
        66: '🌧️ Freezing rain'
    }
    
    if (weatherCode === 45 || weatherCode === 48) {
        weatherCode = 45;
    }
    
    else if (51 <= weatherCode && weatherCode <= 55) {
        weatherCode = 51;
    }
    
    else if (61 <= weatherCode && weatherCode <= 65) {
        weatherCode = 61;
    }
    
    else if (71 <= weatherCode && weatherCode <= 75) {
        weatherCode = 71;
    }
    
    else if (80 <= weatherCode && weatherCode <= 82) {
        weatherCode = 80;
    }

    else if (95 <= weatherCode && weatherCode <= 99) {
        weatherCode = 95;
    }

    else if (56 <= weatherCode && weatherCode <= 57) {
        weatherCode = 56;
    }

    else if (66 <= weatherCode && weatherCode <= 67) {
        weatherCode = 66;
    }
    
    if (weatherCode in weatherWMOCode) {
        return weatherWMOCode[weatherCode];
    }
    
    return 'Not Available.';

}

let currentTempArea = document.querySelector('.current-temperature');
let weatherConditionArea = document.querySelector('.weather-condition');
let feelsLikeArea = document.querySelector('.feels-like');
let currentWeatherIcon = document.querySelector('.current-weather-icon');
let humidityValue = document.querySelector('#humidity-Stat');
let windValue = document.querySelector('#wind-Stat');
let pressureValue = document.querySelector('#pressure-Stat');

function displayWeather(weatherObject) {

    let current = weatherObject['current'];
    let currentUnits = weatherObject['current_units'];

    currentTempArea.innerText = `${current.temperature_2m}${currentUnits.temperature_2m}`;

    let weatherCondition = generateWeatherCondition(current.weather_code)

    weatherConditionArea.innerText = weatherCondition.slice(2,weatherCondition.length);

    currentWeatherIcon.innerText = weatherCondition.slice(0 , 3);

    additionalWeatherDetails(current , currentUnits);

    displayFutureWeather(weatherObject);

}

function additionalWeatherDetails(current , currentUnits) {

    feelsLikeArea.innerText = `Feels ${current.apparent_temperature}${currentUnits.apparent_temperature}`;

    humidityValue.innerText = `${current.relative_humidity_2m}${currentUnits.relative_humidity_2m}`;

    windValue.innerText = `${current.wind_speed_10m}${currentUnits.wind_speed_10m}`;

    pressureValue.innerText = `${current.surface_pressure}${currentUnits.surface_pressure}`;

}

let forecastDayNodes = document.querySelectorAll('.forecast-day-name');

let forecastIconNodes = document.querySelectorAll('.forecast-icon');

let forecastTemperatureNodes = document.querySelectorAll('.forecast-temperature');

function displayFutureWeather(weatherObject) {

    let daily = weatherObject.daily;

    for (let i = 0; i < daily.time.length; i++) {

        let date = daily.time[i];

        let day = getWeekDay(date);

        forecastDayNodes[i].innerText = day;

    }

    changeForecastIcon(daily);

    changeForecastTemp(daily);
}

function getWeekDay(dateString) {

    let dateObject = new Date(dateString);

    let day = dateObject.toLocaleDateString('en-US', {

        weekday: 'short'

    });

    return day;
}

function changeForecastIcon(dailyObject) {

    let weatherCodes = dailyObject.weather_code;

    for (let i = 0 ; i < weatherCodes.length ; i++) {

        let weatherCondition = generateWeatherCondition(weatherCodes[i]);

        forecastIconNodes[i].innerText = weatherCondition.slice(0 , 2);

    }
}

function changeForecastTemp(dailyObject) {

    let temperatures = dailyObject.temperature_2m_max;

    for (let i = 0 ; i < temperatures.length ; i++) {

        forecastTemperatureNodes[i].innerText = `${temperatures[i]}°`;

    }
}

let statValues = document.querySelectorAll('.stat-value');

function resetWeatherDetails() {

    for (let i = 0 ; i < forecastTemperatureNodes.length ; i++) {

        forecastTemperatureNodes[i].innerText = '---';
    }

    for (let idx = 0 ; idx < statValues.length ; idx++) {

        statValues[idx].innerText = '---';

    }

    for (let i = 0; i < forecastDayNodes.length; i++) {

        forecastDayNodes[i].innerText = '---';
        forecastIconNodes[i].innerText = '☀️';
    }

    resetDetails();
}

function resetDetails() {

    currentTempArea.innerText = '---';
    feelsLikeArea.innerText = '---';
    weatherConditionArea.innerText = '---';
    currentWeatherIcon.innerText = '☀️';

}

