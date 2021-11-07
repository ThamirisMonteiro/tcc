import { Component, OnInit } from '@angular/core';
import {Noticia} from "../../models/noticia.model";
import {ActivatedRoute, Router} from "@angular/router";
import {NoticiasService} from "../../admin/admin-noticias/noticias.service";

@Component({
  selector: 'app-widget-noticias',
  templateUrl: './widget-noticias.component.html',
  styleUrls: ['./widget-noticias.component.css']
})
export class WidgetNoticiasComponent implements OnInit {
  noticias?: Noticia[]

  constructor(private router: Router, private noticiaService: NoticiasService, private _route: ActivatedRoute ) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.noticiaService.findAll(userData._token).subscribe((data) => {
      this.noticias = [data[0], data[1]]
    })
  }


  ngOnInit(): void {
  }

  onClickNoticia(category: string, address: string) {
    this.router.navigate(['/noticias/' + category.toLowerCase() + '/' + address.toLowerCase()]).then()
  }

}
