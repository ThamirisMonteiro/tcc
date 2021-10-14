import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { User } from "../../models/user.model";
import {Observable, Subscription} from "rxjs";

@Injectable({providedIn: 'root'})
export class UsuariosService {
  private usersUrl: string;
  private userByEmailURL: string;

  constructor(private http: HttpClient) {
    this.usersUrl = "http://localhost:8080/api/protected/users";
    this.userByEmailURL = "http://localhost:8080/api/protected/userbyemail";
  }

  public findAll(token: String): Observable<User[]> {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.get<User[]>(this.usersUrl, httpOptions);
  }

  public update(user: User | undefined, token: String): Observable<Object> {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.put(this.usersUrl + "/" + user?.email, user, httpOptions)
  }

  findUserByEmail(token: String, email: String) {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.post<User>(this.userByEmailURL, email, httpOptions);
  }
}
