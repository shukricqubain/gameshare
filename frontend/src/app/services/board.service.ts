import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Board } from '../models/board.model';


const baseUrl = 'http://localhost:8080/board';
@Injectable({
  providedIn: 'root'
})
export class BoardService {

  constructor(private http: HttpClient) { }

  getAll(search: object): Observable<any> {
    return this.http.post(`${baseUrl}/allBoards`, search);
  }

  getAllBoardNames(): Observable<any> {
    return this.http.get(`${baseUrl}/allBoardNames`);
  }

  get(boardID: any): Observable<Board> {
    return this.http.get(`${baseUrl}/singleBoard/${boardID}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/addBoard`, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/editBoard`, data);
  }

  delete(boardID: any): Observable<any> {
    return this.http.delete(`${baseUrl}/deleteBoard/${boardID}`);
  }
}
