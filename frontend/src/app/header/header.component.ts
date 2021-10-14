import {Component, Output, EventEmitter, OnInit} from '@angular/core';
import {AuthService} from "../authentication/auth.service";
import {Subscription} from "rxjs";
import {Router} from "@angular/router";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit{
  isAuthenticated = false;
  isAdmin = false;
  private userSub: Subscription | undefined

  constructor(
    private authService: AuthService, private router: Router
  ) {
  }

  ngOnInit(): void {
    this.userSub = this.authService.user.subscribe(user => {
      this.isAuthenticated = !!user
      if (this.isAuthenticated) {
        if (user.role == "Admin") {
          this.isAdmin = true
        }
      }
    })
  }

  ngOnDestroy(): void {
    // @ts-ignore
    this.userSub.unsubscribe()
  }

  onLogout() {
    this.authService.logout()
  }
}
