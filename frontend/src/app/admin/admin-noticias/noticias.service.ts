import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {Noticia} from "../../models/noticia.model";
import {catchError} from "rxjs/operators";

@Injectable({providedIn: 'root'})
export class NoticiasService {
  noticiasUrl: string;
  noticiaByURL: string;
  private createNoticiaURL: string;

  constructor(private http: HttpClient) {
    this.noticiasUrl = "http://localhost:8080/api/protected/noticias";
    this.noticiaByURL = "http://localhost:8080/api/protected/noticiabyaddress";
    this.createNoticiaURL = "http://localhost:8080/api/protected/createnoticia";
  }

  public findAll(token: String): Observable<Noticia[]> {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.get<Noticia[]>(this.noticiasUrl, httpOptions);
  }

  public update(noticia: Noticia | undefined, token: String): Observable<Object> {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.put(this.noticiasUrl + "/"+noticia?.address, noticia, httpOptions)
  }

  findNoticiaByAddress(token: String, address: String) {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.post<Noticia>(this.noticiaByURL, {address: address}, httpOptions);
  }

  createNoticia(address: string, title: string, subtitle: string, category: string, image: string, text: string, active:
    boolean, token: string) {
      const httpOptions = {
        headers: new HttpHeaders().set("Authorization", "Bearer " + token)
      }
      return this.http.post(this.createNoticiaURL,{address: address, title: title, subtitle: subtitle, category: category,
        image: image, text: text, active: active}, httpOptions)
        .pipe(catchError(errorResponse => {
          let errorMessage = 'Ocorreu um erro desconhecido!'
          if (!errorResponse.error || !errorResponse.error.msg) {
            return throwError(errorMessage)
          }
          switch (errorResponse.error.msg) {
            case "noticia is already registered":
              errorMessage = "Notícia já cadastrada."
              break;
          }
          return throwError(errorMessage)
        }))
  }
}
