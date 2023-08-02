import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
    providedIn: 'root'
}) 
export class UsernameService {

    private usernameObs$: BehaviorSubject<any> = new BehaviorSubject(null);

    getUsernameObs(): Observable<string> {
        return this.usernameObs$.asObservable();
    }

    setUsernameObs(username: string) {
        this.usernameObs$.next(username);
    }
}