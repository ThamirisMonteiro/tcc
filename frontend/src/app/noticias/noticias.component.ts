import { Component, OnInit } from '@angular/core';
import {Noticia} from "../models/noticia.model";
import {ActivatedRoute, Router} from "@angular/router";
import {NoticiasService} from "../admin/admin-noticias/noticias.service";
import {relativeFrom} from "@angular/compiler-cli/src/ngtsc/file_system";

@Component({
  selector: 'app-noticias',
  templateUrl: './noticias.component.html',
  styleUrls: ['./noticias.component.css']
})
export class NoticiasComponent implements OnInit {
  noticias?: Noticia[]

  constructor(private router: Router, private noticiaService: NoticiasService, private _route: ActivatedRoute ) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.noticiaService.findAll(userData._token).subscribe((data) => {
      this.noticias = data;
    })
  }


  ngOnInit(): void {
  }

  onClickNoticia(category: string, address: string) {
    this.router.navigate(['/noticias/' + category.toLowerCase() + '/' + address.toLowerCase()]).then()
  }
}
