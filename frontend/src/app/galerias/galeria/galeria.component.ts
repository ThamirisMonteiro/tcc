import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Galeria} from "../../models/galeria.model";
import {GaleriasService} from "../../admin/admin-galerias/galerias.service";
import {FotosService} from "../../admin/admin-galerias/fotos.service";

interface Imagem {
  image: string,
  thumbImage: string,
  alt: string,
  title: string
}

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})

export class GaleriaComponent implements OnInit {
  category?: string;
  name?: string;
  galeria: Galeria = new Galeria('', '', '', '', '', '', false)
  imgCollection: Array<Imagem> = []

  ngOnInit(): void {
  }

  constructor(private router: Router, private galeriasService: GaleriasService, private fotosService: FotosService) {
    if (this.router.getCurrentNavigation() != null) {
      this.name = this.router.getCurrentNavigation()?.extractedUrl.root.children.primary.segments[1].path
      const userData = JSON.parse(<string>localStorage.getItem('userData'))
      this.galeriasService.findGaleriaByName(userData._token, <String>this.name).subscribe((data) => {
        this.galeria = data;})
      this.fotosService.findAllFotosByGaleria(userData._token, <String>this.name).subscribe((data) => {
        for (let i = 0; i < data.length; i++) {
          this.imgCollection.push({image: data[i].image, thumbImage: data[i].image, alt: "", title: ""})
        }})
    } else {
      this.router.navigate(['/galerias']).then()
    }
  }
}
