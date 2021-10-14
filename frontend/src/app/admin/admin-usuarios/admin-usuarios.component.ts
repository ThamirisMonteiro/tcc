import { Component, OnInit } from '@angular/core';
import {User} from "../../models/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {UsuariosService} from "./usuarios.service";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../authentication/auth.service";

@Component({
  selector: 'app-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent implements OnInit {
  users: User[] | undefined
  user: User | undefined
  success: string = ""
  isSuccess: boolean = false

  isOnConfirmScreen: boolean = false

  constructor(private router: Router, private userService: UsuariosService, private http: HttpClient, private authService: AuthService, private _route: ActivatedRoute ) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.userService.findAll(userData._token).subscribe((data) => {
      this.users = data;
    })
    if (this.router.getCurrentNavigation() != null) {
      this.isSuccess = this.router.getCurrentNavigation()?.extras?.state?.isSuccess
      if (this.isSuccess) {
        this.success = "Usuário cadastrado com sucesso!"
      }
      setTimeout(() => {
        this.isSuccess = false
      }, 3000);
    }
    }

  ngOnInit(): void {
  }

  onCheckboxClick(index: number) {
   this.isOnConfirmScreen = true
    // @ts-ignore
    this.user = this.users[index]
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.user.active = !this.user.active

    this.userService.update(this.user, userData._token).subscribe((data) => {
  })
}

  onClickEditar(email: string) {
    this.router.navigate(["editar-usuario"], {state: {email: email}})
  }
}
