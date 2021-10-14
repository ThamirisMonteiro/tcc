import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../../authentication/auth.service";
import {Router} from "@angular/router";
import {NoticiasService} from "../noticias.service";

@Component({
  selector: 'app-criar-noticia',
  templateUrl: './criar-noticia.component.html',
  styleUrls: ['./criar-noticia.component.css']
})
export class CriarNoticiaComponent implements OnInit {
  isLoading = false
  error: string = ""
  token = ""

  constructor(private authService: AuthService, private router: Router, private noticiasService: NoticiasService) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.token = userData._token
  }

  ngOnInit(): void {
  }

  onSubmit(createNoticiaForm: NgForm) {
    if (!createNoticiaForm.valid) {
      return
    }

    createNoticiaForm.value.active = true

    this.isLoading = true

    this.noticiasService.createNoticia(createNoticiaForm.value.address, createNoticiaForm.value.title,
      createNoticiaForm.value.subtitle, createNoticiaForm.value.category, createNoticiaForm.value.image,
      createNoticiaForm.value.text, createNoticiaForm.value.active, this.token).subscribe(
      res => {
        this.isLoading = false
        this.router.navigate(["admin-noticias"])
      }, errorMessage => {
        this.error = errorMessage
        this.isLoading = false
        createNoticiaForm.value.address = ""
        createNoticiaForm.value.address.focus
        setTimeout(() => {
          this.error = ""
        }, 3000);
      }
    )
  }
}
