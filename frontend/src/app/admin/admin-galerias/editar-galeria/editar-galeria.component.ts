import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Galeria} from "../../../models/galeria.model";
import {GaleriasService} from "../galerias.service";
import {FotosService} from "../fotos.service";
import {Foto} from "../../../models/foto.model";

interface Imagem {
  image: string,
  thumbImage: string,
  alt: string,
  title: string
}

@Component({
  selector: 'app-editar-galeria',
  templateUrl: './editar-galeria.component.html',
  styleUrls: ['./editar-galeria.component.css']
})
export class EditarGaleriaComponent implements OnInit {
  isLoading = false
  error: string = ""
  galeria: Galeria = new Galeria('', '', '', '', '', '',  false)
  name: string
  url: any;
  msg = "";
  changedImage: any;
  imgCollection: Array<Imagem> = []
  fotos: Foto[] = []
  foto: any;
  qtdeImagens: number = 0
  removedImages: Foto[] = []
  addedImages: string[] = []
  allFotos: Foto[] = []

  constructor(private router: Router, private galeriasService: GaleriasService, private fotosService: FotosService) {
    this.name = this.router.getCurrentNavigation()?.extras?.state?.name
    if (this.name == undefined) {
      this.router.navigate(["admin-galerias"]).then()
    }
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.galeriasService.findGaleriaByName(userData._token, this.name).subscribe((data: Galeria ) => {
      this.galeria = data;
    })
    this.fotosService.findAllFotosByGaleria(userData._token, <String>this.name).subscribe((data) => {
      for (let i = 0; i < data.length; i++) {
        this.imgCollection.push({image: data[i].image, thumbImage: data[i].image, alt: "", title: ""})
      }
      this.allFotos = data
    })

    this.qtdeImagens = this.imgCollection.length
  }

  ngOnInit(): void {
  }

  onSubmit(editGaleriaForm: NgForm) {
    if (!editGaleriaForm.valid) {
      return
    }
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    if (this.removedImages.length > 0) {
      this.fotosService.inativarFotos(this.removedImages,userData._token).subscribe()
    }
    if (this.addedImages.length > 0) {
      for (let i = 0; i < this.addedImages.length; i++) {
        this.fotosService.uploadFoto(this.addedImages[i], this.galeria.name, userData._token).subscribe()
      }
    }
    this.galeriasService.update(this.galeria,userData._token).subscribe()
    this.router.navigate(['admin-galerias']).then()
  }

  selectFile(event: any) {
    if(!event.target.files[0] || event.target.files[0].length == 0) {
      this.msg = 'You must select an image';
      return;
    }

    let mimeType = event.target.files[0].type;

    if (mimeType.match(/image\/*/) == null) {
      this.msg = "Only images are supported";
      return;
    }

    let reader = new FileReader();

    reader.readAsDataURL(event.target.files[0]);

    reader.onload = (_event) => {
      this.msg = "";
      this.changedImage = reader.result
      this.galeria.cover_image = this.changedImage
    }
  }

  alreadyHasImage(image: string) {
    return image != "";
  }

  selectFotos(event: any) {
    let givenFotos = event.target.files
    for (let i = 0; i < givenFotos.length; i++) {
      if(!givenFotos[i] || givenFotos[i].length == 0) {
        this.msg = 'You must select an image';
        return;
      }
      let mimeType = event.target.files[i].type;
      if (mimeType.match(/image\/*/) == null) {
        this.msg = "Only images are supported";
        return;
      }
      let reader = new FileReader();

      reader.readAsDataURL(givenFotos[i]);

      reader.onload = (_event) => {
        this.msg = "";
        this.foto = reader.result
        this.imgCollection.push({image: this.foto, thumbImage: this.foto, alt: "", title: ""})
        this.addedImages.push(this.foto)
      }
    }
  }

  onClickExcluir(index: number) {
    this.removedImages.push(this.allFotos[index])
    this.imgCollection.splice(index, 1)
  }
}
