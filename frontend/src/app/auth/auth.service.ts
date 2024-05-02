import { Injectable } from '@angular/core';

@Injectable()
export class AuthService {

    public getAuthorizationToken(): string {
        let token = localStorage.getItem('token');
        if(token && typeof token === 'string'){
            return token;
        } else {
            return '';
        }
    }
}