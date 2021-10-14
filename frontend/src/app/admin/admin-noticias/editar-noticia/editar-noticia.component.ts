import { Component, OnInit } from '@angular/core';
import {Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {Noticia} from "../../../models/noticia.model";
import {NoticiasService} from "../noticias.service";

@Component({
  selector: 'app-editar-noticia',
  templateUrl: './editar-noticia.component.html',
  styleUrls: ['./editar-noticia.component.css']
})
export class EditarNoticiaComponent implements OnInit {
  isLoading = false
  error: string = ""
  noticia: Noticia = new Noticia('', '', '', '', '', '', '',  false)
  address: string
  url: any;
  msg = "";
  changedImage: any;

  constructor(private router: Router, private noticiaService: NoticiasService) {
    this.address = this.router.getCurrentNavigation()?.extras?.state?.address
    if (this.address == undefined) {
      this.router.navigate(["admin-noticias"]).then()
    }
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.noticiaService.findNoticiaByAddress(userData._token, this.address).subscribe((data: Noticia ) => {
      this.noticia = data;
    })
  }

  ngOnInit(): void {
  }

  onSubmit(editNoticiaForm: NgForm) {
    if (!editNoticiaForm.valid) {
      return
    }
    console.log(this.noticia)
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.noticiaService.update(this.noticia,userData._token).subscribe()
    this.router.navigate(['admin-noticias']).then()
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
      this.noticia.image = this.changedImage
    }
  }

  alreadyHasImage(image: string) {
    return image != "";
  }
}
