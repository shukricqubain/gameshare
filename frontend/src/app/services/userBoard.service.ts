import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserBoard } from '../models/userBoard.model';


const baseUrl = 'http://localhost:8080/userBoard';
@Injectable({
  providedIn: 'root'
})
export class UserBoardService {

  constructor(private http: HttpClient) { }

  getAll(search: object): Observable<any> {
    return this.http.post(`${baseUrl}/allUserBoards`, search);
  }

  get(userBoardID: any): Observable<UserBoard> {
    return this.http.get(`${baseUrl}/singleUserBoard/${userBoardID}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/addUserBoard`, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/editUserBoard`, data);
  }

  delete(userBoardID: any): Observable<any> {
    return this.http.delete(`${baseUrl}/deleteUserBoard/${userBoardID}`);
  }
}
