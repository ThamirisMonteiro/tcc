import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../../authentication/auth.service";
import {Router} from "@angular/router";
import {Cardapio} from "../../../models/cardapio.model";
import {CardapiosService} from "../cardapios.service";

@Component({
  selector: 'app-criar-cardapio',
  templateUrl: './criar-cardapio.component.html',
  styleUrls: ['./criar-cardapio.component.css']
})
export class CriarCardapioComponent implements OnInit {
  isLoading = false
  error: string = ""
  token = ""
  cardapio: Cardapio = new Cardapio('', '', '',  '',false)
  url: any;
  msg = "";

  items = [
    {id: 1, name: 'Python'},
    {id: 2, name: 'Node Js'},
    {id: 3, name: 'Java'},
    {id: 4, name: 'PHP', disabled: true},
    {id: 5, name: 'Django'},
    {id: 6, name: 'Angular'},
    {id: 7, name: 'Vue'},
    {id: 8, name: 'ReactJs'},
  ];
  selected = [
    {id: 2, name: 'Node Js'},
    {id: 8, name: 'ReactJs'}
  ];

  constructor(private authService: AuthService, private router: Router, private cardapiosService: CardapiosService) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.token = userData._token
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
      createCardapioForm.value.items, createCardapioForm.value.Active, this.token).subscribe(
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

