import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {AuthComponent} from "./authentication/auth.component";
import {HomeComponent} from "./home/home.component";
import {AdminComponent} from "./admin/admin.component";
import {ChangePasswordComponent} from "./change-password/change-password.component";
import {ResetPasswordComponent} from "./reset-password/reset-password.component";
import {AdminNoticiasComponent} from "./admin/admin-noticias/admin-noticias.component";
import {MeusDadosComponent} from "./meus-dados/meus-dados.component";
import {GaleriasComponent} from "./galerias/galerias.component";
import {InformacoesComponent} from "./info/informacoes.component";
import {ServicosComponent} from "./servicos/servicos.component";
import {AdminUsuariosComponent} from "./admin/admin-usuarios/admin-usuarios.component";
import {CriarUsuarioComponent} from "./admin/admin-usuarios/criar-usuario/criar-usuario.component";
import {EditarUsuarioComponent} from "./admin/admin-usuarios/editar-usuario/editar-usuario.component";
import {CriarNoticiaComponent} from "./admin/admin-noticias/criar-noticia/criar-noticia.component";
import {EditarNoticiaComponent} from "./admin/admin-noticias/editar-noticia/editar-noticia.component";
import {NoticiasComponent} from "./noticias/noticias.component";
import {NoticiaComponent} from "./noticias/noticia/noticia.component";
import {AdminGaleriasComponent} from "./admin/admin-galerias/admin-galerias.component";
import {CriarGaleriaComponent} from "./admin/admin-galerias/criar-galeria/criar-galeria.component";
import {EditarGaleriaComponent} from "./admin/admin-galerias/editar-galeria/editar-galeria.component";
import {GaleriaComponent} from "./galerias/galeria/galeria.component";

const appRoutes: Routes = [
  // auth
  {path: 'login', component: AuthComponent},
  {path: 'reset-password', component: ResetPasswordComponent},
  {path: 'change-password', component: ChangePasswordComponent},

  // admin
  {path: 'admin', component: AdminComponent},
  {path: 'admin-noticias', component: AdminNoticiasComponent},
  {path: 'admin-usuarios', component: AdminUsuariosComponent},
  {path: 'admin-servicos', component: ServicosComponent},
  {path: 'admin-galerias', component: AdminGaleriasComponent},

  // cadastrar
  {path: 'criar-usuario', component: CriarUsuarioComponent},
  {path: 'criar-galeria', component: CriarGaleriaComponent},
  {path: 'criar-noticia', component: CriarNoticiaComponent},

  // editar
  {path: 'editar-usuario', component: EditarUsuarioComponent},
  {path: 'editar-galeria', component: EditarGaleriaComponent},
  {path: 'editar-noticia', component: EditarNoticiaComponent},

  // main pages
  {path: 'home', component: HomeComponent},
  {path: 'info', component: InformacoesComponent},
  {path: 'noticias', component: NoticiasComponent},
  {path: 'galerias', component: GaleriasComponent},
  {path: 'meus-dados', component: MeusDadosComponent},
  {path: 'noticias/:categoria/:address', component: NoticiaComponent},
  {path: 'galerias/:name', component: GaleriaComponent},

  {path: '', redirectTo: 'login', pathMatch: 'full'},
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}

