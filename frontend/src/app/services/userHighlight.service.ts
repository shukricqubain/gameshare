import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080/userHighlight';
@Injectable({
  providedIn: 'root'
})
export class UserHighlightService {

    constructor(private http: HttpClient) { }

    getUserHighlights(userID: any): Observable<any> {
        return this.http.get(`${baseUrl}/getUserHighlights/${userID}`);
    }
}
