import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {CardapiosService} from "../cardapios.service";
import {Cardapio} from "../../../models/cardapio.model";

@Component({
  selector: 'app-editar-cardapio',
  templateUrl: './editar-cardapio.component.html',
  styleUrls: ['./editar-cardapio.component.css']
})
export class EditarCardapioComponent implements OnInit {
  isLoading = false
  error: string = ""
  cardapio: Cardapio = new Cardapio('', '', '', '', '', '', '',
    '', '', '', '', false)
  name: string
  msg = "";

  constructor(private router: Router, private cardapioService: CardapiosService) {
    this.name = this.router.getCurrentNavigation()?.extras?.state?.name
    if (this.name == undefined) {
      this.router.navigate(["admin-cardapios"]).then()
    }
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.cardapioService.findCardapioByName(userData._token, this.name).subscribe((data: Cardapio) => {
      this.cardapio = data;
    })
  }

  ngOnInit(): void {
  }

  onSubmit(editNoticiaForm: NgForm) {
    if (!editNoticiaForm.valid) {
      return
    }
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.cardapioService.update(this.cardapio, userData._token).subscribe()
    this.router.navigate(['admin-cardapios']).then()
  }
}
