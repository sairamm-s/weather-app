import React from 'react';
import './App.css';
import Form from './app_component/form';
import Weather from './app_component/weather';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'weather-icons/css/weather-icons.css';
import axios from 'axios';

const Api_Key = 'd84d3f207abc60f7e0b01fa6f4cbb652';
class App extends React.Component {
  constructor() {
    super();
    this.state = {
      city: '',
      country: '',
      icon: '',
      main: '',
      celsius: '',
      temp_max: '',
      temp_min: '',
      description: '',
      error: false,
    };

    this.weatherIcon = {
      Thunderstorm: 'wi-thunderstorm',
      Drizzle: 'wi-sleet',
      Rain: 'wi-storm-showers',
      Snow: 'wi-snow',
      Atmosphere: 'wi-fog',
      Clear: 'wi-day-sunny',
      Clouds: 'wi-day-fog',
    };
  }

  get_WeatherIcon(icons, id) {
    switch (true) {
      case id >= 200 && id < 232:
        this.setState({ icon: icons.Thunderstorm });
        break;
      case id >= 300 && id <= 321:
        this.setState({ icon: icons.Drizzle });
        break;
      case id >= 500 && id <= 521:
        this.setState({ icon: icons.Rain });
        break;
      case id >= 600 && id <= 622:
        this.setState({ icon: icons.Snow });
        break;
      case id >= 701 && id <= 781:
        this.setState({ icon: icons.Atmosphere });
        break;
      case id === 800:
        this.setState({ icon: icons.Clear });
        break;
      case id >= 801 && id <= 804:
        this.setState({ icon: icons.Clouds });
        break;
      default:
        this.setState({ icon: icons.Clouds });
    }
  }

  calCelsius(temp) {
    let cell = Math.floor(temp - 273.15);
    return cell;
  }

  getWeather = async (e) => {
    e.preventDefault();

    const country = e.target.elements.country.value;
    const city = e.target.elements.city.value;

    if (country && city) {
      await axios
        .get(
          `http://api.openweathermap.org/data/2.5/weather?q=${city},${country}&appid=${Api_Key}`
        )
        .then((response) => {
          this.setState({
            city: `${response.data.name}, ${response.data.sys.country}`,
            country: response.data.sys.country,
            main: response.data.weather[0].main,
            celsius: this.calCelsius(response.data.main.temp),
            temp_max: this.calCelsius(response.data.main.temp_max),
            temp_min: this.calCelsius(response.data.main.temp_min),
            description: response.data.weather[0].description,
            error: false,
          });

          // setting the weather icons
          this.get_WeatherIcon(this.weatherIcon, response.data.weather[0].id);

          console.log(response.data);
        });
    } else {
      this.setState({
        error: true,
      });
    }
  };

  render() {
    return (
      <div className='container text-center'>
        <Form loadweather={this.getWeather} error={this.state.error} />
        <Weather
          cityname={this.state.city}
          weatherIcon={this.state.icon}
          temp_celsius={this.state.celsius}
          temp_max={this.state.temp_max}
          temp_min={this.state.temp_min}
          description={this.state.description}
        />
      </div>
    );
  }
}

export default App;
