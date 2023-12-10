import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Thread } from '../models/thread.model';


const baseUrl = 'http://localhost:8080/thread';
@Injectable({
  providedIn: 'root'
})
export class ThreadService {

  constructor(private http: HttpClient) { }

  getAll(search: object): Observable<any> {
    return this.http.post(`${baseUrl}/allThreads`, search);
  }

  get(threadID: any): Observable<Thread> {
    return this.http.get(`${baseUrl}/singleThread/${threadID}`);
  }

  getAllThreadNames(): Observable<any> {
    return this.http.get(`${baseUrl}/allThreadNames`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/addThread`, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/editThread`, data);
  }

  delete(threadID: any): Observable<any> {
    return this.http.delete(`${baseUrl}/deleteThread/${threadID}`);
  }
}
