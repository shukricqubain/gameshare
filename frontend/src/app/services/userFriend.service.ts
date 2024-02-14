import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserFriend } from '../models/userFriend.model';

const baseUrl = 'http://localhost:8080/userFriend';
@Injectable({
  providedIn: 'root'
})
export class UserFriendService {

  constructor(private http: HttpClient) { }

  getAll(search: object): Observable<any> {
    return this.http.post(`${baseUrl}/allUserFriends`, search);
  }

  get(userFriendID: any): Observable<UserFriend> {
    return this.http.get(`${baseUrl}/singleUserFriend/${userFriendID}`);
  }

  getAllByUserID(userID: any): Observable<any> {
    return this.http.get(`${baseUrl}/getAllByUserID/${userID}`);
  }

  getByUserSentAndUserReceivedIDs(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/getByUserSentAndUserReceivedIDs`, data);
  }

  getMutualFriends(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/getMutualFriends`, data);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/addUserFriend`, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/editUserFriend`, data);
  }

  delete(userFriendID: any): Observable<any> {
    return this.http.delete(`${baseUrl}/deleteUserFriend/${userFriendID}`);
  }

}
