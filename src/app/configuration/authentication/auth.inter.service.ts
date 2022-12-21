import {Injectable} from '@angular/core';
import {HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse} from '@angular/common/http';
import {catchError} from "rxjs/operators";
import {throwError} from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class AuthorizationInterceptorService implements HttpInterceptor {

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    console.log("Intercepting " + req.method + " request");
    const jwt = localStorage.getItem('token');
    // res.header("Access-Control-Allow-Origin", "*");
    // res.header("Access-Control-Allow-Methods", "GET,HEAD,OPTIONS,POST,PUT");
    // res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type,
    // Accept, x-client-key, x-client-token, x-client-secret, Authorization");
    req = req.clone({
      headers: req.headers.set('authorization', 'Bearer ' + jwt),
      method: req.method,
      withCredentials: false
    });
    // req = req.clone({ headers: req.headers.set('Content-Type', 'application/json') });
    // req = req.clone({ headers: req.headers.set('Accept', 'application/json') });
    console.log("AuthorizationInterceptorService sent the jwt: ", jwt);
    return next.handle(req)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          if (error && error.status === 401) {
            console.log("401 Invalid Token")
          }
          if (error && error.status === 403) {
            console.log("403 A token is required for authentication")
          }
          console.log(error, error.status)
          const err = error.error.message || error.statusText;
          return throwError(() => err);
        })
      );
  }
}
