import { Component, OnInit } from '@angular/core';
import {User} from "../models/user.model";
import {Router} from "@angular/router";
import {UsuariosService} from "../admin/admin-usuarios/usuarios.service";
import {AuthService} from "../authentication/auth.service";
import {NgForm} from "@angular/forms";

@Component({
  selector: 'app-meus-dados',
  templateUrl: './meus-dados.component.html',
  styleUrls: ['./meus-dados.component.css']
})
export class MeusDadosComponent implements OnInit {
  isLoading = false
  error: string = ""
  user?: User

  constructor(private router: Router, private userService: UsuariosService, private authService: AuthService) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.userService.findUserByEmail(userData._token, userData.email).subscribe((data: User | undefined) => {
      this.user = data;
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
