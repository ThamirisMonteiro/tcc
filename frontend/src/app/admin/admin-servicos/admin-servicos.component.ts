import { Component } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../authentication/auth.service";
import {ServicosService} from "./servicos.service";
import {Servico} from "../../models/servico.model";
import {InformationDialogService} from "../../shared/information-dialog/information-dialog.service";

@Component({
  selector: 'app-admin-servicos',
  templateUrl: './admin-servicos.component.html',
  styleUrls: ['./admin-servicos.component.css']
})
export class AdminServicosComponent {
  servicos: Servico[] = []
  servico: Servico = new Servico('','','','','',true)

  constructor(private router: Router, private servicosService: ServicosService, private http: HttpClient,
              private authService: AuthService, private _route: ActivatedRoute,
              private confirmationDialogService: InformationDialogService ) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.servicosService.findAll(userData._token).subscribe((data) => {
      this.servicos = data;
    })
  }

  onClickEditar(name: string) {
    this.router.navigate(["editar-servico"], {state: {name: name}}).then()
  }

  onCheckboxClick(i: number) {
    this.servico = this.servicos[i]
    let palavra: String
    (this.servico.active) ? palavra = "inativado" : palavra = "ativado"
    this.confirmationDialogService.confirm('Sucesso', 'Serviço ' + palavra + ' com sucesso!')
      .then(() => {
      const userData = JSON.parse(<string>localStorage.getItem('userData'))
      this.servico.active = !this.servico.active
      this.servicosService.update(this.servico, userData._token).subscribe(() => {
      })})}
}
