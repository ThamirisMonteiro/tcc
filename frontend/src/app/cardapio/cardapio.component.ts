import { Component, OnInit } from '@angular/core';
import {Cardapio} from "../models/cardapio.model";
import {ActivatedRoute, Router} from "@angular/router";
import {CardapiosService} from "../admin/admin-cardapios/cardapios.service";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../authentication/auth.service";

@Component({
  selector: 'app-cardapio',
  templateUrl: './cardapio.component.html',
  styleUrls: ['./cardapio.component.css']
})
export class CardapioComponent {
  cardapios?: Cardapio[]
  segunda: Cardapio = new Cardapio('', '', '',  '','','','',
    '','','','',false)
  terca: Cardapio = new Cardapio('', '', '',  '','','','',
    '','','','',false)
  quarta: Cardapio = new Cardapio('', '', '',  '','','','',
    '','','','',false)
  quinta: Cardapio = new Cardapio('', '', '',  '','','','',
    '','','','',false)
  sexta: Cardapio = new Cardapio('', '', '',  '','','','',
    '','','','',false)

  constructor(private router: Router, private cardapiosService: CardapiosService, private http: HttpClient,
              private authService: AuthService, private _route: ActivatedRoute ) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.cardapiosService.findAll(userData._token).subscribe((data) => {
      this.cardapios = data;
      this.cardapios.forEach((card) => {
        switch (card.day) {
          case "Segunda-feira":
            this.segunda = card
            break;
            case "Terça-feira":
              this.terca = card
            break;
            case "Quarta-feira":
              this.quarta = card
            break;
            case "Quinta-feira":
              this.quinta = card
            break;
            case "Sexta-feira":
              this.sexta = card
            break;
        }
      })
    })
  }
}
