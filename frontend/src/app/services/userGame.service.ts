import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game.model';

const baseUrl = 'http://localhost:8080/userGame';
@Injectable({
  providedIn: 'root'
})
export class UserGameService {

  constructor(private http: HttpClient) { }

  getAll(search: object): Observable<any> {
    return this.http.post(`${baseUrl}/allUserGames`, search);
  }

  get(userGameID: any): Observable<Game> {
    return this.http.get(`${baseUrl}/singleUserGame/${userGameID}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/addUserGame`, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/editUserGame`, data);
  }

  delete(userGameID: any): Observable<any> {
    return this.http.delete(`${baseUrl}/deleteUserGame/${userGameID}`);
  }
}
