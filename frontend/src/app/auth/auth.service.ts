import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

    public getAuthorizationToken(): string {
        let token = localStorage.getItem('token');
        console.log('getting token')
        console.log(token)
        if(token && typeof token === 'string'){
            return token;
        } else {
            return '';
        }
    }

    public isAuthenticated() {
        const token = this.getAuthorizationToken();
        //return tokenNotExpired(null, token);
    }
}