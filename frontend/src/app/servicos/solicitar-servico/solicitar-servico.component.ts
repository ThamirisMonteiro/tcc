import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {Router} from "@angular/router";
import {ServicoSolicitado} from "../../models/servico-solicitado.model";
import {AuthService} from "../../authentication/auth.service";
import {ServicosService} from "../../admin/admin-servicos/servicos.service";

@Component({
  selector: 'app-solicitar-servico',
  templateUrl: './solicitar-servico.component.html',
  styleUrls: ['./solicitar-servico.component.css']
})
export class SolicitarServicoComponent implements OnInit {
  isLoading = false
  error: string = ""
  token = ""
  user_id = ""
  servicoSolicitado: ServicoSolicitado = new ServicoSolicitado('', '', '',  '','','')
  url: any;
  msg = "";

  constructor(private authService: AuthService, private router: Router, private servicosService: ServicosService) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.token = userData._token
    this.user_id = userData.id
  }

  ngOnInit(): void {
  }

  onSubmit(createServicoForm: NgForm) {
    if (!createServicoForm.valid) {
      return
    }

    createServicoForm.value.active = true
    this.isLoading = true
    console.log(this.user_id)
    this.servicosService.solicitarServico(createServicoForm.value.name, createServicoForm.value.category,
      createServicoForm.value.sector, createServicoForm.value.description, this.token, this.user_id).subscribe(
      () => {
        this.isLoading = false
        this.router.navigate(["servicos"]).then()
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

