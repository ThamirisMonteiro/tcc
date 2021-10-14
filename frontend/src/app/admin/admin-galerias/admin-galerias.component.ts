import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../authentication/auth.service";
import {Galeria} from "../../models/galeria.model";
import {GaleriasService} from "./galerias.service";

@Component({
  selector: 'app-admin-galerias',
  templateUrl: './admin-galerias.component.html',
  styleUrls: ['./admin-galerias.component.css']
})
export class AdminGaleriasComponent implements OnInit {

  galerias?: Galeria[]
  galeria?: Galeria
  success: string = ""
  isSuccess: boolean = false;

  constructor(private router: Router, private galeriaService: GaleriasService, private http: HttpClient,
              private authService: AuthService, private _route: ActivatedRoute ) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.galeriaService.findAll(userData._token).subscribe((data) => {
      this.galerias = data;
    })
    if (this.router.getCurrentNavigation() != null) {
      this.isSuccess = this.router.getCurrentNavigation()?.extras?.state?.isSuccess
      if (this.isSuccess) {
        this.success = "Galeria cadastrada com sucesso!"
      }
      setTimeout(() => {
        this.isSuccess = false
      }, 3000);
    }
  }

  ngOnInit(): void {
  }

  onClickEditar(name: string) {
    this.router.navigate(["editar-galeria"], {state: {name: name}}).then()
  }

  onCheckboxClick(index: number) {
    // @ts-ignore
    this.galeria = this.galerias[index]
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.galeria.active = !this.galeria.active

    this.galeriaService.update(this.galeria, userData._token).subscribe()
  }
}
