import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../../authentication/auth.service";
import {Router} from "@angular/router";
import {GaleriasService} from "../galerias.service";
import {Galeria} from "../../../models/galeria.model";

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

  constructor(private authService: AuthService, private router: Router, private galeriasService: GaleriasService) {
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

    console.log(createGaleriaForm.value)

    this.galeriasService.createGaleria(createGaleriaForm.value.name, createGaleriaForm.value.description,
      createGaleriaForm.value.date, createGaleriaForm.value.category, this.changedImage,
      createGaleriaForm.value.Active, this.token).subscribe(
      res => {
        this.isLoading = false
        this.router.navigate(["admin-galerias"])
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

  alreadyHasImage(image: string) {
    return image != "";
  }
}
