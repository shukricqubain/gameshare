import { Injectable } from '@angular/core';
import {
    HttpRequest,
    HttpHandler,
    HttpEvent,
    HttpInterceptor,
    HttpErrorResponse
  } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {

    constructor(
        private auth: AuthService,
        private router: Router,
        private snackBar: MatSnackBar
    ) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // Get the auth token from the service.
        const authToken = this.auth.getAuthorizationToken();

        // Clone the request and replace the original headers with
        // cloned headers, updated with the authorization.
        const authReq = req.clone({
            headers: req.headers.set('Authorization', authToken)
        });

        // send cloned request with header to the next handler.
        return next.handle(authReq).pipe(
            catchError((err: any) => {
              if (err instanceof HttpErrorResponse) {
                // Handle HTTP errors
                if (err.status === 401) {
                  // Specific handling for unauthorized errors  
                  let unauthorizedString = `Unauthorized request:, ${err}`;       
                  console.error('Unauthorized request:', err);
                  // You might trigger a re-authentication flow or redirect the user here
                  this.router.navigate(['/login']);
                  this.snackBar.open(unauthorizedString, 'dismiss', {
                    duration: 3000
                  });
                } else {
                  // Handle other HTTP error codes
                  let httpString = `HTTP error:, ${err.statusText}`;
                  console.error(httpString);
                  this.router.navigate(['/login']);
                  this.snackBar.open(httpString, 'dismiss', {
                    duration: 3000
                  });
                }
              } else {
                // Handle non-HTTP errors
                let errorString = `An error occurred:, ${err}`;
                  console.error(errorString);
                  this.router.navigate(['/login']);
                  this.snackBar.open(errorString, 'dismiss', {
                    duration: 3000
                  });
              }
        
              // Re-throw the error to propagate it further
              return throwError(() => err); 
            })
          );;
    }
}