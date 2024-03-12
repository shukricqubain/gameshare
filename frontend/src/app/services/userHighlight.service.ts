import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080/userHighlight';
@Injectable({
  providedIn: 'root'
})
export class UserHighlightService {

    constructor(private http: HttpClient) { }

    getUserGameHighlights(userID: any): Observable<any> {
        return this.http.get(`${baseUrl}/getUserGameHighlights/${userID}`);
    }

    getUserThreadHighlights(userID: any): Observable<any> {
      return this.http.get(`${baseUrl}/getUserThreadHighlights/${userID}`);
    }
}
