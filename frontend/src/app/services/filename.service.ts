import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs/internal/BehaviorSubject";
import { Observable } from "rxjs/internal/Observable";

@Injectable({
    providedIn: 'root'
}) 
export class FileNameService {

    private filenameObs$: BehaviorSubject<any> = new BehaviorSubject(null);

    getFileNameObs(): Observable<string> {
        return this.filenameObs$.asObservable();
    }

    setFileNameObs(filename: string) {
        this.filenameObs$.next(filename);
    }
}