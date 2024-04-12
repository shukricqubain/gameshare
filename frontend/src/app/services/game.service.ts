import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Game } from '../models/game.model';

const baseUrl = 'http://localhost:8080/game';
@Injectable({
  providedIn: 'root'
})
export class GameService {

  constructor(private http: HttpClient) { }

  getAll(search: object): Observable<any> {
    return this.http.post(`${baseUrl}/allGames`, search);
  }

  get(id: any): Observable<Game> {
    return this.http.get(`${baseUrl}/singleGame/${id}`);
  }

  getByName(gameName: string): Observable<Game>{
    return this.http.get(`${baseUrl}/singleGameByName/${gameName}`);
  }

  getAllGameNames(): Observable<any> {
    return this.http.get(`${baseUrl}/allGameNames`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/addGame`, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/editGame`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/deleteGame/${id}`);
  }

  uploadGameCover(assetLocation: string, data: any){
    return this.http.post(`${baseUrl}/uploadGameCover/${assetLocation}`, data);
  }
}
