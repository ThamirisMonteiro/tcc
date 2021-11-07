import { Component, OnInit } from '@angular/core';
import {HOUR} from "ngx-bootstrap/chronos/units/constants";

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  saudacao = ''
  nome = ''

  constructor() {
    this.nome = JSON.parse(<string>localStorage.getItem('userData')).name
    let dataAtual = new Date();
    let hora = dataAtual.getHours();

    switch (hora) {
      case 6: case 7: case 8: case 9: case 10: case 11:
        this.saudacao = 'Bom dia'
        break
      case 12: case 13: case 14: case 15: case 16: case 17:
        this.saudacao = 'Boa tarde'
        break
      case 18: case 19: case 20: case 21: case 22: case 23: case 24: case 0: case 1: case 2: case 3: case 4: case 5:
        this.saudacao = 'Boa noite'
        break
    }
  }

  ngOnInit(): void {
  }

}
