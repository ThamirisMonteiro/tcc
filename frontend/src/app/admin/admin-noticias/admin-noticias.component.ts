import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../authentication/auth.service";
import {Noticia} from "../../models/noticia.model";
import {NoticiasService} from "./noticias.service";
import {InformationDialogService} from "../../shared/information-dialog/information-dialog.service";

@Component({
  selector: 'app-noticias',
  templateUrl: './admin-noticias.component.html',
  styleUrls: ['./admin-noticias.component.css']
})
export class AdminNoticiasComponent {
  noticias: Noticia[] = []
  noticia: Noticia = new Noticia('','','','','','','',true)

  constructor(private router: Router, private noticiaService: NoticiasService, private http: HttpClient,
              private authService: AuthService, private _route: ActivatedRoute,
              private confirmationDialogService: InformationDialogService ) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.noticiaService.findAll(userData._token).subscribe((data) => {
      this.noticias = data;
    })
  }

  onClickEditar(address: string) {
    this.router.navigate(["editar-noticia"], {state: {address: address}}).then()
  }

  onCheckboxClick(i: number) {
    this.noticia = this.noticias[i]
    let palavra: String
    (this.noticia.active) ? palavra = "inativada" : palavra = "ativada"
    this.confirmationDialogService.confirm('Sucesso', 'Notícia ' + palavra + ' com sucesso!')
      .then(() => {
        const userData = JSON.parse(<string>localStorage.getItem('userData'))
        this.noticia.active = !this.noticia.active
        this.noticiaService.update(this.noticia, userData._token).subscribe(() => {})})}
}
