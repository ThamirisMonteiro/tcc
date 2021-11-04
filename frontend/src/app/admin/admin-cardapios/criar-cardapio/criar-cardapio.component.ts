import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../../authentication/auth.service";
import {Router} from "@angular/router";
import {Cardapio} from "../../../models/cardapio.model";
import {CardapiosService} from "../cardapios.service";

interface CategoryItems {
  [item:string]: string[]
}

@Component({
  selector: 'app-criar-cardapio',
  templateUrl: './criar-cardapio.component.html',
  styleUrls: ['./criar-cardapio.component.css']
})
export class CriarCardapioComponent implements OnInit {
  isLoading = false
  error: string = ""
  token = ""
  cardapio: Cardapio = new Cardapio('', '', '',  '','','','',
    '','','','',false)
  url: any;
  msg = "";

  constructor(private authService: AuthService, private router: Router, private cardapiosService: CardapiosService) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.token = userData._token
    let carboidratos: CategoryItems = {item: ["a", "b"]}
  }

  ngOnInit(): void {
  }

  onSubmit(createCardapioForm: NgForm) {
    if (!createCardapioForm.valid) {
      return
    }

    createCardapioForm.value.active = true
    this.isLoading = true

    this.cardapiosService.createCardapio(createCardapioForm.value.name, createCardapioForm.value.day,
      createCardapioForm.value.carboidrato, createCardapioForm.value.proteina, createCardapioForm.value.salada,
      createCardapioForm.value.legume, createCardapioForm.value.molho, createCardapioForm.value.grao,
      createCardapioForm.value.suco, createCardapioForm.value.sobremesa, createCardapioForm.value.Active,
      this.token).subscribe(
      () => {

        this.isLoading = false
        this.router.navigate(["admin-cardapios"]).then()
      }, errorMessage => {
        this.error = errorMessage
        this.isLoading = false
        createCardapioForm.value.name = ""
        createCardapioForm.value.name.focus
        setTimeout(() => {
          this.error = ""
        }, 3000);
      }
    )
  }
}

