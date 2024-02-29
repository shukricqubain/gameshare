import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root'
})
export class DateFunctionsService {

    monthMap = new Map([
        ['Jan', 1],
        ['Feb', 2],
        ['Mar', 3],
        ['Apr', 4],
        ['May', 5],
        ['Jun', 6],
        ['Jul', 7],
        ['Aug', 8],
        ['Sep', 9],
        ['Oct', 10],
        ['Nov', 11],
        ['Dec', 12]
    ]);

    public convertDateEDT(date: string){
        if(date !== undefined){
            let dateUTC = new Date(date);
            return dateUTC;
        } else {
            return 'null or undefined date.';
        }
    }

    public formatDateMMDDYYYY(date: string){
        let edtDate = `${this.convertDateEDT(date)}`;
        let dateArray = edtDate.split(' ');
        let getMonth = this.monthMap.get(`${dateArray[1]}`);
        let dateString = `${getMonth}/${dateArray[2]}/${dateArray[3]}`;
        return dateString;
    }

    public formatDateTimeAndDate(date: string){
        let edtDate = `${this.convertDateEDT(date)}`;
        console.log(edtDate)
        let dateArray = edtDate.split(' ');
        let getMonth = this.monthMap.get(`${dateArray[1]}`);
        let getHour = Number(dateArray[4].split(':')[0]);
        let getMinute = dateArray[4].split(':')[1];
        let timestamp;
        if(getHour > 12){
            getHour -= 12;
            timestamp = `${getHour}:${getMinute} PM`;
        } else {
            timestamp = `${getHour}:${getMinute} AM`;
        }
        let dateString = `${timestamp} ${getMonth}/${dateArray[2]}/${dateArray[3]}`;
        return dateString;
    }
}