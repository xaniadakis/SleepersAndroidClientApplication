import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {AuthenticationService} from './auth.service';
import {SharedService} from "../../service/shared.service";

@Injectable()
export class GuardService implements CanActivate {
  constructor(public authenticationService: AuthenticationService, public router: Router, private sharedService: SharedService) {
  }

  canActivate(): Promise<boolean> | boolean {
    const isAuth = this.authenticationService.isAuthenticated();
    console.log("isauthenticated = ", isAuth)
    // return isAuth ? true :  this.router.navigate(['/']);
    if (!isAuth) {
      alert("First things first, go ahead and sign yoself in.")
      console.log("You are not authenticated to view this page.")
      this.sharedService.fire(false);
      localStorage.clear()
      this.router.navigateByUrl('/welcome');
    }
    return isAuth;
  }
}
