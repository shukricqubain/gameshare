import { Injectable } from "@angular/core";
import * as dayjs from 'dayjs';
import * as timezone from 'dayjs/plugin/timezone';
import * as utc from 'dayjs/plugin/utc';

@Injectable({
    providedIn: 'root'
}) 
export class DateFunctionsService {

    public formatDate(date: string){
        if(date !== undefined){
            date = dayjs(date).format('MM-DD-YYYY');
            return date;
        } else {
            return 'null or undefined date.';
        }
    }

}