import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable} from "rxjs";

interface Sector {
  id: String
  name: String
}

@Injectable({providedIn: 'root'})
export class SectorsService {
  private sectorsUrl: string;

  constructor(private http: HttpClient) {
    this.sectorsUrl = "http://localhost:8080/api/protected/setores";
  }

  public findAll(token: String): Observable<Sector[]> {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.get<Sector[]>(this.sectorsUrl, httpOptions);
  }

  // findUserByID(token: String, id: String) {
  //   const httpOptions = {
  //     headers: new HttpHeaders().set("Authorization", "Bearer " + token)
  //   };
  //   return this.http.get(this.userByIDURL + "/" + id, httpOptions);
  // }
}
