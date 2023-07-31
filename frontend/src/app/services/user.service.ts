import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

const baseUrl = 'http://localhost:8080/user/';
@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getAll(): Observable<User[]> {
    return this.http.get<User[]>(`${baseUrl}/AllUsers`);
  }

  get(id: any): Observable<User> {
    return this.http.get(`${baseUrl}/${id}`);
  }

  getUserByName(userName: string): Observable<User>{
    return this.http.get(`${baseUrl}/singleUserByName/${userName}`);
  }

  login(data:any): Observable<any>{
    return this.http.post(`${baseUrl}/loginUser`, data);
  }

  checkLoggedIn(data: any): Observable<any>{
    return this.http.post(`${baseUrl}/checkUserIsLoggedIn`, data);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/signupUser`, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/editUser`, data);
  }

  delete(id: any): Observable<any> {
    return this.http.delete(`${baseUrl}/${id}`);
  }

  deleteAll(): Observable<any> {
    return this.http.delete(baseUrl);
  }

  findByProp(property: any): Observable<User[]> {
    return this.http.get<User[]>(`${baseUrl}?property=${property}`);
  }
}
