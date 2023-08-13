import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
    providedIn: 'root'
}) 
export class RoleService {

    private roleObs$: BehaviorSubject<any> = new BehaviorSubject(null);

    getRoleObs(): Observable<string> {
        return this.roleObs$.asObservable();
    }

    setRoleObs(role: string) {
        this.roleObs$.next(role);
    }
}