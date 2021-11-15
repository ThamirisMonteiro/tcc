import { Component } from '@angular/core';
import {User} from "../../models/user.model";
import {ActivatedRoute, Router} from "@angular/router";
import {UsuariosService} from "./usuarios.service";
import {HttpClient} from "@angular/common/http";
import {AuthService} from "../../authentication/auth.service";
import {InformationDialogService} from "../../shared/information-dialog/information-dialog.service";

@Component({
  selector: 'app-usuarios',
  templateUrl: './admin-usuarios.component.html',
  styleUrls: ['./admin-usuarios.component.css']
})
export class AdminUsuariosComponent {
  users: User[] = []
  user: User = new User('','','','','',false,'','','','','','','',)

  constructor(private confirmationDialogService: InformationDialogService, private router: Router, private userService: UsuariosService, private http: HttpClient, private authService: AuthService, private _route: ActivatedRoute ) {
    const userData = JSON.parse(<string>localStorage.getItem('userData'))
    this.userService.findAll(userData._token).subscribe((data) => {
      this.users = data;
    })
    }

  onCheckboxClick(i: number) {
    this.user = this.users[i]
    let palavra: String
    (this.user.active) ? palavra = "inativado" : palavra = "ativado"
    this.confirmationDialogService.confirm('Sucesso', 'Usuário ' + palavra + ' com sucesso!') .then((confirmed) => {
      const userData = JSON.parse(<string>localStorage.getItem('userData'))
      this.user.active = !this.user.active
      this.userService.update(this.user, userData._token).subscribe(() => {
      })})}

  onClickEditar(email: string) {
    this.router.navigate(["editar-usuario"], {state: {email: email}})
  }
}
