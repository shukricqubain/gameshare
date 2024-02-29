import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserMessage } from '../models/userMessage.model';

const baseUrl = 'http://localhost:8080/userMessage';
@Injectable({
  providedIn: 'root'
})
export class UserMessageService {

  constructor(private http: HttpClient) { }

  getAll(search: object): Observable<any> {
    return this.http.post(`${baseUrl}/allUserMessages`, search);
  }

  getAllByUserID(userID: any): Observable<any> {
    return this.http.get(`${baseUrl}/getAllMessagesByUserID/${userID}`);
  }

  getAllByUserChatID(userChatID: number): Observable<any>{
    return this.http.get(`${baseUrl}/getAllByUserChatID/${userChatID}`);
  };

  getByUserSentAndUserReceivedIDs(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/getByUserMessagesSentReceivedIDs`, data);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/addUserMessage`, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/editUserMessage`, data);
  }

  delete(userMessageID: any): Observable<any> {
    return this.http.delete(`${baseUrl}/deleteUserMessage/${userMessageID}`);
  }

}
