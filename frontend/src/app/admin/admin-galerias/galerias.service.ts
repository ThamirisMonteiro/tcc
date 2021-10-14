import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {Noticia} from "../../models/noticia.model";
import {catchError} from "rxjs/operators";
import {Galeria} from "../../models/galeria.model";

@Injectable({providedIn: 'root'})
export class GaleriasService {
  galeriasUrl: string;
  galeriaByName: string;
  private createGaleriaURL: string;

  constructor(private http: HttpClient) {
    this.galeriasUrl = "http://localhost:8080/api/protected/galerias";
    this.galeriaByName = "http://localhost:8080/api/protected/galeriabyname";
    this.createGaleriaURL = "http://localhost:8080/api/protected/creategaleria";
  }

  public findAll(token: String): Observable<Galeria[]> {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.get<Galeria[]>(this.galeriasUrl, httpOptions);
  }

  public update(galeria: Galeria | undefined, token: String): Observable<Object> {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.put(this.galeriasUrl + "/"+galeria?.name, galeria, httpOptions)
  }

  findGaleriaByName(token: String, name: String) {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.post<Galeria>(this.galeriaByName, {name: name}, httpOptions);
  }

  createGaleria(name: string, description: string, date: string, category: string, coverImage: string, active:
    boolean, token: string) {
      const httpOptions = {
        headers: new HttpHeaders().set("Authorization", "Bearer " + token)
      }
      return this.http.post(this.createGaleriaURL,{name:name, description:description, date:date,
        category: category, cover_image: coverImage, active: active}, httpOptions)
        .pipe(catchError(errorResponse => {
          let errorMessage = 'Ocorreu um erro desconhecido!'
          if (!errorResponse.error || !errorResponse.error.msg) {
            return throwError(errorMessage)
          }
          switch (errorResponse.error.msg) {
            case "galeria is already registered":
              errorMessage = "Galeria já cadastrada."
              break;
          }
          return throwError(errorMessage)
        }))
  }
}
