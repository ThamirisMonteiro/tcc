import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {Galeria} from "../models/galeria.model";
import {GaleriasService} from "../admin/admin-galerias/galerias.service";

@Component({
  selector: 'app-noticias',
  templateUrl: './galerias.component.html',
  styleUrls: ['./galerias.component.css']
})
export class GaleriasComponent implements OnInit {
  galerias?: Galeria[]

  constructor(private router: Router, private galeriasService: GaleriasService, private _route: ActivatedRoute ) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.galeriasService.findAll(userData._token).subscribe((data) => {
      this.galerias = data;
    })
  }

  ngOnInit(): void {
  }

  onClickGaleria(name: string) {
    this.router.navigate(['/galerias/' + name.toLowerCase()]).then()
  }

  alreadyHasImage(image: string) {
    return image != "";
  }
}
