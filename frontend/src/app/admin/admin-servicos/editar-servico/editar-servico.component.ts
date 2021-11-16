import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {ServicosService} from "../servicos.service";
import {Servico} from "../../../models/servico.model";

@Component({
  selector: 'app-editar-servico',
  templateUrl: './editar-servico.component.html',
  styleUrls: ['./editar-servico.component.css']
})
export class EditarServicoComponent implements OnInit {
  isLoading = false
  servico: Servico = new Servico('', '', '', '', '', false)
  name: string
  msg = "";

  constructor(private router: Router, private servicosServive: ServicosService) {
    this.name = this.router.getCurrentNavigation()?.extras?.state?.name
    if (this.name == undefined) {
      this.router.navigate(["admin-servicos"]).then()
    }
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.servicosServive.findServicoByName(userData._token, this.name).subscribe((data: Servico) => {
      this.servico = data;
    })
  }

  ngOnInit(): void {
  }

  onSubmit(editServicoForm: NgForm) {
    if (!editServicoForm.valid) {
      return
    }
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.servicosServive.update(this.servico, userData._token).subscribe()
    this.router.navigate(['admin-servicos']).then()
  }
}
