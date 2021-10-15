import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Galeria} from "../../../models/galeria.model";
import {GaleriasService} from "../galerias.service";

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

  constructor(private router: Router, private galeriasService: GaleriasService) {
    this.name = this.router.getCurrentNavigation()?.extras?.state?.name
    if (this.name == undefined) {
      this.router.navigate(["admin-galerias"]).then()
    }
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.galeriasService.findGaleriaByName(userData._token, this.name).subscribe((data: Galeria ) => {
      this.galeria = data;
    })
  }

  ngOnInit(): void {
  }

  onSubmit(editGaleriaForm: NgForm) {
    if (!editGaleriaForm.valid) {
      return
    }
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
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
}
