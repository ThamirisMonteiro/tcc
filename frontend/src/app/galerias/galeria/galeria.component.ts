import {Component, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import {Galeria} from "../../models/galeria.model";
import {GaleriasService} from "../../admin/admin-galerias/galerias.service";

@Component({
  selector: 'app-galeria',
  templateUrl: './galeria.component.html',
  styleUrls: ['./galeria.component.css']
})

export class GaleriaComponent implements OnInit {
  category?: string;
  name?: string;
  galeria: Galeria = new Galeria('', '', '', '', '', '', false)

  imgCollection: Array<object> = [
    {
      image: 'https://loremflickr.com/g/600/400/paris',
      thumbImage: 'https://loremflickr.com/g/1200/800/paris',
      alt: 'Image 1',
      title: 'Image 1'
    }, {
      image: 'https://loremflickr.com/600/400/brazil,rio',
      thumbImage: 'https://loremflickr.com/1200/800/brazil,rio',
      title: 'Image 2',
      alt: 'Image 2'
    }, {
      image: 'https://loremflickr.com/600/400/paris,girl/all',
      thumbImage: 'https://loremflickr.com/1200/800/brazil,rio',
      title: 'Image 3',
      alt: 'Image 3'
    }, {
      image: 'https://loremflickr.com/600/400/brazil,rio',
      thumbImage: 'https://loremflickr.com/1200/800/brazil,rio',
      title: 'Image 4',
      alt: 'Image 4'
    }, {
      image: 'https://loremflickr.com/600/400/paris,girl/all',
      thumbImage: 'https://loremflickr.com/1200/800/paris,girl/all',
      title: 'Image 5',
      alt: 'Image 5'
    }, {
      image: 'https://loremflickr.com/600/400/paris,girl/all',
      thumbImage: 'https://loremflickr.com/1200/800/paris,girl/all',
      title: 'Image 6',
      alt: 'Image 6'
    }, {
      image: 'https://loremflickr.com/600/400/paris,girl/all',
      thumbImage: 'https://loremflickr.com/1200/800/paris,girl/all',
      title: 'Image 7',
      alt: 'Image 7'
    }
  ];

  ngOnInit(): void {
  }

  constructor(private router: Router, private galeriasService: GaleriasService) {
    if (this.router.getCurrentNavigation() != null) {
      this.name = this.router.getCurrentNavigation()?.extractedUrl.root.children.primary.segments[1].path
      const userData = JSON.parse(<string>localStorage.getItem('userData'))
      this.galeriasService.findGaleriaByName(userData._token, <String>this.name).subscribe((data) => {
        this.galeria = data;})
    } else {
      this.router.navigate(['/galerias']).then()
    }
  }
}
