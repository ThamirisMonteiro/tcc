import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../authentication/auth.service";
import {Noticia} from "../../models/noticia.model";
import {NoticiasService} from "./noticias.service";

@Component({
  selector: 'app-noticias',
  templateUrl: './admin-noticias.component.html',
  styleUrls: ['./admin-noticias.component.css']
})
export class AdminNoticiasComponent implements OnInit {
  noticias?: Noticia[]
  noticia?: Noticia
  success: string = ""
  isSuccess: boolean = false;

  constructor(private router: Router, private noticiaService: NoticiasService, private http: HttpClient, private authService: AuthService, private _route: ActivatedRoute ) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.noticiaService.findAll(userData._token).subscribe((data) => {
      this.noticias = data;
    })
    if (this.router.getCurrentNavigation() != null) {
      this.isSuccess = this.router.getCurrentNavigation()?.extras?.state?.isSuccess
      if (this.isSuccess) {
        this.success = "Notícia cadastrada com sucesso!"
      }
      setTimeout(() => {
        this.isSuccess = false
      }, 3000);
    }
  }

  ngOnInit(): void {
  }

  onClickEditar(address: string) {
    this.router.navigate(["editar-noticia"], {state: {address: address}}).then()
  }

  onCheckboxClick(index: number) {
    // @ts-ignore
    this.noticia = this.noticias[index]
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.noticia.active = !this.noticia.active

    this.noticiaService.update(this.noticia, userData._token).subscribe()
  }
}
