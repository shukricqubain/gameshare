import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

const baseUrl = 'http://localhost:8080/userChat';
@Injectable({
  providedIn: 'root'
})
export class UserChatService {

  constructor(private http: HttpClient) { }

  getAll(search: object): Observable<any> {
    return this.http.post(`${baseUrl}/allUserChats`, search);
  }

  getUserChatsByIDs(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/getUserChatsByIDs`, data);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/addUserChat`, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/editUserChat`, data);
  }

  delete(userChatID: any): Observable<any> {
    return this.http.delete(`${baseUrl}/deleteUserChat/${userChatID}`);
  }

}
