import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Cardapio} from "../../models/cardapio.model";
import {CardapiosService} from "../../admin/admin-cardapios/cardapios.service";

@Component({
  selector: 'app-widget-cardapio',
  templateUrl: './widget-cardapio.component.html',
  styleUrls: ['./widget-cardapio.component.css']
})
export class WidgetCardapioComponent implements OnInit {
  cardapios?: Cardapio[]
  cardapio = new Cardapio('','','','','', '' ,'','','','','', false)

  constructor(private router: Router, private cardapioService: CardapiosService, private _route: ActivatedRoute ) {
    let dataAtual = new Date();
    let dias = ['Domingo', 'Segunda-feira','Terça-feira','Quarta-feira','Quinta-feira','Sexta-feira','Sábado'];
    let dia = dias[dataAtual.getDay()];
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.cardapioService.findAll(userData._token).subscribe((data) => {
      this.cardapios = data
      this.cardapios.forEach(cardapio => {
        if (cardapio.day == dia) {
          this.cardapio = cardapio
        }
      });
    })
  }

  ngOnInit(): void {
  }
}
