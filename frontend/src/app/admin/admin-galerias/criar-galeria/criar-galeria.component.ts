import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../../authentication/auth.service";
import {Router} from "@angular/router";
import {GaleriasService} from "../galerias.service";
import {Galeria} from "../../../models/galeria.model";
import {FotosService} from "../fotos.service";
import {Foto} from "../../../models/foto.model";

@Component({
  selector: 'app-criar-galeria',
  templateUrl: './criar-galeria.component.html',
  styleUrls: ['./criar-galeria.component.css']
})
export class CriarGaleriaComponent implements OnInit {
  isLoading = false
  error: string = ""
  token = ""
  galeria: Galeria = new Galeria('', '', '', '', '', '',  false)
  url: any;
  msg = "";
  changedImage: any;
  fotos: Foto[] = []
  foto: any;

  constructor(private authService: AuthService, private router: Router, private galeriasService: GaleriasService,
              private fotosService: FotosService) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.token = userData._token
  }

  ngOnInit(): void {
  }

  onSubmit(createGaleriaForm: NgForm) {
    if (!createGaleriaForm.valid) {
      return
    }

    createGaleriaForm.value.active = true

    this.isLoading = true

    for (let i = 0; i < this.fotos.length; i++) {
      this.fotosService.uploadFoto(this.fotos[i].image, createGaleriaForm.value.name, this.token).subscribe()
    }

    this.galeriasService.createGaleria(createGaleriaForm.value.name, createGaleriaForm.value.description,
      createGaleriaForm.value.date, createGaleriaForm.value.category, this.changedImage,
      createGaleriaForm.value.Active, this.token).subscribe(
      () => {
        this.isLoading = false
        this.router.navigate(["admin-galerias"]).then()
      }, errorMessage => {
        this.error = errorMessage
        this.isLoading = false
        createGaleriaForm.value.name = ""
        createGaleriaForm.value.name.focus
        this.changedImage = ""
        setTimeout(() => {
          this.error = ""
        }, 3000);
      }
    )
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
        this.fotos[i] = new Foto('', this.foto, true)
      }
    }
  }

  alreadyHasImage(image: string) {
    return image != "";
  }
}
