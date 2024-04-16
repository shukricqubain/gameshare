import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game.model';

const baseUrl = 'http://localhost:8080/achievement';
@Injectable({
  providedIn: 'root'
})
export class AchievementService {

  constructor(private http: HttpClient) { }

  getAll(search: object): Observable<any> {
    return this.http.post(`${baseUrl}/allAchievements`, search);
  }

  getAllBasedOnIDList(achievementIDList: string): Observable<any>{
    return this.http.get(`${baseUrl}/getAllBasedOnIDList/${achievementIDList}`);
  }

  getAllAchievementsNames(): Observable<any> {
    return this.http.get(`${baseUrl}/allAchievementNames`);
  }

  get(achievementID: any): Observable<Game> {
    return this.http.get(`${baseUrl}/singleAchievement/${achievementID}`);
  }

  getByGameID(gameID: any): Observable<any> {
    return this.http.get(`${baseUrl}/achievementsByGameID/${gameID}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/addAchievement`, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/editAchievement`, data);
  }

  delete(achievementID: any): Observable<any> {
    return this.http.delete(`${baseUrl}/deleteAchievement/${achievementID}`);
  }

  uploadAchievementIcon(assetLocation: string, data: any){
    return this.http.post(`${baseUrl}/uploadAchievementIcon/${assetLocation}`, data);
  }
}
