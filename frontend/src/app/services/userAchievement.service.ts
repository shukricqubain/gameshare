import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game.model';

const baseUrl = 'http://localhost:8080/userAchievement';
@Injectable({
  providedIn: 'root'
})
export class UserAchievementService {

  constructor(private http: HttpClient) { }

  getAll(search: object): Observable<any> {
    return this.http.post(`${baseUrl}/allUserAchievements`, search);
  }

  get(userAchievementID: any): Observable<Game> {
    return this.http.get(`${baseUrl}/singleUserAchievement/${userAchievementID}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/addUserAchievement`, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/editUserAchievement`, data);
  }

  delete(userAchievementID: any): Observable<any> {
    return this.http.delete(`${baseUrl}/deleteUserAchievement/${userAchievementID}`);
  }
}
