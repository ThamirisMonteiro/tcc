import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../authentication/auth.service";
import {CardapiosService} from "./cardapios.service";
import {Cardapio} from "../../models/cardapio.model";

@Component({
  selector: 'app-cardapios',
  templateUrl: './admin-cardapios.component.html',
  styleUrls: ['./admin-cardapios.component.css']
})
export class AdminCardapiosComponent implements OnInit {
  cardapios?: Cardapio[]
  cardapio?: Cardapio
  success: string = ""
  isSuccess: boolean = false;

  constructor(private router: Router, private cardapiosService: CardapiosService, private http: HttpClient,
              private authService: AuthService, private _route: ActivatedRoute ) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.cardapiosService.findAll(userData._token).subscribe((data) => {
      this.cardapios = data;
    })
    if (this.router.getCurrentNavigation() != null) {
      this.isSuccess = this.router.getCurrentNavigation()?.extras?.state?.isSuccess
      if (this.isSuccess) {
        this.success = "Cardápio cadastrado com sucesso!"
      }
      setTimeout(() => {
        this.isSuccess = false
      }, 3000);
    }
  }

  ngOnInit(): void {
  }

  onClickEditar(name: string) {
    this.router.navigate(["editar-cardapio"], {state: {name: name}}).then()
  }

  onCheckboxClick(index: number) {
    // @ts-ignore
    this.cardapio = this.cardapios[index]
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.cardapio.active = !this.cardapio.active

    this.cardapiosService.update(this.cardapio, userData._token).subscribe()
  }
}
