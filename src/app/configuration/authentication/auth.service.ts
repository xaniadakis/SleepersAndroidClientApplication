import {Inject, Injectable} from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
@Injectable()
export class AuthenticationService {

    constructor(private http: HttpClient, private router: Router, public jwtHelper: JwtHelperService) {
      this.jwtHelper = new JwtHelperService();
    }

    isAuthenticated(): boolean{
      const token: string | null = sessionStorage.getItem('token');
      if (token!=null) {
        console.log("expiry date: " + this.jwtHelper.getTokenExpirationDate(token));
        return !this.jwtHelper.isTokenExpired(token);
      }
      else
        return false;
    }
}
