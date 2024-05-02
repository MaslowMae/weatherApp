import {computePosition} from 'https://cdn.jsdelivr.net/npm/@floating-ui/dom@1.6.4/+esm';
 
const button = document.querySelector('#button');
const tooltip = document.querySelector('#tooltip');
 
computePosition(button, tooltip).then(({x, y}) => {
    Object.assign(tooltip.style, {
      left: `${x}px`,
      top: `${y}px`,
    });
  });

  function fetchWeatherData(cityName) {
    //latitude and longitude coordinates
    const latitude = /[0-9]+/.exec(cityName)[0];
    const longitude = /[0-9]+/.exec(cityName)[1];
    //fetching weather data from openweathermap.org
    const apiKey = '3637c6c730fd6296ed3127873d5823a8'
    const apiUrl = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&appid=${apiKey}`;
    fetch(apiUrl)
    .then(response => {
    if (!response.ok) {
    throw new Error('No response from network')
  }
  return response.json();
  })
  .then(data => {
    console.log(data);
    })
  .catch(error => {
    console.log(error);
  });
}
  fetchWeatherData(`$city`);
