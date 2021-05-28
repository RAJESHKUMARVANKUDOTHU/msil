import { Component, OnInit } from '@angular/core';
import { LoginAuthService } from './services/login-auth.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DeviceDetectorService } from 'ngx-device-detector';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import * as moment from 'moment';
import { timer } from 'rxjs';
import { GeneralService } from './services/general.service';
import { ApiService } from './services/api.service'
import { environment } from '../environments/environment';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  title = 'ATapp';
  deviceInfo: any;
  isMobile: boolean;
  isTablet: boolean;
  isDesktopDevice: boolean;
  // isExpanded = true;
  // isShowing = false;
  showLabel: boolean;
  loginDetails: any = '';
  logged: boolean = false;
  menu: boolean = false;
  role: boolean = false;
  statusFreeze: boolean = false;
  freezeMessage: String = 'Loading';
  countDownTimer: any;
  duration: any;
  time: any;
  image: any = ''
  host: any = environment.apiHost


  constructor(
    private login: LoginAuthService,
    private router: Router,
    public dialog: MatDialog,
    private route: ActivatedRoute,
    private deviceService: DeviceDetectorService,
    public general: GeneralService,
    private api: ApiService,
  ) {


    this.login.loginCheckData.subscribe((res) => {
      if (res) {
        this.logged = res.other;
        this.menu = res.menu;
        console.log("log meu==", this.logged, this.menu)
        if (this.logged == true) {
          this.loginDetails = this.login.getLoginDetails();
          this.duration = this.loginDetails.timer;
          this.startTimer()
          this.freezeSubscribe();
          if (this.loginDetails.role != "superAdminRole") {
            this.getImage()
          }
        }
        else {
          clearInterval(this.countDownTimer);
          this.loginDetails = ''
        }
      }
    });

  }
  ngOnInit(): void {
    this.duration = this.loginDetails.timer;
    this.deviceInfo = this.deviceService.getDeviceInfo();
    this.isMobile = this.deviceService.isMobile();
    this.isTablet = this.deviceService.isTablet();
    this.isDesktopDevice = this.deviceService.isDesktop();
  }

  ngOnDestroy() {
    clearInterval(this.countDownTimer);
  }

  freezeSubscribe() {
    this.general.loadingFreez.subscribe((res: any) => {
      console.log("free==", res);
      this.statusFreeze = res.status
      this.freezeMessage = res.msg
    })
  }

  startTimer() {
    console.log("timer");
    this.countDownTimer = setInterval(() => {
      var start = new Date() as any;
      var diff = this.duration - start
      var minutes = Math.floor((diff / 1000 / 60) << 0);
      var seconds = Math.floor((diff / 1000) % 60);
      this.time =
        (minutes < 10 ? '0' + minutes : minutes) +
        ':' +
        (seconds < 10 ? '0' + seconds : seconds);
      // console.log("this.time==", this.time)
      if (diff >= 0) {
        if (minutes == 0 && seconds == 2) {
          this.general.loadingFreez.next({ status: true, msg: 'Your session has logged out..! please try again later' })
        }
        if (minutes == 0 && seconds == 0) {
          this.general.loadingFreez.next({ status: false, msg: '' })
          clearInterval(this.countDownTimer);
          this.login.logout();
          return;
        }
        if (minutes > 59) {
          console.log("timer 22==", this.countDownTimer);
          this.general.loadingFreez.next({ status: false, msg: '' })
          clearInterval(this.countDownTimer);
          this.login.logout();
          return;
        }
      }
      else {
        this.general.loadingFreez.next({ status: false, msg: '' })
        clearInterval(this.countDownTimer);
        this.login.logout();
        return;
      }
    }, 1000);
  }


  getImage() {
    this.api.getLogoImage().then((res: any) => {
      this.image = res
    }).catch((err: any) => {
      console.log("err==", err)
    })
  }

}
