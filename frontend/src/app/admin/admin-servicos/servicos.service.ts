import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import {Observable, throwError} from "rxjs";
import {catchError} from "rxjs/operators";
import {Servico} from "../../models/servico.model";
import {ServicoSolicitado} from "../../models/servico-solicitado.model";

@Injectable({providedIn: 'root'})
export class ServicosService {
  servicosURL: string;
  servicoByName: string;
  servicosSolicitadosURL: string;
  solicitarServicoURL: string;
  private createServicoURL: string;

  constructor(private http: HttpClient) {
    this.servicosURL = "http://localhost:8080/api/protected/servicos";
    this.servicosSolicitadosURL = "http://localhost:8080/api/protected/servicossolicitadosbyuser";
    this.servicoByName = "http://localhost:8080/api/protected/servicobyname";
    this.createServicoURL = "http://localhost:8080/api/protected/createservico";
    this.solicitarServicoURL = "http://localhost:8080/api/protected/solicitarservico";
  }

  public findAll(token: String): Observable<Servico[]> {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.get<Servico[]>(this.servicosURL, httpOptions);
  }

  public findAllServicosSolicitadosForUser(token: String, userID: String): Observable<ServicoSolicitado[]> {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.post<ServicoSolicitado[]>(this.servicosSolicitadosURL, {user_id: userID},httpOptions);
  }

  public update(servico: Servico | undefined, token: String): Observable<Object> {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.put(this.servicosURL + "/"+servico?.name, servico, httpOptions)
  }

  findServicoByName(token: String, name: String) {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    };
    return this.http.post<Servico>(this.servicoByName, {name: name}, httpOptions);
  }

  createServico(name: string, category: string, responsible_sector: string, active: boolean, token: string) {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    }
    return this.http.post(this.createServicoURL,{name: name, category: category,
      responsible_sector: responsible_sector, active: active}, httpOptions)
      .pipe(catchError(errorResponse => {
        let errorMessage = 'Ocorreu um erro desconhecido!'
        if (!errorResponse.error || !errorResponse.error.msg) {
          return throwError(errorMessage)
        }
        switch (errorResponse.error.msg) {
          case "servico is already registered":
            errorMessage = "Serviço já cadastrado."
            break;
        }
        return throwError(errorMessage)
      }))
  }

  solicitarServico(name: string, category: string, sector: string, description: string, token: string, user_id: string) {
    const httpOptions = {
      headers: new HttpHeaders().set("Authorization", "Bearer " + token)
    }
    return this.http.post(this.solicitarServicoURL,{name: name, category: category,
      sector: sector, description: description, user_id: user_id}, httpOptions)
      .pipe(catchError(errorResponse => {
        let errorMessage = 'Ocorreu um erro desconhecido!'
        if (!errorResponse.error || !errorResponse.error.msg) {
          return throwError(errorMessage)
        }
        switch (errorResponse.error.msg) {
          case "servico is already registered":
            errorMessage = "Serviço já solicitado."
            break;
        }
        return throwError(errorMessage)
      }))
  }
}
