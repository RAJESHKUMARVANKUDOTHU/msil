import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { GeneralService } from '../../services/general.service';
import { LoginAuthService } from '../../services/login-auth.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { EditSettingShiftComponent } from '../edit-setting-shift/edit-setting-shift.component';
import { AdminSettingInfoComponent } from '../admin-setting-info/admin-setting-info.component';
import { MatOption } from '@angular/material/core';
import * as moment from 'moment';

@Component({
  selector: 'app-admin-settings',
  templateUrl: './admin-settings.component.html',
  styleUrls: ['./admin-settings.component.css']
})
export class AdminSettingsComponent implements OnInit {
  @ViewChild('allSelected') private allSelected: MatOption;
  @ViewChild('allSelected1') private allSelected1: MatOption;
  @ViewChild('allSelected2') private allSelected2: MatOption;
  @ViewChild('allSelected3') private allSelected3: MatOption;
  @ViewChild('allSelected5') private allSelected5: MatOption;
  setUserFeatureForm: FormGroup;
  onlineStatus: FormGroup;
  offlineStatus: FormGroup;
  rssiForm: FormGroup;
  txPowerForm: FormGroup;
  shiftForm: FormGroup;
  deletionTimeForm: FormGroup;
  mergingTimeForm: FormGroup;
  inOutmergingTimeForm: FormGroup;
  meshForm: FormGroup;
  rangeForm: FormGroup;
  timeDelay: FormGroup;
  groupRegister: FormGroup;
  groupCoinForm: FormGroup;
  maxFindForm: FormGroup;
  findTxPowerForm: FormGroup;
  coinPlacementForm: FormGroup;
  loginData: any;
  multipleShift: boolean = false;
  timeExceed: boolean = false;
  gateway: any = [];
  coinData: any = [];
  deviceData: any = [];
  groupData: any = [];
  constructor(
    private fb: FormBuilder,
    private api: ApiService,
    public general: GeneralService,
    private login: LoginAuthService,
    public dialog: MatDialog,

  ) { }

  ngOnInit(): void {
    this.loginData = this.login.getLoginDetails();
    this.createForm();
    this.refreshSettings(this.loginData.userData);
    this.refreshCoin();
    this.refreshDevice();
    this.refreshGateway();
    this.getGroups();
  }

  createForm() {
    this.setUserFeatureForm = this.fb.group({
      enableMap: ['false'],
      enableZone: ['false'],
      enableZoneStandardTime: ['false']
    });
    this.onlineStatus = this.fb.group({
      onlineStatus: ['', [Validators.required, Validators.min(5), Validators.max(1275), Validators.pattern(/^\d*[05]$/)]]
    });
    this.offlineStatus = this.fb.group({
      offlineStatus: ['', [Validators.required, Validators.min(5), Validators.max(1275), Validators.pattern(/^\d*[05]$/)]]
    });
    this.rssiForm = this.fb.group({
      rssi: ['', [Validators.required, Validators.min(0), Validators.max(255)]]
    });
    this.txPowerForm = this.fb.group({
      txPower: ['', Validators.required]
    });
    this.findTxPowerForm = this.fb.group({
      deviceId: ['', Validators.required],
      txPower: ['', [Validators.required, Validators.min(0)]]
    });
    this.coinPlacementForm = this.fb.group({
      coinId: ['', Validators.required],
      coinPlacement: ['', Validators.required]
    });
    this.rangeForm = this.fb.group({
      range: ['', Validators.required]
    });
    this.shiftForm = this.fb.group({
      shiftName: ['', Validators.required],
      startTime: ['', Validators.required],
      endTime: ['', Validators.required]
    });
    this.mergingTimeForm = this.fb.group({
      mergingTime: ['', [Validators.required, Validators.min(0), Validators.max(60)]]
    });
    this.deletionTimeForm = this.fb.group({
      deletionTime: ['', [Validators.required, Validators.min(0), Validators.max(60)]]
    });
    this.inOutmergingTimeForm = this.fb.group({
      inOutMergeTime: ['', [Validators.required, Validators.min(0), Validators.max(60)]]
    });
    this.meshForm = this.fb.group({
      meshId: ['', [Validators.required, Validators.min(0), Validators.max(255)]],
      gatewayId: ['', Validators.required]
    });
    this.timeDelay = this.fb.group({
      deviceId: ['', Validators.required],
      timeDelay: ['', Validators.required],

    });
    this.groupRegister = this.fb.group({
      groupName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\\s]+(?: [a-zA-Z0-9\\s]+)*$')]]
    });
    this.groupCoinForm = this.fb.group({
      coinId: ['', Validators.required],
      groupId: ['', Validators.required],

    });
    this.maxFindForm = this.fb.group({
      coinId: ['', Validators.required],
      maxFindAsset: ['', Validators.required],
    });
  }

  refreshCoin() {
    var data = {
      userId: this.loginData.userData
    }
    this.api.getSuperAdminCoin(data).then((res: any) => {
      console.log("coin submit====", res);
      this.coinData = [];
      if (res.status) {
        this.coinData = res.success;
      }
      else {
        this.coinData = [];
      }
    }).catch((err: any) => {
      console.log("error===", err);
    })
  }

  refreshDevice() {
    var data = {
      userId: this.loginData.userData
    }
    this.api.viewSuperAdminDevice(data).then((res: any) => {
      this.deviceData = [];
      console.log("find submit====", res);
      if (res.status) {
        this.deviceData = res.success;
      }
      else {
        this.deviceData = [];
      }

    }).catch((err: any) => {
      console.log("error===", err);;
    })
  }

  refreshGateway() {
    var data = {
      userId: this.loginData.userData
    }
    console.log("user id data==", data);
    this.api.getSuperAdminGatewayData(data).then((res: any) => {
      console.log("gatway submit====", res);
      this.gateway = [];
      if (res.status) {
        this.gateway = res.success;
      }
    }).catch((err: any) => {
      console.log("error===", err);
    })
  }

  getGroups() {
    var data = {
      userId: this.loginData.userData
    }
    this.api.getGroup(data).then((res: any) => {
      console.log("group details response==", res);
      this.groupData = [];
      if (res.status) {
        this.groupData = res.success;
      }
      else {
        this.groupData = [];
      }
    })
  }

  refreshSettings(data) {
    this.api.getUserSettings(data).then((res: any) => {
      console.log("user settings ===", res)
      if (res.status) {
        this.setUserFeatureForm.patchValue({
          enableMap: res.success.enableMap,
          enableZone: res.success.enableZone,
          enableZoneStandardTime: res.success.enableZone == false ? false : res.success.enableZoneStandardTime
        });
        this.onlineStatus.patchValue({
          onlineStatus: res.success.onlineStatus
        });

        this.offlineStatus.patchValue({
          offlineStatus: res.success.offlineStatus
        });

        this.rangeForm.patchValue({
          range: res.success.range
        });

        this.rssiForm.patchValue({
          rssi: res.success.rssi
        });

        this.txPowerForm.patchValue({
          txPower: res.success.txPower
        });

        this.mergingTimeForm.patchValue({
          mergingTime: res.success.mergingTime
        });

        this.deletionTimeForm.patchValue({
          deletionTime: res.success.deletionTime
        });

        this.inOutmergingTimeForm.patchValue({
          inOutMergeTime: res.success.inOutMergeTime
        });

        this.rangeForm.patchValue({
          range: res.success.range
        });
      }
    })
  }

  onFeatureChange(event) {
    console.log("event==", event);
    this.setUserFeatureForm.patchValue({
      enableZoneStandardTime: event.checked == false ? false : false
    });
  }
  onSubmitUserFeature(data) {
    try {
      if (this.setUserFeatureForm.valid) {
        data.userId = this.loginData.userData;
        data.enableMap = data.enableMap == null ? false : data.enableMap;
        data.enableZone = data.enableZone == null ? false : data.enableZone;
        data.enableZoneStandardTime = data.enableZone == false ? false : data.enableZoneStandardTime;
        console.log("onSubmit setUserFeatureForm data==", data);
        this.api.userFeature(data).then((res: any) => {
          console.log("setUserFeatureFormres==", res);
          if (res.status) {
            this.general.openSnackBar(res.success, '');
            this.refreshSettings(data.userId);
          }
        }).catch((err: any) => {
          console.log("err==", err);
        })
      }
    }
    catch (err) {
      console.log("error==", err)
    }
  }

  onSubmitOnlineStatus(data) {
    if (this.onlineStatus.valid) {
      data.userId = this.loginData.userData;
      console.log("onSubmit OnlineStatus data==", data);
      this.api.updateOnlineStatus(data).then((res: any) => {
        console.log("res==", res);
        if (res.status) {
          this.general.openSnackBar(res.message, '');
          this.refreshSettings(data.userId);
        }
      }).catch((err: any) => {
        console.log("err==", err);
      })
    }
  }

  onSubmitOfflineStatus(data) {
    if (this.offlineStatus.valid) {
      data.userId = this.loginData.userData;
      console.log("onSubmit OfflineStatus data==", data);
      this.api.updateOfflineStatus(data).then((res: any) => {
        console.log("res==", res);
        if (res.status) {
          this.general.openSnackBar(res.message, '');
          this.refreshSettings(data.userId);
        }
      }).catch((err: any) => {
        console.log("err==", err);
      })
    }
  }

  onSubmitTxPower(data) {
    if (this.txPowerForm.valid) {
      data.userId = this.loginData.userData;
      console.log("onSubmit tx power data==", data)
      this.api.updateTxPower(data).then((res: any) => {
        console.log("res==", res);
        if (res.status) {
          this.general.openSnackBar("TX power updated successfully!!!", '');
          this.refreshSettings(data.userId);
        }
      }).catch((err: any) => {
        console.log("err==", err);
      })
    }
  }

  onSubmitRssi(data) {
    if (this.rssiForm.valid) {
      data.userId = this.loginData.userData;
      console.log("onSubmit rssi data==", data);
      this.api.updateRssi(data).then((res: any) => {
        if (res.status) {
          console.log("res==", res);
          this.general.openSnackBar(res.message, '');
          this.refreshSettings(data.userId);
        }
      }).catch((err: any) => {
        console.log("err==", err);
      })
    }
  }

  onSubmitShiftForm(data) {
    var cdt1 = moment(data.startTime, 'HH:mm:ss');
    var cdt2 = moment(data.endTime, 'HH:mm:ss');
    var times1 = moment(cdt1).format("YYYY/MM/DD HH:mm:ss");
    var times2 = moment(cdt2).format("YYYY/MM/DD HH:mm:ss");
    if (times1 > times2 || (data.fromTime == "00:00" && data.endTime == "00:00")) {
      times2 = moment(cdt2).add(1, 'days').format("YYYY/MM/DD HH:mm:ss");
    }
    var times = moment(times2, "YYYY/MM/DD HH:mm:ss").diff(moment(times1, "YYYY/MM/DD HH:mm:ss"));
    var d = moment.duration(times);

    var minhour = (d.hours() + ":" + d.minutes()).split(":");

    if ((parseInt(minhour[0]) >= 9 && (parseInt(minhour[1]) >= 0 && parseInt(minhour[1]) <= 59))) {
      this.timeExceed = false;
      var dateobj = new Date();

      var year = dateobj.getFullYear();
      var month = dateobj.getMonth() + 1;
      var day = dateobj.getDate();
      var date = month + '/' + day + '/' + year;

      var time1 = date + " " + data.startTime;
      var time2 = date + " " + data.endTime;

      time1 = new Date(time1).toUTCString();
      time2 = new Date(time2).toUTCString();
      var h = new Date(time1).getUTCHours();
      var m = new Date(time1).getUTCMinutes();
      var h1 = new Date(time2).getUTCHours();
      var m1 = new Date(time2).getUTCMinutes();
      var hh = h <= 9 && h >= 0 ? "0" + h : h;
      var mm = m <= 9 && m >= 0 ? "0" + m : m;
      var hh1 = h1 <= 9 && h1 >= 0 ? "0" + h1 : h1;
      var mm1 = m1 <= 9 && m1 >= 0 ? "0" + m1 : m1;

      data.startTime = hh + ':' + mm;
      data.endTime = hh1 + ':' + mm1;

      if (this.shiftForm.valid) {
        try {
          //  console.log("time data===",data)
          data.userId = this.loginData.userData;
          console.log("data====", data);
          this.api.createdDeviceShift(data).then((res: any) => {
            //  console.log("time insrted or updated",res)
            if (res.status) {
              this.timeExceed = false;
              this.multipleShift = false;
              this.general.openSnackBar('Shift updated successfully!!', '');
              this.shiftForm.reset();
            }
            else {
              this.timeExceed = false;
              this.multipleShift = true;
            }
          })
        } catch (err) {
          console.log("error===", err)
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

  onSubmitRangeForm(data) {
    data.userId = this.loginData.userData;
    console.log("data===", data);
    try {
      if (this.rangeForm.valid) {
        this.api.setRange(data).then((res: any) => {
          console.log("range res===", res);
          if (res.status) {
            this.rangeForm.reset();
            this.general.openSnackBar(res.success, '');
            this.refreshSettings(data.userId);
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '');
          }
        }).catch((err) => {
          console.log("err=", err);
        })
      }
      else { }
    }
    catch (error) {
      console.log("error==", error);
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

  onSubmitTimeDelay(data) {
    data.deviceId = this.general.filterArray(data.deviceId);
    data.userId = this.loginData.userData;

    console.log("onSubmitTimeDelay data==", data);
    try {
      if (this.timeDelay.valid) {
        this.api.timeDelay(data).then((res: any) => {

          console.log("timeDelay res===", res);
          if (res.status) {
            this.timeDelay.reset();
            this.refreshDevice();
            this.general.openSnackBar(res.success, '');
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '');
          }
        }).catch((err) => {
          console.log("err=", err);
        })
      }
      else { }
    }
    catch (error) {
      console.log("error==", error);
    }

  }

  onSubmitMaxFindForm(data) {
    data.coinId = this.general.filterArray(data.coinId);
    data.userId = this.loginData.userData;

    console.log("onSubmitMaxFindForm data==", data);

    try {
      if (this.maxFindForm.valid) {
        this.api.updateMaxFind(data).then((res: any) => {
          console.log("max find res===", res);
          if (res.status) {
            this.maxFindForm.reset();
            this.refreshDevice();
            this.general.openSnackBar(res.success, '');
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '');

          }
        }).catch((err) => {
          console.log("err=", err);
        })
      }
      else { };
    }
    catch (error) {
      console.log("error==", error);
    }
  }

  onSubmitGroup(data) {
    data.userId = this.loginData.userData;
    try {
      if (this.groupRegister.valid) {
        data.groupName = data.groupName.trim().replace(/\s\s+/g, ' ');
        console.log("onSubmitGroup data==", data);
        this.api.groupRegister(data).then((res: any) => {
          console.log("Group register res===", res)
          if (res.status) {
            this.groupRegister.reset();
            this.getGroups();
            this.general.openSnackBar(res.success, '');
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '');
          }
        }).catch((err) => {
          console.log("err=", err);
        });
      }
      else { }
    }
    catch (error) {
      console.log("error==", error);
    }
  }

  onSubmitGroupCoinForm(data) {
    data.groupName = this.groupData.filter(obj => obj._id == data.groupId)[0].groupName;
    data.coinId = this.general.filterArray(data.coinId);
    data.userId = this.loginData.userData;
    console.log("onSubmitGroupCoinForm data==", data);
    try {
      if (this.groupCoinForm.valid) {
        if (data.coinId.length > 0) {
          this.api.updateGroup(data).then((res: any) => {

            console.log("Group coin res===", res);
            if (res.status) {
              this.groupCoinForm.reset();
              this.refreshCoin();
              this.getGroups();
              this.general.openSnackBar(res.success, '');
            }
            else {
              this.general.openSnackBar(res.success == false ? res.message : res.success, '');

            }
          }).catch((err) => {
            console.log("err=", err);
          })
        }
        else {
          this.groupCoinForm.reset();
          this.general.openSnackBar("Update unsuccessfull, There are no more coin left in the list.", '')
        }
      }
      else { }
    }
    catch (error) {
      console.log("error==", error);
    }
  }

  onSubmitFindTxPower(data) {
    data.deviceId = this.general.filterArray(data.deviceId);
    data.userId = this.loginData.userData;
    console.log("onSubmitFindTxPower data==", data);
    try {
      if (this.findTxPowerForm.valid) {
        this.api.updateDeviceTxPower(data).then((res: any) => {

          console.log("onSubmitFindTxPower res===", res);
          if (res.status) {
            this.findTxPowerForm.reset();
            this.refreshDevice();
            this.general.openSnackBar(res.success, '');
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '');
          }
        }).catch((err) => {
          console.log("err=", err);
        })
      }
    }
    catch (error) {
      console.log("error==", error);
    }
  }
  onSubmitCoinPlacement(data) {
    data.coinId = this.general.filterArray(data.coinId);
    data.userId = this.loginData.userData;
    console.log("onSubmitCoinPlacement data==", data);
    try {
      if (this.coinPlacementForm.valid) {
        this.api.updateCoinPlacement(data).then((res: any) => {
          console.log("onSubmitCoinPlacement res===", res);
          if (res.status) {
            this.coinPlacementForm.reset();
            this.refreshCoin();
            this.general.openSnackBar(res.success, '');
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '');
          }
        }).catch((err) => {
          console.log("err=", err);
        })
      }
    }
    catch (error) {
      console.log("error==", error);
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

  openAdminSettingInfo(data): void {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = 'fit-content';
    dialogConfig.width = 'fit-content';
    dialogConfig.data = {
      type: data
    }
    const dialogRef = this.dialog.open(AdminSettingInfoComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (data == 'timeDelay') {
        this.refreshDevice();
      }
      else if (data == 'max-find') {
        this.refreshCoin();
      }
      else if (data == 'groupName' || data == 'coinGrp') {
        this.refreshCoin();
        this.getGroups();
      }
      else {
        this.refreshGateway();
      }
    });
  }

  toggleAllSelectionDevice(formData) {
    if (this.allSelected.selected) {
      formData.controls.deviceId.patchValue([...this.deviceData.map(obj => obj.deviceId), 0]);
    }
    else {
      formData.controls.deviceId.patchValue([]);
    }
  }

  toggleAllSelectionDevices(formData) {
    if (this.allSelected2.selected) {
      formData.controls.deviceId.patchValue([...this.deviceData.map(obj => obj.deviceId), 0]);
    }
    else {
      formData.controls.deviceId.patchValue([]);
    }
  }

  toggleAllSelectionCoin(formData) {
    if (this.allSelected3.selected) {
      formData.controls.coinId.patchValue([...this.coinData.map(obj => obj.coinId), 0]);
    }
    else {
      formData.controls.coinId.patchValue([]);
    }
  }

  toggleAllSelectionCoins(formData) {
    if (this.allSelected1.selected) {
      formData.controls.coinId.patchValue([...this.coinData.map(obj => obj.coinId), 0]);
    }
    else {
      formData.controls.coinId.patchValue([]);
    }
  }

  toggleAllSelectionCoin2(formData) {
    if (this.allSelected5.selected) {
      formData.controls.coinId.patchValue([...this.coinData.map(obj => {
        if (!(obj.groupId)) {
          return obj.coinId
        }
      }), 0]);
    }
    else {
      formData.controls.coinId.patchValue([]);
    }
  }
}
