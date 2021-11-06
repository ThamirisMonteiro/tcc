import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {ServicosService} from "../admin/admin-servicos/servicos.service";
import {AuthService} from "../authentication/auth.service";
import {ServicoSolicitado} from "../models/servico-solicitado.model";

@Component({
  selector: 'app-servicos',
  templateUrl: './servicos.component.html',
  styleUrls: ['./servicos.component.css']
})
export class ServicosComponent implements OnInit {
  servicosSolicitados?: ServicoSolicitado[]
  servicoSolicitado?: ServicoSolicitado

  constructor(private router: Router, private servicosService: ServicosService, private http: HttpClient,
              private authService: AuthService, private _route: ActivatedRoute ) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.servicosService.findAllServicosSolicitadosForUser(userData._token, userData.id).subscribe((data) => {
      this.servicosSolicitados = data;
    })
  }

  ngOnInit(): void {

  }
}
