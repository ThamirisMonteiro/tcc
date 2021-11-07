import { Component, OnInit } from '@angular/core';
import {WeatherService} from "./weather.service";
import {registerLocaleData} from "@angular/common";
import localePt from '@angular/common/locales/pt';

@Component({
  selector: 'app-weather-forecast',
  templateUrl: './weather-forecast.component.html',
  styleUrls: ['./weather-forecast.component.css']
})
export class WeatherForecastComponent implements OnInit {
  city = 'Curitiba'
  estate = 'Parana'
  details = [];
  token = ''

  constructor(private weatherservice: WeatherService) {
    let token = JSON.parse(<string>localStorage.getItem('userData'))._token
    registerLocaleData(localePt, 'pt');
    this.token = JSON.parse(<string>localStorage.getItem('userData'))._token
    this.weatherservice.getWeatherConfiguration(token).subscribe((res) => {
      this.city = res.city
      this.estate = res.estate
      this.weatherservice.getWeatherDetails(this.city, this.estate).subscribe((data) => {
        for (let i = 0; i < 3; i++) {
          // @ts-ignore
          this.details.push(data['list'][i]);
        }
        // @ts-ignore
        this.city = data['city'].name;
        // @ts-ignore
        this.country = data['city'].country;
      });
    })
  }

  ngOnInit() {
  }
}
