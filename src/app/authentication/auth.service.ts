import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from "@angular/router";
import { JwtHelperService } from '@auth0/angular-jwt';


@Injectable({
  providedIn: 'root'
})
@Injectable()
export class AuthenticationService {
    private jwtHelper = new JwtHelperService();

    constructor(private http: HttpClient, private router: Router, public jwtHelper: JwtHelperService
      ) {
    }

    isAuthenticated(): boolean{
      const token = sessionStorage.getItem('token');
      return !this.jwtHelper.isTokenExpired(token);
    }
}
