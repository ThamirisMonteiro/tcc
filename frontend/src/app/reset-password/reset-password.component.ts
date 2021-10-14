import {Component, OnInit} from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../authentication/auth.service";
import {Router} from "@angular/router";

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
  isLoading = false
  error: string = ""

  constructor(private authService: AuthService, private router: Router) {
  }

  ngOnInit(): void {
  }

  onSubmit(resetForm: NgForm) {
    if (!resetForm.valid) {
      return
    }
    const email = resetForm.value.email

    this.isLoading = true

    this.authService.resetPassword(email).subscribe(
      resData => {
        this.isLoading = false
        this.router.navigate(['login'], {state: {isSuccess: 'true'}})
      }
      , errorMessage => {
        this.error = errorMessage
        this.isLoading = false
        setTimeout(() => {
          this.error = ""
        }, 3000);
        resetForm.reset()
      })
  }
}
