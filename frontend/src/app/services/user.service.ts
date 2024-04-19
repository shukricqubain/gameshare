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

  getAll(search: object): Observable<any> {
    return this.http.post(`${baseUrl}/AllUsers`, search);
  }

  get(id: any): Observable<User> {
    return this.http.get(`${baseUrl}/singleUser/${id}`);
  }

  getAllUserNames(): Observable<any> {
    return this.http.get(`${baseUrl}/getAllUserNames`);
  }

  getUserByName(userName: string): Observable<User>{
    return this.http.get(`${baseUrl}/singleUserByName/${userName}`);
  }

  checkUserExists(userName: string): Observable<User>{
    return this.http.get(`${baseUrl}/checkUserExists/${userName}`);
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
    return this.http.delete(`${baseUrl}/deleteUser/${id}`);
  }

  uploadProfilePicture(assetLocation: string, data: any){
    return this.http.post(`${baseUrl}/uploadProfilePicture/${assetLocation}`, data);
  }
}
