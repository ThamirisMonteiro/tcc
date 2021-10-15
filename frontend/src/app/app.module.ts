import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { AuthComponent } from './authentication/auth.component';
import { HomeComponent } from './home/home.component';
import { DropdownDirective } from './shared/dropdown.directive';
import { FooterComponent } from './footer/footer.component';
import {FormsModule} from "@angular/forms";
import {LoadingSpinnerComponent} from "./shared/loading-spinner/loading-spinner.component";
import {HttpClientModule} from "@angular/common/http";
import {RouterModule} from "@angular/router";
import { AdminComponent } from './admin/admin.component';
import { ChangePasswordComponent } from './change-password/change-password.component';
import { ResetPasswordComponent } from './reset-password/reset-password.component';
import { AdminNoticiasComponent } from './admin/admin-noticias/admin-noticias.component';
import { ServicosComponent } from './servicos/servicos.component';
import { InformacoesComponent } from './info/informacoes.component';
import { GaleriasComponent } from './galerias/galerias.component';
import { MeusDadosComponent } from './meus-dados/meus-dados.component';
import { AdminUsuariosComponent } from './admin/admin-usuarios/admin-usuarios.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FilterPipe } from './shared/filter.pipe';
import { CriarUsuarioComponent } from './admin/admin-usuarios/criar-usuario/criar-usuario.component';
import { EditarUsuarioComponent } from './admin/admin-usuarios/editar-usuario/editar-usuario.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { CriarNoticiaComponent } from './admin/admin-noticias/criar-noticia/criar-noticia.component';
import { EditarNoticiaComponent } from './admin/admin-noticias/editar-noticia/editar-noticia.component';
import { NoticiasComponent } from './noticias/noticias.component';
import { NoticiaComponent } from './noticias/noticia/noticia.component';
import {AdminGaleriasComponent} from "./admin/admin-galerias/admin-galerias.component";
import { CriarGaleriaComponent } from './admin/admin-galerias/criar-galeria/criar-galeria.component';
import { EditarGaleriaComponent } from './admin/admin-galerias/editar-galeria/editar-galeria.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    AuthComponent,
    HomeComponent,
    DropdownDirective,
    FooterComponent,
    LoadingSpinnerComponent,
    AdminComponent,
    ChangePasswordComponent,
    ResetPasswordComponent,
    AdminNoticiasComponent,
    ServicosComponent,
    InformacoesComponent,
    GaleriasComponent,
    MeusDadosComponent,
    AdminUsuariosComponent,
    FilterPipe,
    CriarUsuarioComponent,
    EditarUsuarioComponent,
    CriarNoticiaComponent,
    EditarNoticiaComponent,
    NoticiasComponent,
    NoticiaComponent,
    AdminGaleriasComponent,
    CriarGaleriaComponent,
    EditarGaleriaComponent
  ],
    imports: [
      BrowserModule,
      RouterModule,
      AppRoutingModule,
      FormsModule,
      HttpClientModule,
      BrowserAnimationsModule,
      NgbModule
    ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }