import { Controller } from "@hotwired/stimulus";

const MAP_API_KEY = process.env.MAP_API_KEY;
const WEATHER_API_KEY = process.env.WEATHER_API_KEY;
let lon = "";
let lat = "";

export default class extends Controller {
  static targets = [
    "temperature",
    "description",
    "city",
    "date",
    "input",
    "image",
  ];

  weatherAPI(_lat, _lon) {
    fetch(
      `https://api.openweathermap.org/data/2.5/weather?lat=${_lat}&lon=${_lon}&units=metric&appid=${WEATHER_API_KEY}`
    )
      .then((res) => res.json())
      .then((d) => {
        this.cityTarget.innerText = `${d.name}`;
        this.temperatureTarget.innerText = `${d.main.temp}`;
        this.descriptionTarget.innerText = `${d.weather[0].description}`;
        this.dateTarget.innerText = `${new Date(d.dt)}`;
        this.imageTarget.src = `https://openweathermap.org/img/w/${d.weather[0].icon}.png`;
      });
  }

  fetchWeather(_query) {
    fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${_query}.json?access_token=${MAP_API_KEY}`
    )
      .then((response) => response.json())
      .then((data) => {
        const place = data.features[0];
        const latitude = place.geometry.coordinates[1];
        const longitude = place.geometry.coordinates[0];
        this.weatherAPI(latitude, longitude);
      });
  }

  current(e) {
    e.preventDefault();
    navigator.geolocation.getCurrentPosition((data) => {
      lon = data.coords.longitude;
      lat = data.coords.latitude;
      this.inputTarget.value = "current Location";
    });
  }

  search(event) {
    event.preventDefault();
    if (lat === "" && lon === "") {
      this.fetchWeather(this.inputTarget.value);
      this.inputTarget.value = "";
    } else {
      this.weatherAPI(lat, lon);
      this.inputTarget.value = "";
    }
  }
}
