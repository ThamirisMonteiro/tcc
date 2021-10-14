import {Injectable} from "@angular/core";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {catchError, tap} from "rxjs/operators";
import {Subject, throwError} from "rxjs";
import {User} from "../models/user.model";
import {Router} from "@angular/router";

interface AuthResponseData {
    job_title: string;
    cpf: string;
    gender: string;
    admission_date: string;
    date_of_birth: string;
    email: string
    name: string
    surname: string
    sector: string
    active: boolean
    id: string
    role: string
    token: string
}

interface ChangePasswordData {
    email: string
    oldPassword: string
    newPassword: string
}

@Injectable({providedIn: 'root'})
export class AuthService {
    loginUrl = "http://localhost:8080/api/public/login"
    signUpURL = "http://localhost:8080/api/public/signup"
    resetPasswordUrl = "http://localhost:8080/api/public/resetpassword"
    changePasswordUrl = "http://localhost:8080/api/protected/changepassword";
    user = new Subject<User>()


    constructor(private http: HttpClient, private router: Router) {
    }

    autoLogin() {
        const userData: {
          job_title: string;
          cpf: string;
          gender: string;
          admission_date: string;
          date_of_birth: string;
          email: string
          name: string
          surname: string
          sector: string
          active: boolean
          id: string
          role: string
          _token: string
        } = JSON.parse(<string>localStorage.getItem('userData'))
        if (!userData) {
            return
        }
        const loadedUser = new User(userData.email, userData.id, userData.name, userData.surname, userData.sector, userData.active, userData.date_of_birth, userData.admission_date, userData.gender, userData.cpf, userData.job_title, userData.role, userData._token)
        this.user.next(loadedUser)
    }

    logout() {
        // @ts-ignore
        this.user.next(null)
        this.router.navigate(['/login'])
        localStorage.removeItem('userData')
    }

    login(email: string, password: string) {
        return this.http.post<AuthResponseData>(this.loginUrl, {email: email, password: password})
            .pipe(catchError(errorRes => {
                let errorMessage = 'Ocorreu um erro desconhecido!'
                if (!errorRes.error || !errorRes.error.msg) {
                    return throwError(errorMessage)
                }
                switch (errorRes.error.msg) {
                    case "invalid admin-usuarios credentials":
                        errorMessage = "Usuário ou senha inválidos."
                        break;
                }
                return throwError(errorMessage)
            }), tap(resData => {
                const user = new User(resData.email, resData.id, resData.name,  resData.surname, resData.sector, resData.active, resData.date_of_birth, resData.admission_date, resData.gender, resData.cpf, resData.job_title, resData.role, resData.token)
                this.user.next(user)
                localStorage.setItem('userData', JSON.stringify(user))
            }))
    }

    resetPassword(email: string) {
        return this.http.post<string>(this.resetPasswordUrl, {email: email})
            .pipe(catchError(errorRes => {
                let errorMessage = 'An unknown error occurred!'
                if (!errorRes.error || !errorRes.error.msg) {
                    return throwError(errorMessage)
                }
                switch (errorRes.error.msg) {
                    case "invalid admin-usuarios credentials":
                        errorMessage = "E-mail inválido."
                        break;
                }
                return throwError(errorMessage)
            }))
    }
    changePassword(email: string, oldPassword: string, newPassword: string) {
        const userData: {
            email: string
            name: string
            id: string
            role: string
            _token: string
        } = JSON.parse(<string>localStorage.getItem('userData'))
        const httpOptions = {
            headers: new HttpHeaders().set("Authorization", "Bearer " + userData._token)
        };
        return this.http.post<ChangePasswordData>(this.changePasswordUrl, {
            email: email, old_password: oldPassword, new_password: newPassword
        }, httpOptions)
            .pipe(catchError(errorRes => {
                let errorMessage = 'An unknown error occurred!'
                if (!errorRes.error || !errorRes.error.msg) {
                    return throwError(errorMessage)
                }
                switch (errorRes.error.msg) {
                    case "invalid admin-usuarios credentials":
                        errorMessage = "E-mail ou senha antiga inválidos."
                        break;
                }
                return throwError(errorMessage)
            }))
    }

    signUp(role: string, gender: string, surname: string, date_of_birth: string, admission_date: string, name: string, cpf: string, active: boolean, sector: string, job_title: string, email: string) {
    return this.http.post(this.signUpURL, {role: role, gender: gender, surname: surname, date_of_birth: date_of_birth, admission_date: admission_date, name: name, cpf: cpf, active: active, sector: sector, job_title: job_title, email: email})
      .pipe(catchError(errorResponse => {
        let errorMessage = 'Ocorreu um erro desconhecido!'
        if (!errorResponse.error || !errorResponse.error.msg) {
          return throwError(errorMessage)
        }
        switch (errorResponse.error.msg) {
          case "invalid user credentials":
            errorMessage = "Usuário ou senha inválidos."
            break;
          case "invalid cpf":
            errorMessage = "CPF inválido."
            break;
          case "user is already registered":
            errorMessage = "E-mail já cadastrado."
            break;
        }
        return throwError(errorMessage)
      }))
  }
}
