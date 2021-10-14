import { Component, OnInit } from '@angular/core';
import {NgForm} from "@angular/forms";
import {AuthService} from "../../../authentication/auth.service";
import {Router} from "@angular/router";
import {NgbDateStruct} from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-criar-usuario',
  templateUrl: './criar-usuario.component.html',
  styleUrls: ['./criar-usuario.component.css']
})
export class CriarUsuarioComponent implements OnInit {
  isLoading = false
  error: string = ""
  model: NgbDateStruct | undefined;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  onSubmit(createUserForm: NgForm) {
    if (!createUserForm.valid) {
      return
    }
    const date_of_birth = createUserForm.value.data_de_nascimento
    const date_of_admission = createUserForm.value.data_de_admissao

    // if (date_of_birth < this.fourteenYearsOld) {
    //   this.error = "O usuário não pode ter idade menor do que 14 anos."
    //   return
    // }
    // if (date_of_admission > today) {
    //   this.error = "A data de admissão não pode ser maior do que hoje."
    //   return
    // }

    this.isLoading = true

    this.authService.signUp(
      "User", createUserForm.value.genero, createUserForm.value.sobrenome, createUserForm.value.data_de_nascimento,
      createUserForm.value.data_de_admissao, createUserForm.value.nome, createUserForm.value.cpf, true,
      createUserForm.value.setor, createUserForm.value.cargo, createUserForm.value.email).subscribe(
      res => {
        this.isLoading = false
        this.router.navigate(["admin-usuarios"])
      }
      , errorMessage => {
        this.error = errorMessage
        this.isLoading = false
        createUserForm.value.email = ""
        createUserForm.value.email.focus
        setTimeout(() => {
          this.error = ""
        }, 3000);
      })
  }
  }
