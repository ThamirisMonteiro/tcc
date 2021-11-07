import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {PrevisaoDoTempo} from "../../models/previsao-do-tempo.model";
import {WeatherService} from "../../home/weather-forecast/weather.service";
import {Noticia} from "../../models/noticia.model";
import {Router} from "@angular/router";

@Component({
  selector: 'app-admin-previsao-tempo',
  templateUrl: './admin-previsao-tempo.component.html',
  styleUrls: ['./admin-previsao-tempo.component.css']
})
export class AdminPrevisaoTempoComponent implements OnInit {
  isLoading = false
  error: string = ""
  token = ""
  previsao = new PrevisaoDoTempo('', '')

  constructor(private router: Router,private weatherService: WeatherService) {
    this.token = JSON.parse(<string>localStorage.getItem('userData'))._token
    this.weatherService.getWeatherConfiguration(this.token).subscribe((data: PrevisaoDoTempo ) => {
      this.previsao = data})
  }

  ngOnInit(): void {
  }

  onSubmit(updatePrevisaoTempoForm: NgForm) {
    if (!updatePrevisaoTempoForm.valid) {
      return
    }

    this.isLoading = true
    this.weatherService.update(this.previsao,this.token).subscribe()
    this.router.navigate(['admin']).then()
  }
}
