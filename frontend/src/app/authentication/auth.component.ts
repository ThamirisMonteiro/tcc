import {Component} from "@angular/core";
import {NgForm} from "@angular/forms";
import {HttpClient} from "@angular/common/http";
import {Router} from "@angular/router";
import {AuthService} from "./auth.service";
import {ActivatedRoute} from '@angular/router';

@Component({
  selector: 'app-auth',
  templateUrl: 'auth.component.html',
  styleUrls: ['auth.component.css']
})
export class AuthComponent {
  isLoading = false
  token = ""
  error: string = ""
  isReset = false;
  isChange = false;
  success: string = "";

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private _route: ActivatedRoute) {
      if (this.router.getCurrentNavigation() != null) {
        this.isReset = this.router.getCurrentNavigation()?.extras?.state?.isReset
        this.isChange = this.router.getCurrentNavigation()?.extras?.state?.isChange
        if (this.isReset) {
          this.success = "Sua nova senha foi enviada para o seu e-mail com sucesso!"
        }
        if (this.isChange) {
          this.success = "Senha alterada com sucesso, favor realizar login novamente"
        }
        setTimeout(() => {
          this.isReset = false
          this.isChange = false
        }, 3000);
      }
    }

  onSubmit(form: NgForm) {
    if (!form.valid) {
      return
    }
    const email = form.value.email
    const password = form.value.password

    this.isLoading = true

    this.authService.login(email, password).subscribe(
      resData => {
        this.token = resData.token
        this.isLoading = false
        this.router.navigate(['home'])
      }
      , errorMessage => {
        this.error = errorMessage
        this.isLoading = false
        setTimeout(() => {
          this.error = ""
        }, 3000);
        form.reset()
      })
  }
}
