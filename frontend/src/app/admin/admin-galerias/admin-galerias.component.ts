import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../authentication/auth.service";
import {Galeria} from "../../models/galeria.model";
import {GaleriasService} from "./galerias.service";
import {InformationDialogService} from "../../shared/information-dialog/information-dialog.service";

@Component({
  selector: 'app-admin-galerias',
  templateUrl: './admin-galerias.component.html',
  styleUrls: ['./admin-galerias.component.css']
})
export class AdminGaleriasComponent {
  galerias: Galeria[] = []
  galeria: Galeria = new Galeria('','','','','','',false)

  constructor(private router: Router, private galeriaService: GaleriasService, private http: HttpClient,
              private authService: AuthService, private _route: ActivatedRoute,
              private confirmationDialogService: InformationDialogService ) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.galeriaService.findAll(userData._token).subscribe((data) => {
      this.galerias = data;
    })
  }

  onClickEditar(name: string) {
    this.router.navigate(["editar-galeria"], {state: {name: name}}).then()
  }

  onCheckboxClick(i: number) {
    this.galeria = this.galerias[i]
    let palavra: String
    (this.galeria.active) ? palavra = "inativada" : palavra = "ativada"
    this.confirmationDialogService.confirm('Sucesso', 'Galeria ' + palavra + ' com sucesso!')
      .then(() => {
        const userData = JSON.parse(<string>localStorage.getItem('userData'))
        this.galeria.active = !this.galeria.active
        this.galeriaService.update(this.galeria, userData._token).subscribe(() => {
        })})}
}
