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
  @ViewChild('allSelected5') private allSelected5: MatOption
  @ViewChild('allSelected6') private allSelected6: MatOption
  @ViewChild('allSelected7') private allSelected7: MatOption
  @ViewChild('fileInput') fileInput: ElementRef;
  dateTimeForm: FormGroup;
  distanceForm: FormGroup;
  timeDelay: FormGroup;
  inactivityFind: FormGroup;
  inactivityCoin: FormGroup;
  groupCoinForm: FormGroup;
  coinCategory: FormGroup;
  zoneForm: FormGroup;
  zoneSTDForm: FormGroup;
  maxFindForm: FormGroup;
  groupRegister: FormGroup;
  createServiceType: FormGroup;
  coinData: any = [];
  coinDataTemp: any = [];
  coinDataZone: any = [];
  deviceData: any = [];
  groupData: any = [];
  twoStepAuthStatus: any = [];
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
    this.getZoneDetails();
    this.getGroups();

  }
  createForm() {
    // this.dateTimeForm=this.fb.group({
    //   dateTimeFormat:['',Validators.required]
    // })

    this.distanceForm = this.fb.group({
      range: ['', Validators.required]
    })

    this.timeDelay = this.fb.group({
      deviceId: ['', Validators.required],
      timeDelay: ['', Validators.required],

    });

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

    this.groupRegister = this.fb.group({
      groupName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]+(?: [a-zA-Z0-9_]+)*$')]]
    });


    this.groupCoinForm = this.fb.group({
      coinId: ['', Validators.required],
      groupId: ['', Validators.required],

    });

    this.coinCategory = this.fb.group({
      coinId: ['', Validators.required],
      zoneId: ['', Validators.required],

    });

    // this.zoneForm = this.fb.group({
    //   zoneName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]+(?: [a-zA-Z0-9_]+)*$')]],
    //   standardTime: ['', Validators.required]
    // });
    this.zoneSTDForm = this.fb.group({
      zoneId: ['', Validators.required],
      standardTime: ['',[ Validators.required ,Validators.min(0)]]
    });

    this.maxFindForm = this.fb.group({
      coinId: ['', Validators.required],
      maxFindAsset: ['', Validators.required],
    });

    this.createServiceType = this.fb.group({
      zoneId: ['', Validators.required],
      serviceName: ['', [Validators.required, Validators.pattern('^[a-zA-Z0-9_]+(?: [a-zA-Z0-9_]+)*$')]]
    });

    this.uploadForm = this.fb.group({
      fileData: null,
      type: 'logo',
    });
  }

  refreshSetting() {
    this.api.refreshSettings().then((res: any) => {

      console.log("refresh Settings====", res);
      if (res.status) {
        this.distanceForm.patchValue({
          range: res.success.range
        })
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
        console.log("this.distanceForm==", this.distanceForm);
      }
      else {
        this.general.openSnackBar(res.success, '');
      }



    }).catch((err: any) => {
      console.log("error===", err);
    })
  }

  refreshCoin() {
    var data=''
    this.api.getCoinData(data).then((res: any) => {

      console.log("coin submit====", res);
      this.coinData = [];
      if (res.status) {
        this.coinData = res.success
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
    var data=''
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


  // onSubmitDateTime(data){
  //   console.log("data===",data)
  //   try{
  //     if(this.dateTimeForm.valid){
  //       this.api.dateTimeFormat(data).then((res:any)=>{
  //         console.log("dateTimeFormat res===",res)
  //         if(res.status){
  //           this.general.openSnackBar('Date Time Format updated Successfully','')
  //           this.dateTimeForm.reset()
  //         }
  //       }).catch((err)=>{
  //         console.log("err=",err)
  //       })
  //     }

  //   }
  //   catch(error){
  //     console.log("error==",error)
  //   }
  // }

  onSubmitDistanceForm(data) {
    console.log("data===", data);
    try {
      if (this.distanceForm.valid) {
        this.api.setRange(data).then((res: any) => {
          console.log("range res===", res);
          if (res.status) {
            this.distanceForm.reset();
            this.general.openSnackBar(res.success, '');
            this.refreshSetting();
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

  onSubmitTimeDelay(data) {
    data.deviceId = this.general.filterArray(data.deviceId);
    console.log("onSubmitTimeDelay data==", data);
;
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

  onSubmitInactivityFind(data) {
    data.deviceId = this.general.filterArray(data.deviceId)

    try {
      if (this.inactivityFind.valid) {
        data.sms = data.alert == 'sms' ? true : false;
        data.email = data.alert == 'email' ? true : false;
        console.log("onSubmitInactivityFind data==", data)
        this.api.deviceInactivity(data).then((res: any) => {

          console.log("inactivity find res===", res);
          if (res.status) {
            this.inactivityFind.reset();
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

  onSubmitInactivityCoin(data) {
    data.coinId = this.general.filterArray(data.coinId);
    console.log("onSubmitInactivityCoin data==", data);
    data.sms = data.alert == 'sms' ? true : false;
    data.email = data.alert == 'email' ? true : false;
    try {
      if (this.inactivityCoin.valid) {
        this.api.coinInactivity(data).then((res: any) => {

          console.log("inactivity coin res===", res);
          if (res.status) {
            this.inactivityCoin.reset();
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
      else { }
    }
    catch (error) {
      console.log("error==", error);
    }

  }

  onSubmitMaxFindForm(data) {
    data.coinId = this.general.filterArray(data.coinId);
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

  onSumbitCoinCategory(data) {
    data.coinId = this.general.filterArray(data.coinId);
    console.log("onSumbitCoinCategory data==", data);

    try {
      if (this.coinCategory.valid) {
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
      else { };
    }
    catch (error) {
      console.log("error==", error);
    }


  }

  onSubmitZoneForm(data) {
    console.log("onSubmitZoneForm data==", data)

    try {
      if (this.zoneForm.valid) {
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
      else { }
    }
    catch (error) {
      console.log("error==", error);
    }
  }
  onSubmitZoneSTDForm(data) {
    data.zoneId = this.general.filterArray(data.zoneId);
    console.log("onSubmitZoneSTDForm data==", data)
    try {
      if (this.zoneSTDForm.valid) {
        this.api.updateZoneInfo(data).then((res: any) => {

          console.log("zone setting res===", res);
          if (res.status) {
            this.zoneSTDForm.reset();
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
      else { }
    }
    catch (error) {
      console.log("error==", error);
    }
  }

  onSubmitGroup(data) {
    console.log("onSubmitZoneForm data==", data);

    try {
      if (this.groupRegister.valid) {
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

    console.log("onSubmitGroupCoinForm data==", data);
    try {
      if (this.groupCoinForm.valid) {
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
      else { }
    }
    catch (error) {
      console.log("error==", error);
    }
  }

  onSubmitServiceType(data) {
    data.zoneId = this.general.filterArray(data.zoneId);

    console.log("onSubmitServiceTye data==", data);
    try {
      if (this.createServiceType.valid) {
        this.api.createServiceType(data).then((res: any) => {

          console.log("Group coin res===", res);
          if (res.status) {
            this.createServiceType.reset();
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
      else { }
    }
    catch (error) {
      console.log("error==", error);
    }
  }
;
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

    // console.log("File Change event",files);
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
        // data.fileData.filename=this.general.encrypt(data.fileData.filename)
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

  toggleAllSelectionCoins(formData) {
    if (this.allSelected1.selected) {
      formData.controls.coinId.patchValue([...this.coinData.map(obj => obj.coinId), 0]);
    }
    else {
      formData.controls.coinId.patchValue([]);
    }
  }

  toggleAllSelectionDevice2(formData) {
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
  toggleAllSelectionCoin1(formData) {

    if (this.allSelected4.selected) {
      formData.controls.coinId.patchValue([...this.coinData.map(obj => obj.coinId), 0]);
    }
    else {
      formData.controls.coinId.patchValue([]);
    }
  }

  toggleAllSelectionCoin2(formData) {
    if (this.allSelected5.selected) {
      formData.controls.coinId.patchValue([...this.coinData.map(obj => obj.coinId), 0]);
    }
    else {
      formData.controls.coinId.patchValue([]);
    }
  }

  toggleAllSelectionZone(formData) {
    if (this.allSelected6.selected) {
      formData.controls.zoneId.patchValue([...this.zoneData.map(obj => obj._id), 0]);
    }
    else {
      formData.controls.zoneId.patchValue([]);
    }
  }
  toggleAllSelectionZone1(formData) {
    if (this.allSelected7.selected) {
      formData.controls.zoneId.patchValue([...this.zoneData.map(obj => obj._id), 0]);
    }
    else {
      formData.controls.zoneId.patchValue([]);
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
      else if (data == 'groupName' || data == 'coinGrp') {
        this.refreshCoin();
        this.getGroups();
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

  getGroups() {
    this.api.getGroup().then((res: any) => {

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

}
