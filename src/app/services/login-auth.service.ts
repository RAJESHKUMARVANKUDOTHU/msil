import { Injectable } from '@angular/core';
import { Subject, Observable, EMPTY } from 'rxjs'
import { Router, ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import * as CryptoJS from 'crypto-js';
import { GeneralService } from './general.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Injectable({
  providedIn: 'root'
})
export class LoginAuthService {

  public loginCred = new Subject<any>()
  public loginCheckData = new Subject<any>()
  constructor(private location: Location, private router: Router,private general:GeneralService,private dialog:MatDialog) {
    this.popState()
  }
  ngOnInit(): void {
   
  }

  loginData() {
    var status = localStorage.getItem('sensegiz')?this.general.decrypt(localStorage.getItem('sensegiz')):'';
    if (this.checkRole()) {
      // console.log("true")
      if(status.role ==  'superAdminRole'){
        var a ={
          menu : false,
          other : true
        }
      }
      else{
        a ={
          menu : true,
          other : true
        }
      }
      this.loginCheckData.next(a);
    }
    else {
  
      a ={
        menu : false,
        other : false
      }
      this.loginCheckData.next(a);
    
    }
  }

  popState() {
    this.location.subscribe(
      ((value: PopStateEvent) => {

        if (window.location.pathname == '/login' || window.location.pathname == '/admin-login'){  
          this.logout()    ;
        }
        else {
          this.loginData();
        }

      }),
      (ex => {
        console.log("Error occured postate event");
        console.log(ex);
      })
    )
  }
  getLoginDetails() {
    var status = localStorage.getItem('sensegiz')?this.general.decrypt(localStorage.getItem('sensegiz')):'';
    if (this.checkRole() && this.checkRole() != null) {
      return status;
    }
    else {
      return false;
    }
  }

  checkRole() {
    var status = localStorage.getItem('sensegiz')?this.general.decrypt(localStorage.getItem('sensegiz')):'';
    if (status && status != 'undefined' || status != null) {
      if (status.role == 'adminRole' ||
        status.role == 'userRole' ||
        status.role == 'coAdminRole' ||
        status.role == 'subAdminRole' || status.role == 'superAdminRole') {
        return true;
      }
      else {
        return false;
      }
    } else {
      return false;;
    }
  }
  login(data) {
    let storeData=this.general.encrypt(data);
    localStorage.setItem('sensegiz', storeData);
    return true;
  }

  logout() {
    var a={
      menu:false,
      other:false
    }
    this.dialog.closeAll();
    this.loginCheckData.next(a);
    localStorage.clear();
    this.router.navigate(['/login']);
  }
}
