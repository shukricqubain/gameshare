import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
    providedIn: 'root'
}) 
export class ProfilePictureService {

    private profilePictureObs$: BehaviorSubject<any> = new BehaviorSubject(null);

    getProfilePictureObs(): Observable<string> {
        return this.profilePictureObs$.asObservable();
    }

    setProfilePictureObs(profilePictureFileName: string) {
        this.profilePictureObs$.next(profilePictureFileName);
    }
}