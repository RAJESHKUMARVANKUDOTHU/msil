import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { GeneralService } from '../../services/general.service';
import { LoginAuthService } from '../../services/login-auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditSettingShiftComponent } from '../edit-setting-shift/edit-setting-shift.component';
import { AdminSettingInfoComponent } from '../admin-setting-info/admin-setting-info.component';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {
  onlineStatus: FormGroup
  offlineStatus: FormGroup
  rssiForm: FormGroup
  txPowerForm: FormGroup
  shiftForm: FormGroup
  deletionTimeForm: FormGroup
  mergingTimeForm: FormGroup
  inOutmergingTimeForm: FormGroup
  meshForm: FormGroup
  loginData: any
  multipleShift: boolean = false
  timeExceed: boolean = false
  gateway: any = []
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    private general: GeneralService,
    private login: LoginAuthService,
    public dialog: MatDialog,

  ) {
    this.onlineStatus = this.fb.group({
      onlineStatus: ['', [Validators.required, Validators.min(5), Validators.max(1275), Validators.pattern(/^\d*[05]$/)]]
    })
    this.offlineStatus = this.fb.group({
      offlineStatus: ['', [Validators.required, Validators.min(5), Validators.max(1275), Validators.pattern(/^\d*[05]$/)]]
    })
    this.rssiForm = this.fb.group({
      rssi: ['', [Validators.required, Validators.min(0), Validators.max(255)]]
    })
    this.txPowerForm = this.fb.group({
      txPower: ['', Validators.required]
    })

    this.shiftForm = this.fb.group({
      shiftName: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
    this.mergingTimeForm = this.fb.group({
      mergingTime: ['', [Validators.required, Validators.min(0), Validators.max(60)]]
    })
    this.deletionTimeForm = this.fb.group({
      deletionTime: ['', [Validators.required, Validators.min(0), Validators.max(60)]]
    })
    this.inOutmergingTimeForm = this.fb.group({
      inOutMergeTime : ['', [Validators.required, Validators.min(0), Validators.max(60)]]
    })
    this.meshForm = this.fb.group({
      meshId: ['', [Validators.required, Validators.min(0), Validators.max(255)]],
      gatewayId: ['', Validators.required]
    })
  }

  ngOnInit(): void {
    this.loginData = this.login.getLoginDetails();
    this.refreshGateway()
    this.refreshSettings(this.loginData.userData)
  }
  refreshSettings(data) {
    this.api.getUserSettings(data).then((res: any) => {
      console.log("user settings ===", res)
      if (res.status) {
        this.onlineStatus.patchValue({
          onlineStatus: res.success.onlineStatus
        })

        this.offlineStatus.patchValue({
          offlineStatus: res.success.offlineStatus
        })

        this.rssiForm.patchValue({
          rssi: res.success.rssi
        })

        this.txPowerForm.patchValue({
          txPower: res.success.txPower
        })

        this.mergingTimeForm.patchValue({
          mergingTime: res.success.mergingTime
        })

        this.deletionTimeForm.patchValue({
          deletionTime: res.success.deletionTime
        })
        this.inOutmergingTimeForm.patchValue({
          inOutMergeTime: res.success.inOutMergeTime
        })


      }
    })
  }
  onSubmitOnlineStatus(data) {
    if (this.onlineStatus.valid) {
      data.userId = this.loginData.userData
      console.log("onSubmit OnlineStatus data==", data)
      this.api.updateOnlineStatus(data).then((res: any) => {
        console.log("res==", res)
        if (res.status) {
          this.general.openSnackBar(res.message, '')
          this.refreshSettings(data.userId)
        }
      }).catch((err: any) => {
        console.log("err==", err)
      })
    }
  }

  onSubmitOfflineStatus(data) {
    if (this.offlineStatus.valid) {
      data.userId = this.loginData.userData
      console.log("onSubmit OfflineStatus data==", data)
      this.api.updateOfflineStatus(data).then((res: any) => {
        console.log("res==", res)
        if (res.status) {
          this.general.openSnackBar(res.message, '')
          this.refreshSettings(data.userId)
        }
      }).catch((err: any) => {
        console.log("err==", err)
      })
    }
  }

  onSubmitTxPower(data) {
    if (this.txPowerForm.valid) {
      data.userId = this.loginData.userData
      console.log("onSubmit tx power data==", data)
      this.api.updateTxPower(data).then((res: any) => {
        console.log("res==", res)
        if (res.status) {
          this.general.openSnackBar("TX power updated successfully!!!", '')
          this.refreshSettings(data.userId);
        }
      }).catch((err: any) => {
        console.log("err==", err)
      })
    }
  }

  onSubmitRssi(data) {
    if (this.rssiForm.valid) {
      data.userId = this.loginData.userData
      console.log("onSubmit rssi data==", data)
      this.api.updateRssi(data).then((res: any) => {
        if (res.status) {
          console.log("res==", res)
          this.general.openSnackBar(res.message, '');
          this.refreshSettings(data.userId);
        }
      }).catch((err: any) => {
        console.log("err==", err)
      })
    }
  }
  onSubmitShiftForm(data) {
    var cdt1 = moment(data.startTime, 'HH:mm:ss')
    var cdt2 = moment(data.endTime, 'HH:mm:ss')
    var times1 = moment(cdt1).format("YYYY/MM/DD HH:mm:ss")
    var times2 = moment(cdt2).format("YYYY/MM/DD HH:mm:ss")
    if (times1 > times2 || (data.fromTime == "00:00" && data.endTime == "00:00")) {
      times2 = moment(cdt2).add(1, 'days').format("YYYY/MM/DD HH:mm:ss")
    }
    var times = moment(times2, "YYYY/MM/DD HH:mm:ss").diff(moment(times1, "YYYY/MM/DD HH:mm:ss"))
    var d = moment.duration(times)

    var minhour = (d.hours() + ":" + d.minutes()).split(":")

    if ((parseInt(minhour[0]) >= 9 && (parseInt(minhour[1]) >= 0 && parseInt(minhour[1]) <= 59))) {
      this.timeExceed = false
      var dateobj = new Date()

      var year = dateobj.getFullYear();
      var month = dateobj.getMonth() + 1
      var day = dateobj.getDate()
      var date = month + '/' + day + '/' + year

      var time1 = date + " " + data.startTime
      var time2 = date + " " + data.endTime

      time1 = new Date(time1).toUTCString()
      time2 = new Date(time2).toUTCString()
      var h = new Date(time1).getUTCHours()
      var m = new Date(time1).getUTCMinutes()
      var h1 = new Date(time2).getUTCHours()
      var m1 = new Date(time2).getUTCMinutes()
      var hh = h <= 9 && h >= 0 ? "0" + h : h;
      var mm = m <= 9 && m >= 0 ? "0" + m : m;
      var hh1 = h1 <= 9 && h1 >= 0 ? "0" + h1 : h1;
      var mm1 = m1 <= 9 && m1 >= 0 ? "0" + m1 : m1;

      data.startTime = hh + ':' + mm
      data.endTime = hh1 + ':' + mm1



      if (this.shiftForm.valid) {
        try {
          //  console.log("time data===",data)
          data.userId = this.loginData.userData
          console.log("data====", data)
          this.api.createdDeviceShift(data).then((res: any) => {
            //  console.log("time insrted or updated",res)
            if (res.status) {
              this.timeExceed = false
              this.multipleShift = false

              this.general.openSnackBar('Shift updated successfully!!', '')
              this.shiftForm.reset();
            }
            else {
              this.timeExceed = false
              this.multipleShift = true
            }
          })

        } catch (err) {
        }
      }
    }
    else if ((parseInt(minhour[0]) == 9 && parseInt(minhour[1]) < 0) || parseInt(minhour[0]) < 9) {
      this.timeExceed = true
      this.multipleShift = false
    }
  }

  onSubmitMergingTime(data) {
    if (this.mergingTimeForm.valid) {
      data.userId = this.loginData.userData
      console.log("onSubmit merging data==", data)
      this.api.updateMergingTime(data).then((res: any) => {
        if (res.status) {
          console.log("res==", res)
          this.general.openSnackBar(res.success, '');
          this.refreshSettings(data.userId);
        }
      }).catch((err: any) => {
        console.log("err==", err)
      })
    }
  }

  onSubmitDeletionTime(data) {
    if (this.deletionTimeForm.valid) {
      data.userId = this.loginData.userData
      console.log("onSubmit deletion data==", data)
      this.api.updateDeletionTime(data).then((res: any) => {
        if (res.status) {
          console.log("res==", res)
          this.general.openSnackBar(res.success, '');
          this.refreshSettings(data.userId);
                }
      }).catch((err: any) => {
        console.log("err==", err)
      })
    }
  }

  onSubmitInOutmergingTimeForm(data) {
    if (this.inOutmergingTimeForm.valid) {
      data.userId = this.loginData.userData
      console.log("onSubmit in out merging data==", data)
      this.api.updateInOutMergeTime(data).then((res: any) => {
        if (res.status) {
          console.log("res==", res)
          this.general.openSnackBar(res.success, '');
          this.refreshSettings(data.userId);
        }
      }).catch((err: any) => {
        console.log("err==", err)
      })
    }
  }
  
  onSubmitMeshForm(data) {
    if (this.meshForm.valid) {
      data.userId = this.loginData.userData
      console.log("onSubmit mesh data==", data)
      this.api.updateMeshId(data).then((res: any) => {
        if (res.status) {
          console.log("res==", res)
          this.general.openSnackBar(res.success, '');
          this.refreshSettings(data.userId);
        }
      }).catch((err: any) => {
        console.log("err==", err)
      })
    }
  }

  
  openDialog(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = 'fit-content';
    dialogConfig.width = 'fit-content';
    dialogConfig.data = {
      type: "shifts"
    }
    const dialogRef = this.dialog.open(EditSettingShiftComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
    });
  }
  openAdminSettingInfo(): void {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = 'fit-content';
    dialogConfig.width = 'fit-content';
    dialogConfig.data = {
      data:this.loginData.userData
    }
    const dialogRef = this.dialog.open(AdminSettingInfoComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
    });
  }

  refreshGateway() {
    var data = {
      userId: this.loginData.userData
    }
    console.log("user id data==", data);

    this.api.getSuperAdminGatewayData(data).then((res: any) => {

      console.log("gatway submit====", res);
      this.gateway = []
      if (res.status) {
        this.gateway = res.success
      }

    }).catch((err: any) => {
      console.log("error===", err)
    })
  }
}
