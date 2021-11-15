import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../authentication/auth.service";
import {CardapiosService} from "./cardapios.service";
import {Cardapio} from "../../models/cardapio.model";
import {InformationDialogService} from "../../shared/information-dialog/information-dialog.service";

@Component({
  selector: 'app-cardapios',
  templateUrl: './admin-cardapios.component.html',
  styleUrls: ['./admin-cardapios.component.css']
})
export class AdminCardapiosComponent {
  cardapios: Cardapio[] = []
  cardapio: Cardapio = new Cardapio('','','','','','','','',
    '','','',false)

  constructor(private router: Router, private cardapiosService: CardapiosService, private http: HttpClient,
              private authService: AuthService, private _route: ActivatedRoute,
              private confirmationDialogService: InformationDialogService) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.cardapiosService.findAll(userData._token).subscribe((data) => {
      this.cardapios = data;
    })
  }

  onClickEditar(name: string) {
    console.log(name)
    this.router.navigate(["editar-cardapio"], {state: {name: name}}).then()
  }

  onCheckboxClick(i: number) {
    this.cardapio = this.cardapios[i]
    let palavra: String
    (this.cardapio.active) ? palavra = "inativado" : palavra = "ativado"
    this.confirmationDialogService.confirm('Sucesso', 'Cardápio ' + palavra + ' com sucesso!')
      .then(() => {
        const userData = JSON.parse(<string>localStorage.getItem('userData'))
        this.cardapio.active = !this.cardapio.active
        this.cardapiosService.update(this.cardapio, userData._token).subscribe(() => {
        })})}
}
