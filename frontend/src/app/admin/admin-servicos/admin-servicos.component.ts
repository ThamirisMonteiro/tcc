import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../authentication/auth.service";
import {ServicosService} from "./servicos.service";
import {Servico} from "../../models/servico.model";

@Component({
  selector: 'app-servicos',
  templateUrl: './admin-servicos.component.html',
  styleUrls: ['./admin-servicos.component.css']
})
export class AdminServicosComponent implements OnInit {
  servicos?: Servico[]
  servico?: Servico
  success: string = ""
  isSuccess: boolean = false;

  constructor(private router: Router, private servicosService: ServicosService, private http: HttpClient,
              private authService: AuthService, private _route: ActivatedRoute ) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.servicosService.findAll(userData._token).subscribe((data) => {
      this.servicos = data;
    })
    if (this.router.getCurrentNavigation() != null) {
      this.isSuccess = this.router.getCurrentNavigation()?.extras?.state?.isSuccess
      if (this.isSuccess) {
        this.success = "Serviço cadastrado com sucesso!"
      }
      setTimeout(() => {
        this.isSuccess = false
      }, 3000);
    }
  }

  ngOnInit(): void {

  }

  onClickEditar(name: string) {
    this.router.navigate(["editar-servico"], {state: {name: name}}).then()
  }

  onCheckboxClick(index: number) {
    // @ts-ignore
    this.servico = this.servicos[index]
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.servico.active = !this.servico.active

    this.servicosService.update(this.servico, userData._token).subscribe()
  }
}
