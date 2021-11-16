import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable} from "rxjs";

interface Job {
  id: String
  name: String
}



@Injectable({providedIn: 'root'})
export class JobsService {
  private jobsUrl: string;

  constructor(private http: HttpClient) {
    this.jobsUrl = "http://localhost:8080/api/protected/cargos";
  }

  public findAll(token: String): Observable<Job[]> {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.get<Job[]>(this.jobsUrl, httpOptions);
  }

  // findUserByID(token: String, id: String) {
  //   const httpOptions = {
  //     headers: new HttpHeaders().set("Authorization", "Bearer " + token)
  //   };
  //   return this.http.get(this.userByIDURL + "/" + id, httpOptions);
  // }
}
