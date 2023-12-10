import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Thread } from '../models/thread.model';


const baseUrl = 'http://localhost:8080/userThread';
@Injectable({
  providedIn: 'root'
})
export class UserThreadService {

  constructor(private http: HttpClient) { }

  getAll(search: object): Observable<any> {
    return this.http.post(`${baseUrl}/allUserThreads`, search);
  }

  get(userThreadID: any): Observable<Thread> {
    return this.http.get(`${baseUrl}/singleUserThread/${userThreadID}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/addUserThread`, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/editUserThread`, data);
  }

  delete(userThreadID: any): Observable<any> {
    return this.http.delete(`${baseUrl}/deleteUserThread/${userThreadID}`);
  }
}
