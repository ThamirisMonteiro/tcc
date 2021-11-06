import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../../authentication/auth.service";
import {Router} from "@angular/router";
import {Servico} from "../../../models/servico.model";
import {ServicosService} from "../servicos.service";

@Component({
  selector: 'app-criar-servico',
  templateUrl: './criar-servico.component.html',
  styleUrls: ['./criar-servico.component.css']
})
export class CriarServicoComponent implements OnInit {
  isLoading = false
  error: string = ""
  token = ""
  servico: Servico = new Servico('', '', '',  '','',false)
  url: any;
  msg = "";

  constructor(private authService: AuthService, private router: Router, private servicosService: ServicosService) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.token = userData._token
  }

  ngOnInit(): void {
  }

  onSubmit(createServicoForm: NgForm) {
    if (!createServicoForm.valid) {
      return
    }

    createServicoForm.value.active = true
    this.isLoading = true

    this.servicosService.createServico(createServicoForm.value.name, createServicoForm.value.category,
      createServicoForm.value.responsible_sector, createServicoForm.value.Active, this.token).subscribe(
      () => {
        this.isLoading = false
        this.router.navigate(["admin-servicos"]).then()
      }, errorMessage => {
        this.error = errorMessage
        this.isLoading = false
        createServicoForm.value.name = ""
        createServicoForm.value.name.focus
        setTimeout(() => {
          this.error = ""
        }, 3000);
      }
    )
  }
}

