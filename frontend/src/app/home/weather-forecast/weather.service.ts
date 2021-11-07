import { Injectable } from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Observable} from "rxjs";
import {PrevisaoDoTempo} from "../../models/previsao-do-tempo.model";
import {Noticia} from "../../models/noticia.model";

@Injectable({providedIn: 'root'})
export class WeatherService {
  previsaoURL: string;
  updatePrevisaoURL: string;
  city = ''
  estate = ''

  constructor(private http: HttpClient) {
    this.previsaoURL = "http://localhost:8080/api/protected/previsao"
    this.updatePrevisaoURL = "http://localhost:8080/api/protected/previsaodotempo"
  }

  public getWeatherConfiguration(token: String): Observable<PrevisaoDoTempo> {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.get<PrevisaoDoTempo>(this.previsaoURL, httpOptions);
  }

  getWeatherDetails(city: string, estate: string) {
    // return this.http.get('https://api.openweathermap.org/data/2.5/forecast?q=Curitiba,Parana&units=metric&appid=8ad3ff943ada14c06c69d02b24ee960a&lang=pt_br')
    return this.http.get('https://api.openweathermap.org/data/2.5/forecast?q='+city+','+estate+'&units=metric&appid=8ad3ff943ada14c06c69d02b24ee960a&lang=pt_br')
  }

  public update(previsao: PrevisaoDoTempo | undefined, token: String): Observable<Object> {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.put(this.updatePrevisaoURL, previsao, httpOptions)
  }
}
