import { Component, OnInit } from '@angular/core';
import { Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {User} from "../../../models/user.model";
import {UsuariosService} from "../usuarios.service";
import {JobsService} from "../../../shared/jobs.service";
import {SectorsService} from "../../../shared/sectors.service";

interface Job {
  id: String,
  name: String
}

interface Sector {
  id: String,
  name: String
}

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {
  isLoading = false
  user: User = new User('','','','','',false,'','','','','','','')
  id: string
  jobs: Job[] = []
  sectors: Sector[] = []
  genders: String[] = ["Feminino", "Masculino", "Outro"]

  constructor(private router: Router, private userService: UsuariosService, private jobsService: JobsService,
              private sectorsService: SectorsService) {
    this.id = this.router.getCurrentNavigation()?.extras?.state?.id
    if (this.id == undefined) {
      this.router.navigate(["admin-usuarios"]).then()
    }
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.userService.findUserByID(userData._token, this.id).subscribe((data: any) => {
      this.user = data;
      this.jobsService.findAll(userData._token).subscribe((data: any) => {
        for (const [i, job] of data.entries()) {
          if (job.name == this.user.job_title) {
            data.splice(i, 1);
          }
        }
        this.jobs = data;
      })
      this.sectorsService.findAll(userData._token).subscribe((data: any) => {
        for (const [i, sector] of data.entries()) {
          if (sector.name == this.user.sector) {
            data.splice(i, 1);
          }
        }
        this.sectors = data;
      })
      let index = this.genders.indexOf(this.user.gender)
      this.genders.splice(index, 1)
    })
  }

  ngOnInit(): void {
  }

  onSubmit(editUserForm: NgForm) {
    if (!editUserForm.valid) {
      return
    }
    const date_of_birth = editUserForm.value.data_de_nascimento
    const date_of_admission = editUserForm.value.data_de_admissao

    // if (date_of_birth < this.fourteenYearsOld) {
    //   this.error = "O usuário não pode ter idade menor do que 14 anos."
    //   return
    // }
    // if (date_of_admission > today) {
    //   this.error = "A data de admissão não pode ser maior do que hoje."
    //   return
    // }

    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.userService.update(this.user,userData._token).subscribe((data) => {
    })
    this.router.navigate(['admin-usuarios'])
  }
}
