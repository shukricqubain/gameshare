import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ThreadItem } from '../models/threadItem.model';


const baseUrl = 'http://localhost:8080/threadItem';
@Injectable({
  providedIn: 'root'
})
export class ThreadItemService {

  constructor(private http: HttpClient) { }

  getAll(search: object): Observable<any> {
    return this.http.post(`${baseUrl}/allThreadItems`, search);
  }

  get(threadItemID: any): Observable<ThreadItem> {
    return this.http.get(`${baseUrl}/singleThreadItem/${threadItemID}`);
  }

  create(data: any): Observable<any> {
    return this.http.post(`${baseUrl}/addThreadItem`, data);
  }

  update(data: any): Observable<any> {
    return this.http.put(`${baseUrl}/editThreadItem`, data);
  }

  delete(threadItemID: any): Observable<any> {
    return this.http.delete(`${baseUrl}/deleteThreadItem/${threadItemID}`);
  }
}
