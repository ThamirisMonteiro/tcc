import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {repeat} from "rxjs/operators";
import {AuthService} from "../authentication/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.css']
})
export class ChangePasswordComponent {
  isLoading = false
  error: string = ""

  constructor(private authService: AuthService, private router: Router) {
  }

  onSubmit(changeForm: NgForm) {
    if (!changeForm.valid) {
      return
    }
    const email = changeForm.value.email
    const oldPassword = changeForm.value.oldPassword
    const newPassword = changeForm.value.newPassword
    const repeatNewPassword = changeForm.value.repeatNewPassword

    if (newPassword != repeatNewPassword) {
      this.error = "A nova senha e a repetição são diferentes"
      return
    }
    if (oldPassword == newPassword) {
      this.error = "A nova senha não pode ser igual à senha antiga"
      return
    }

    this.isLoading = true

    this.authService.changePassword(email, oldPassword, newPassword).subscribe(
      resData => {
        this.isLoading = false
        this.authService.logout()
        this.router.navigate(['login'], {state: {isChange: 'true'}})
      }
      , errorMessage => {
        this.error = errorMessage
        this.isLoading = false
        setTimeout(() => {
          this.error = ""
        }, 3000);
        changeForm.reset()
      })
  }
}
