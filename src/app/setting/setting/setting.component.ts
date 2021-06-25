import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginAuthService } from '../../services/login-auth.service';
import { GeneralService } from '../../services/general.service';
import { ApiService } from '../../services/api.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { SettingInfoComponent } from '../setting-info/setting-info.component';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-setting',
  templateUrl: './setting.component.html',
  styleUrls: ['./setting.component.css']
})
export class SettingComponent implements OnInit {
  @ViewChild('allSelected') private allSelected: MatOption
  @ViewChild('allSelected1') private allSelected1: MatOption
  @ViewChild('allSelected2') private allSelected2: MatOption
  @ViewChild('allSelected3') private allSelected3: MatOption
  @ViewChild('allSelected4') private allSelected4: MatOption
  @ViewChild('fileInput') fileInput: ElementRef;
  inactivityFind: FormGroup;
  inactivityCoin: FormGroup;
  coinCategory: FormGroup;
  zoneForm: FormGroup;
  mainZoneForm: FormGroup;
  subZoneForm: FormGroup;
  coinData: any = [];
  coinDataTemp: any = [];
  coinDataZone: any = [];
  deviceData: any = [];
  groupData: any = [];
  twoStepAuthStatus: any = [];
  mainZone: any = [];
  subZone: any = [];
  name: any;
  zoneData: any;
  tempImagePath: any;
  uploadForm: FormGroup;
  loginData: any;;
  loading: boolean = false;
  constructor(
    private fb: FormBuilder,
    private login: LoginAuthService,
    private api: ApiService,
    public general: GeneralService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loginData = this.login.getLoginDetails();
    this.createForm();
    this.refreshDevice();
    this.refreshCoin();
    this.refreshSetting();
    if (this.loginData.enableZone) {
      this.getZoneDetails();
      this.getMainZone();
    }
  }
  createForm() {
    this.inactivityFind = this.fb.group({
      deviceId: ['', Validators.required],
      inactivityTime: ['', Validators.required],
      alert: ['', Validators.required]
    });

    this.inactivityCoin = this.fb.group({
      coinId: ['', Validators.required],
      inactivityTime: ['', Validators.required],
      alert: ['', Validators.required]
    });

    this.uploadForm = this.fb.group({
      fileData: null,
      type: 'logo',
    });
    if (this.loginData.enableZone) {
      this.zoneForm = this.fb.group({
        zoneName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]+(?: [a-zA-Z0-9_]+)*$')]],
      });
      this.coinCategory = this.fb.group({
        coinId: ['', Validators.required],
        zoneId: ['', Validators.required],

      });
      this.mainZoneForm = this.fb.group({
        zoneName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9\\s]+(?: [a-zA-Z0-9\\s]+)*$')]],
        standardTime: ['', [Validators.min(0)]]
      });
      this.subZoneForm = this.fb.group({
        mainZoneId: ['', Validators.required],
        zoneName: ['', Validators.required]
      });
    }
  }

  refreshSetting() {
    this.api.refreshSettings().then((res: any) => {
      console.log("refresh Settings====", res);
      if (res.status) {
        if (res.success.isTwoStepAuth == false) {
          this.twoStepAuthStatus = {
            value: 'Enable',
            status: false
          }
        }
        else {
          this.twoStepAuthStatus = {
            value: 'Disable',
            status: true
          }
        }
      }
      else {
        this.general.openSnackBar(res.success, '');
      }
    }).catch((err: any) => {
      console.log("error===", err);
    })
  }

  refreshCoin() {
    var data = '';
    this.api.getCoinData(data).then((res: any) => {

      console.log("coin submit====", res);
      this.coinData = [];
      if (res.status) {
        this.coinData = res.success;
        console.log(" this.coinDataTemp==", this.coinDataTemp);
      }
      else {
        this.coinData = [];
      }

    }).catch((err: any) => {
      console.log("error===", err);
    })
  }

  refreshDevice() {
    var data = ''
    this.api.getDeviceData(data).then((res: any) => {

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

  // onSubmitInactivityFind(data) {
  //   data.deviceId = this.general.filterArray(data.deviceId)
  //   try {
  //     if (this.inactivityFind.valid) {
  //       data.sms = data.alert == 'sms' ? true : false;
  //       data.email = data.alert == 'email' ? true : false;
  //       console.log("onSubmitInactivityFind data==", data)
  //       this.api.deviceInactivity(data).then((res: any) => {

  //         console.log("inactivity find res===", res);
  //         if (res.status) {
  //           this.inactivityFind.reset();
  //           this.refreshDevice();
  //           this.general.openSnackBar(res.success, '');
  //         }
  //         else {
  //           this.general.openSnackBar(res.success == false ? res.message : res.success, '');
  //         }
  //       }).catch((err) => {
  //         console.log("err=", err);
  //       })
  //     }
  //     else { }
  //   }
  //   catch (error) {
  //     console.log("error==", error);
  //   }

  // }

  // onSubmitInactivityCoin(data) {
  //   data.coinId = this.general.filterArray(data.coinId);
  //   console.log("onSubmitInactivityCoin data==", data);
  //   data.sms = data.alert == 'sms' ? true : false;
  //   data.email = data.alert == 'email' ? true : false;
  //   try {
  //     if (this.inactivityCoin.valid) {
  //       if (data.coinId.length > 0) {
  //         this.api.coinInactivity(data).then((res: any) => {
  //           console.log("inactivity coin res===", res);
  //           if (res.status) {
  //             this.inactivityCoin.reset();
  //             this.refreshCoin();
  //             this.general.openSnackBar(res.success, '');
  //           }
  //           else {
  //             this.general.openSnackBar(res.success == false ? res.message : res.success, '');
  //           }
  //         }).catch((err) => {
  //           console.log("err=", err);
  //         })
  //       }
  //       else {
  //       }
  //     }
  //     else { }
  //   }
  //   catch (error) {
  //     console.log("error==", error);
  //   }
  // }


  onSumbitCoinCategory(data) {
    data.coinId = this.general.filterArray(data.coinId);
    console.log("onSumbitCoinCategory data==", data);
    try {
      if (this.coinCategory.valid) {
        if (data.coinId.length > 0) {
          this.api.zoneConfiguration(data).then((res: any) => {
            console.log("zone setting res===", res);
            if (res.status) {
              this.coinCategory.reset();
              this.refreshCoin();
              this.getZoneDetails();
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
          this.coinCategory.reset();
          this.general.openSnackBar("Update unsuccessfull. There are no more coin left in the list", '');
        }
      }
      else { };
    }
    catch (error) {
      console.log("error==", error);
    }
  }

  onSubmitZoneForm(data) {
    console.log("onSubmitZoneForm data==", data);
    try {
      if (this.zoneForm.valid) {
        data.zoneName = data.zoneName.trim().replace(/\s\s+/g, ' ');
        data.standardTime = 0;
        this.api.zoneSetting(data).then((res: any) => {
          console.log("zone setting res===", res);
          if (res.status) {
            this.zoneForm.reset();
            this.getZoneDetails();
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

  onSubmitMainZoneForm(data) {
    try {
      if (this.mainZoneForm.valid) {
        data.zoneName = data.zoneName.trim().replace(/\s\s+/g, ' ');
        data.standardTime = this.loginData.enableZoneStandardTime ? data.standardTime : 0;
        console.log("onSubmitMainZoneForm data==", data)
        this.api.createMainZone(data).then((res: any) => {
          console.log("zone setting res===", res);
          if (res.status) {
            this.mainZoneForm.reset();
            this.getMainZone();
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

  getMainZone() {
    try {
      this.api.getMainZones().then((res: any) => {
        console.log("zone setting res===", res);
        this.mainZone = [];
        if (res.status) {
          this.mainZone = res.success;
        }
        else {
          this.general.openSnackBar(res.success == false ? res.message : res.success, '');
        }
      }).catch((err) => {
        console.log("err=", err);
      })
    }
    catch (error) {
      console.log("error==", error);
    }
  }

  onSubmitSubZoneForm(data) {
    data.zoneName = this.general.filterArray(data.zoneName);
    console.log("onSubmitZoneForm data==", data);
    try {
      if (this.subZoneForm.valid) {
        if (data.zoneName.length > 0) {
          data['standardTime'] = this.mainZone.filter(obj => {
            if (obj._id == data.mainZoneId) {
              return obj;
            }
          })[0].standardTime;
          this.api.updateSubZones(data).then((res: any) => {
            console.log("zone setting res===", res);
            if (res.status) {
              this.subZoneForm.reset();
              this.getZoneDetails();
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
          this.subZoneForm.reset();
          this.general.openSnackBar("Update unsuccessfull. There is no more zone left in the list", '');
        }
      }
    }
    catch (error) {
      console.log("error==", error);
    }
  }

  twoStepAuthchange(event) {
    console.log(event)
    if (event.checked == true) {
      this.twoStepAuthStatus = {
        value: 'Disable',
        status: true
      }
    }
    else {
      this.twoStepAuthStatus = {
        value: 'Enable',
        status: false
      }
    }
  }

  onSubmitTwoAuth(value) {
    var data = {
      twoStepAuth: value
    }
    console.log(" data===", data);
    this.api.twoStepAuth(data).then((res: any) => {
      if (res.status) {
        this.refreshSetting();
        this.general.openSnackBar(res.success, '');

      } else {
        this.general.openSnackBar(res.success == false ? res.message : res.success, '');
      }
    })
  }

  fileChange(files) {
    let reader = new FileReader();
    if (files && files.length > 0) {
      let file = files[0];
      reader.readAsDataURL(file);
      console.log("file===", file);
      reader.onload = () => {
        this.tempImagePath = reader.result;
        console.log("\nReader result", reader.result);
        this.uploadForm.get('fileData').setValue({
          filename: file.name,
          filetype: file.type,
          value: this.tempImagePath.split(',')[1],
        });
      }
    }
  }

  clearFile() {
    this.uploadForm.get('fileData').setValue(null);
    this.tempImagePath = '';
    this.fileInput.nativeElement.value = '';
  }


  randomNumber(min = 1, max = 20) {
    return Math.random() * (max - min) + min;
  }

  formSubmit(data) {
    console.log("this.loginData", this.loginData);
    data.fileData.filename = this.loginData._id.toString() + parseInt(this.randomNumber().toString()) + data.fileData.filename;
    console.log("file===", data);
    this.loading = false;
    if (data.fileData.filetype == 'image/jpg' || data.fileData.filetype == 'image/jpeg' || data.fileData.filetype == 'image/png') {
      this.api.uploadLogo(data).then((res: any) => {
        console.log("res img===", res)
        this.general.updateItem('sensegiz', 'logo', data.fileData.filename);
        this.clearFile();
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      })
    } else {
      this.loading = true;
    }
  }

  toggleAllSelectionDevice(formData) {
    if (this.allSelected.selected) {
      formData.controls.deviceId.patchValue([...this.deviceData.map(obj => obj.deviceId), 0]);
    }
    else {
      formData.controls.deviceId.patchValue([]);
    }
  }


  toggleAllSelectionCoin(formData) {

    if (this.allSelected1.selected) {
      formData.controls.coinId.patchValue([...this.coinData.map(obj => obj.coinId), 0]);
    }
    else {
      formData.controls.coinId.patchValue([]);
    }
  }
  toggleAllSelectionCoin1(formData) {
    console.log("formData.controls.coinId===", formData.controls.coinId);
    if (this.allSelected2.selected) {
      formData.controls.coinId.patchValue([...this.coinData.map(obj => {
        if (!(obj.zoneId)) {
          return obj.coinId
        }
      }
      ), 0]);
    }
    else {
      formData.controls.coinId.patchValue([]);
    }
  }


  toggleAllSelectionZone(formData) {
    if (this.allSelected3.selected) {
      formData.controls.zoneId.patchValue([...this.zoneData.map(obj => obj._id), 0]);
    }
    else {
      formData.controls.zoneId.patchValue([]);
    }
  }
  toggleAllSelectionZone1(formData) {
    if (this.allSelected4.selected) {
      formData.controls.zoneName.patchValue([...this.zoneData.map(obj => {
        if (!obj.mainZoneId) {
          return obj.zoneName;
        }

      }), 0]);
    }
    else {
      formData.controls.zoneName.patchValue([]);
    }
  }

  openInfo(data) {
    console.log("data==", data);
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = 'fit-content';
    dialogConfig.width = 'fit-content';
    dialogConfig.data = {
      type: data
    }
    const dialogRef = this.dialog.open(SettingInfoComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      if (data == 'timeDelay' || data == 'find-inactive') {
        this.refreshDevice();
      }
      else if (data == 'coin' || data == 'max-find') {
        this.refreshCoin();
      }
      else if (data == 'coin-cat') {
        this.refreshCoin();
        this.getZoneDetails();
      }
      else {
        this.getZoneDetails();
      }
    });
  }

  getZoneDetails() {
    this.api.getZone().then((res: any) => {
      console.log("zone details response==", res);
      this.zoneData = [];
      if (res.status) {
        this.zoneData = res.success;
      }
      else {
        this.zoneData = [];
      }
    })
  }
}
