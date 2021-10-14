import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Noticia} from "../../models/noticia.model";
import {NoticiasService} from "../../admin/admin-noticias/noticias.service";

@Component({
  selector: 'app-noticia',
  templateUrl: './noticia.component.html',
  styleUrls: ['./noticia.component.css']
})

export class NoticiaComponent implements OnInit {
  category?: string;
  address?: string;
  noticia: Noticia = new Noticia('', '', '', '', '', '', '' , false)

  ngOnInit(): void {
  }

  constructor(private router: Router, private noticiaService: NoticiasService) {
    if (this.router.getCurrentNavigation() != null) {
      this.category = this.router.getCurrentNavigation()?.extractedUrl.root.children.primary.segments[1].path
      this.address = this.router.getCurrentNavigation()?.extractedUrl.root.children.primary.segments[2].path
      const userData = JSON.parse(<string>localStorage.getItem('userData'))
      this.noticiaService.findNoticiaByAddress(userData._token, <String>this.address).subscribe((data) => {
        this.noticia = data;})
    } else {
      this.router.navigate(['/noticias']).then()
    }
  }
}
