function fetchCoordinates(cityName) {
    const apiKey = '3637c6c730fd6296ed3127873d5823a8';
    const apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${cityName}&appid=${apiKey}&units=metric`;

    fetch(apiUrl)
    .then(response => {
        if (!response.ok) {
            throw new Error('Error city coordinates');
        }
        return response.json();
    })
    .then(data => {
        const { coord } = data;
        fetchWeatherByCoordinates(coord.lat, coord.lon);
    })
    .catch(error => {
        console.error('Issue with fetch', error);
    });
}

  function fetchWeatherByCoordinates(latitude, longitude) {
    const apiKey = '3637c6c730fd6296ed3127873d5823a8';
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    
    fetch(apiUrl) 
    .then(response => {
        if (!response.ok) {
            throw new Error('No response from network');
        }
        return response.json();
    })
    .then(data => {
        // Check if data is valid
        if (data && data.list && data.list.length > 0) {
            // Display weather data
            displayWeather(data);
        } else {
            console.log('No forecast data available');
        }
    })
    .catch(error => {
        console.error('Issue with fetch of weather by coordinates', error);
    });
}

function displayWeather(data) {
    // Extract current weather information
    const currentWeather = {
        cityName: data.city.name,
        date: new Date(data.list[0].dt * 1000),
        iconCode: data.list[0].weather[0].icon,
        iconUrl: `http://openweathermap.org/img/wn/${data.list[0].weather[0].icon}.png`,
        temperature: data.list[0].main.temp,
        humidity: data.list[0].main.humidity,
        windSpeed: data.list[0].wind.speed
    };

    //html elements display the weather info
    //current weather UI
    const weatherInfoDiv = document.getElementById('weatherInfo');
    weatherInfoDiv.innerHTML = `
    <h1>${currentWeather.cityName}</h1>
    <h2>Current Weather<h2>
    <h2>Date:${currentWeather.date.toLocaleDateString()}</h2>
    <img src="${currentWeather.iconUrl}" alt="Weather card">
    <p>Temperature: ${currentWeather.temperature}ºC</p>
    <p>Humidity: ${currentWeather.humidity}%</p>
    <p>Wind Speed: ${currentWeather.windSpeed} m/s</p>
    `;

//5days
const forecast = data.list.slice(1,6).map(item => ({
    date: new Date(item.dt * 1000),
    iconCode: item.weather[0].icon,
    temperature: item.weather[0].icon,
    humidity: item.main.humidity,
    windSpeed: item.wind.speed

}));

//next 5 days to UI
    const forecastDiv = document.getElementById('forecast');
    forecastDiv.innerHTML = `
    <h1> The next five days...</h1>
    <div class="row">
        ${forecast.map(day => `
        <div class="col">
            <p>Date: ${day.date.toLocaleDateString()}</p>
            <img src= "http://openweathermap.org/img/wn/${day.iconCode}.png" </img>
            <p>Temperature: ${day.temperature}ºC</p>
            <p>Humidity: ${day.humidity}%</p>
            <p> Wind: ${day.windSpeed} m/s </p>
        </div>
        `).join('')}
        </div>
        `;
}
//event listeners to search history
let searchHistory = [];
function addToSearchHistory(cityName) {
    searchHistory.push(cityName);
    const historyList = document.getElementById('historyList');
    historyList.innerHTML = '';
    searchHistory.forEach(city => {
        const listItem=document.createElement('li');
        listItem.textContent = city;
        historyList.appendChild(listItem);
    });
}
function attachHistoryListeners() {
    const historyList = document.getElementById('historyList');
    historyList.addEventListener('click', function(event){
        if (event.target.tagName === 'LI') {
            const cityName = event.target.textContent;
            fetchWeather(cityName);
        }
    });
}

// Attach event listeners to search history items when the page loads
document.addEventListener('DOMContentLoaded', attachHistoryListeners);
// Event listener for the search form
const searchForm = document.getElementById('search-form');
searchForm.addEventListener('submit', function(event) {
    event.preventDefault();
    const cityName = document.getElementById('cityInput').value;
    fetchCoordinates(cityName);
});