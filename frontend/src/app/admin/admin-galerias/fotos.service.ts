import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {Noticia} from "../../models/noticia.model";
import {catchError} from "rxjs/operators";
import {Galeria} from "../../models/galeria.model";
import {Foto} from "../../models/foto.model";

@Injectable({providedIn: 'root'})
export class FotosService {
  fotosUrl: string;
  fotoByImage: string;
  uploadFotoURL: string;
  fotosByGaleria: string;
  inativarFotosUrl: string;

  constructor(private http: HttpClient) {
    this.fotosUrl = "http://localhost:8080/api/protected/fotos";
    this.fotoByImage = "http://localhost:8080/api/protected/fotobyimage";
    this.uploadFotoURL = "http://localhost:8080/api/protected/uploadfoto";
    this.fotosByGaleria = "http://localhost:8080/api/protected/fotosbygaleria";
    this.inativarFotosUrl = "http://localhost:8080/api/protected/inativarfotos";
  }

  public findAllFotosByGaleria(token: String, name: String): Observable<Foto[]> {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.post<Foto[]>(this.fotosByGaleria, {name: name}, httpOptions);
  }

  uploadFoto(image: string, galeria: string, token: string) {
      const httpOptions = {
        headers: new HttpHeaders().set("Authorization", "Bearer " + token)
      }
      return this.http.post(this.uploadFotoURL,{image: image, galeria: galeria}, httpOptions)
        .pipe(catchError(errorResponse => {
          let errorMessage = 'Ocorreu um erro desconhecido!'
          if (!errorResponse.error || !errorResponse.error.msg) {
            return throwError(errorMessage)
          }
          switch (errorResponse.error.msg) {
            case "foto is already registered":
              errorMessage = "Foto já cadastrada."
              break;
          }
          return throwError(errorMessage)
        }))
  }

  public inativarFotos(fotos: Foto[], token: String): Observable<Object> {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    let ids = fotos.map(({ id }) => id)
    return this.http.put(this.inativarFotosUrl, {fotos_ids: ids}, httpOptions)
  }
}
