import { Component, OnInit } from '@angular/core';
import { Router} from "@angular/router";
import {NgForm} from "@angular/forms";
import {User} from "../../../models/user.model";
import {UsuariosService} from "../usuarios.service";
import {AuthService} from "../../../authentication/auth.service";

@Component({
  selector: 'app-editar-usuario',
  templateUrl: './editar-usuario.component.html',
  styleUrls: ['./editar-usuario.component.css']
})
export class EditarUsuarioComponent implements OnInit {
  isLoading = false
  error: string = ""
  user?: User
  email: string

  constructor(private router: Router, private userService: UsuariosService, private authService: AuthService) {
    this.email = this.router.getCurrentNavigation()?.extras?.state?.email
    if (this.email == undefined) {
      this.router.navigate(["admin-usuarios"])
    }
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.userService.findUserByEmail(userData._token, this.email).subscribe((data: User | undefined) => {
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
