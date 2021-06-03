import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Observable, BehaviorSubject, Subject } from 'rxjs'
// import { LoginAuthService } from './login-auth.service';
import * as CryptoJS from 'crypto-js';
import { HttpResponse } from '@angular/common/http';
import { DeviceDetectorService } from 'ngx-device-detector';
import * as moment from 'moment'
@Injectable({
  providedIn: 'root'
})
export class GeneralService {
  public encryptInfo;
  public decryptedInfo;
  public token;
  public mismatch: boolean
  public date1: any
  public date2: any
  public loadingFreez: BehaviorSubject<any> = new BehaviorSubject<any>([])
  public deviceChanges = new Subject<any>();
  public userData = new Subject<any>();
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;

  constructor(
    private _snackBar: MatSnackBar,
    private deviceService: DeviceDetectorService) {
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();
  }

  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
    });
  }

  filterArray(array) {
    array = array.filter((obj) => {
      return obj != 0
    })
    return array
  }

  filterIds(array) {
    let arr = []
    array.filter((obj) => {
      arr.push(
        obj.coinId
      )
    })
    return arr
  }
  setObject(key, obj) {
    localStorage.setItem(key, this.encrypt(obj));
  }

  getObject(key) {
    return this.decrypt(localStorage.getItem(key));
  }

  updateItem(key, property, value) {
    var obj = this.getObject(key);
    obj[property] = value;
    console.log("obj===", obj)

    this.setObject(key, obj);
  }
  encrypt(data: any) {
    this.encryptInfo = CryptoJS.AES.encrypt(JSON.stringify(data), this.getToken()).toString();
    return this.encryptInfo
  }

  decrypt(data: any) {
    var deData = CryptoJS.AES.decrypt(data, this.getToken());
    this.decryptedInfo = JSON.parse(deData.toString(CryptoJS.enc.Utf8));
    return this.decryptedInfo
  }

  getToken() {
    return localStorage.getItem('token')
  }
  public validate(data) {
    console.log(data)
    this.mismatch = true
    const expression = /^[a-zA-Z0-9]+(?: [a-zA-Z0-9]+)*$/;
    var string = expression.test(String(data).toLowerCase());
    if (data) {
      if (data == data.match(string)) {
        this.mismatch = false
      } else {
        this.mismatch = true
      }
    }
  }
  convertTime(a) {
    var timeArr = a.split(':')
    var date = ''
  
    if (timeArr[0] < 24) {
      if (timeArr[0] != '00') {
        date += timeArr[0] + ' hour '
      }
      if (timeArr[1] != '00') {
        date += timeArr[1] + ' minute '
      }
      if (timeArr[2] != '00') {
        date += timeArr[2] + ' second '
      }
      if (date == '' || date == '-') {
        date = '05 second'
      }
    }
    else if (timeArr[0] >= 24) {
      let day = Math.floor(timeArr[0] / 24)
      var rem = timeArr[0] % 24
      var hour = Math.floor(rem)

      if (day != 0) {
     if(day < 31){
      days = day > 1 ? ' days ' : ' day '
      date += day + days
     }
        else if (day > 30 && day < 366) {
          var month = Math.floor(day / 30)
          day = day % 30
          days = day > 1 ? ' days ' : ' day '
          date += day + days
          if (month != 0) {
            var months = month > 1 ? ' months ' : ' month '
            date += month + months
          }
        }
        else if (day > 365) {
          var month = Math.floor(day / 30)
          var months = ''
          var year = ''
          var days = ''
          day = day % 30
          if (day != 0) {
            if (month != 0) {
              if (month > 11) {
                var years = Math.floor(month / 12)
                month = Math.floor(month % 12)
                if (years != 0) {
                  year = years > 1 ? ' years ' : ' year '
                  date += years + year
                  if (month != 0) {
                    months = month > 1 ? ' months ' : ' month '
                    date += month + months
                    days = day > 1 ? ' days ' : ' day '
                    date += day + days
                  }
                }
                else {
                  months = month > 1 ? ' months ' : ' month '
                  date += month + months
                  days = day > 1 ? ' days ' : ' day '
                  date += day + days
                }
              }
              else {
                months = month > 1 ? ' months ' : ' month '
                date += month + months
                days = day > 1 ? ' days ' : ' day '
                date += day + days
              }
            }
            else{
              days = day > 1 ? ' days ' : ' day '
              date += day + days
            }
          }
        }
      }
      if (hour != 0) {
        var hours = hour > 1 ? ' hours ' : ' hour '
        date += hour + hours
      }
      if (timeArr[1] != '00') {
        var minute = timeArr[1] != '01' ? ' minutes ' : ' minute '
        date += timeArr[1] + minute
      }
      if (timeArr[2] != '00') {
        var second = timeArr[2] != '01' ? ' seconds ' : ' second '

        date += timeArr[2] + second
      }
      if (date == '' || date == '-') {
        date = '05 second'
      }
    }
    return date
  }

  getTotTime(inTime, outTime) {
    // console.log("time===",inTime,outTime)
    this.date1 = new Date(inTime)
    this.date2 = outTime == null || outTime == '-' ? new Date() : new Date(outTime)
    // console.log("time2===",this.date1, this.date2)
    if (this.date1 != "Invalid Date") {
      if (this.date2 != "Invalid Date") {
        var diff = Math.abs(this.date2 - this.date1)
      }
      else {
        return '-'
      }

      let ms = diff % 1000;
      diff = (diff - ms) / 1000;
      let s = diff % 60;
      diff = (diff - s) / 60;
      let m = diff % 60;
      diff = (diff - m) / 60;
      let h = diff

      let ss = s <= 9 && s >= 0 ? "0" + s : s;
      let mm = m <= 9 && m >= 0 ? "0" + m : m;
      let hh = h <= 9 && h >= 0 ? "0" + h : h;

      var time = hh + ':' + mm + ':' + ss
      //  console.log("time======",time)
      return this.convertTime(time)
    }
  }

  getZone() {
    var date = new Date()
    var timezone = date.getTimezoneOffset()
    // console.log("time zone==", timezone)

    // let m = timezone % 60;
    // console.log("m==",m)
    // timezone = (timezone - m) / 60;
    // let h = timezone
    // console.lo/g("h==",m)

    // let mm = m <= 9 && m >= 0 ? "0"+m : m;
    // let hh = h <= 9 && h >= 0 ? "0"+h : h;

    // var timezones=-(timezone)
    // console.log("time zone==",time1zone)

    // if(timezones<0 ){
    //   var timeZone= '-'+((hh)+':'+(mm)).toString()
    // }
    // else{
    //   timeZone= '+'+ ((-hh)+':'+ (-mm)).toString()
    // }

    return date.getTimezoneOffset()
  }

  getTime(num) {
    var day = Math.floor(num / 1440);
    var hour = Math.floor((num - (day * 1440)) / 60);
    var min = Math.round(num % 60);
    console.log("day:hour:min", day, hour, min)
    if (day == 0) {
      if (hour > 0 && min > 0) {
        return ((hour == 1 ? hour + ' hour' : hour + ' hours') + ' ' + (min == 1 ? min + ' min' : min + ' minutes'));
      }
      if (hour == 0 && min > 0) {
        return (min == 1 ? min + ' min' : min + ' minutes');
      }
      if (hour > 0 && min == 0) {
        return (hour == 1 ? hour + ' hour' : hour + ' hours');
      }
      if (hour == 0 && min == 0) {
        return '0 min';
      }
    }
    else if (day > 0) {
      if (hour > 0 && min > 0) {
        return ((day == 1 ? day + ' day' : day + ' days') + ' ' + (hour == 1 ? hour + ' hour' : hour + ' hours') + ' ' + (min == 1 ? min + ' min' : min + ' minutes'));
      }
      if (hour == 0 && min > 0) {
        return ((day == 1 ? day + ' day' : day + ' days') + ' ' + (min == 1 ? min + ' min' : min + ' minutes'));
      }
      if (hour > 0 && min == 0) {
        return ((day == 1 ? day + ' day' : day + ' days') + ' ' + (hour == 1 ? hour + ' hour' : hour + ' hours'));
      }
      if (hour == 0 && min == 0) {
        return (day == 1 ? day + ' day' : day + ' days');
      }
    }

  }
  getMillisecondToMinutes(milli){
    return Math.floor(milli/(1000 * 60));
  }
}
