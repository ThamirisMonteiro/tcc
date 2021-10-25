import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Cardapio} from "../../models/cardapio.model";

@Injectable({providedIn: 'root'})
export class CardapiosService {
  cardapiosURL: string;
  cardapioByName: string;
  private createCardapioURL: string;

  constructor(private http: HttpClient) {
    this.cardapiosURL = "http://localhost:8080/api/protected/cardapios";
    this.cardapioByName = "http://localhost:8080/api/protected/cardapiobyname";
    this.createCardapioURL = "http://localhost:8080/api/protected/createcardapio";
  }

  public findAll(token: String): Observable<Cardapio[]> {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.get<Cardapio[]>(this.cardapiosURL, httpOptions);
  }

  public update(cardapio: Cardapio | undefined, token: String): Observable<Object> {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.put(this.cardapiosURL + "/"+cardapio?.name, cardapio, httpOptions)
  }

  findCardapioByName(token: String, name: String) {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.post<Cardapio>(this.cardapioByName, {name: name}, httpOptions);
  }

  createCardapio(name: string, day: string, items: string, active: boolean, token: string) {
      const httpOptions = {
        headers: new HttpHeaders().set("Authorization", "Bearer " + token)
      }
      return this.http.post(this.createCardapioURL,{name: name, day: day, items: items, active: active},
        httpOptions)
        .pipe(catchError(errorResponse => {
          let errorMessage = 'Ocorreu um erro desconhecido!'
          if (!errorResponse.error || !errorResponse.error.msg) {
            return throwError(errorMessage)
          }
          switch (errorResponse.error.msg) {
            case "cardapio is already registered":
              errorMessage = "Cardápio já cadastrado."
              break;
          }
          return throwError(errorMessage)
        }))
  }
}
