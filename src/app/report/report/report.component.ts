import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { LoginAuthService } from '../../services/login-auth.service';
import { GeneralService } from '../../services/general.service'
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { VehiclewisereportComponent } from '../../report/vehiclewisereport/vehiclewisereport.component';
import { LocationReportComponent } from '../../report/location-report/location-report.component';
import { ZoneReportComponent } from '../../report/zone-report/zone-report.component';
import * as moment from 'moment';
@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {
  genericReport: FormGroup;
  customReport: FormGroup;
  vehicleReport: FormGroup;
  zoneReport: FormGroup;
  locationReport: FormGroup;
  deviceData: any = [];
  coinData: any = [];
  zoneData: any = [];
  dayError: boolean;
  dayError1: boolean;
  dayError2: boolean;
  loginData:any;
  constructor(
    private fb: FormBuilder,
    private login: LoginAuthService,
    private api: ApiService,
    private general: GeneralService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.loginData = this.login.getLoginDetails();
    this.vehicleReport = this.fb.group({
      type: ['', Validators.required],
      days: [''],
      deviceId: [''],
      deviceName: [''],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required]
    },
      {
        validators: this.formValidate()
      });

    this.locationReport = this.fb.group({
      // type: ['', Validators.required],
      days: [''],
      fromDate: ['', Validators.required],
      toDate: ['', Validators.required],
      coinId: ['', Validators.required],
    });
    this.ifEnbaleZone();
    this.patchLocationDate();
    this.patchVehicleDate();
  }

  ifEnbaleZone(){
    if(this.loginData?.enableZone){
      this.zoneReport = this.fb.group({
        type: ['', Validators.required],
        days: [''],
        fromDate: ['', Validators.required],
        toDate: ['', Validators.required],
        zoneId: [''],
        coinId: [''],
        dayType: [''],
        weekDay: ['']
      },
        {
          validators: this.formValidate2()
        });
      this.patchZoneDate();
      this.getZoneDetails();
    }
  }

  patchVehicleDate() {
    this.vehicleReport.get('days').valueChanges.subscribe((value) => {
      var date = new Date();
      date.setDate(date.getDate() - parseInt(value));
      this.vehicleReport.controls['fromDate'].patchValue((date));
    });
    this.vehicleReport.get('days').valueChanges.subscribe(() => {
      var date = new Date();
      date.setDate(date.getDate());
      this.vehicleReport.controls['toDate'].patchValue((date));
    });
  }

  patchLocationDate() {
    this.locationReport.get('days').valueChanges.subscribe((value) => {
      var date = new Date()
      date.setDate(date.getDate() - parseInt(value));
      this.locationReport.controls['fromDate'].patchValue((date));
    });
    this.locationReport.get('days').valueChanges.subscribe(() => {
      var date = new Date()
      date.setDate(date.getDate());
      this.locationReport.controls['toDate'].patchValue((date));
    });
  }

  patchZoneDate() {
    this.zoneReport.get('days').valueChanges.subscribe((value) => {
      var date = new Date();
      date.setDate(date.getDate() - parseInt(value));
      this.zoneReport.controls['fromDate'].patchValue((date));
    });
    this.zoneReport.get('days').valueChanges.subscribe(() => {
      var date = new Date();
      date.setDate(date.getDate());
      this.zoneReport.controls['toDate'].patchValue((date));
    });
  }

  refreshCoin() {
    var data = '';
    this.api.getCoinData(data).then((res: any) => {
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
    var data = '';
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
      console.log("error===", err);
    })
  }

  getZoneDetails() {
    this.api.getZone().then((res: any) => {
      console.log("zone details response==", res)
      this.zoneData = [];
      if (res.status) {
        this.zoneData = res.success;
      }
      else {
        this.zoneData = [];
      }
    })
  }

  formValidate() {
    return (formGroup: FormGroup) => {
      const type = formGroup.get('type');
      if (formGroup.get('type').value != '') {
        if (type.value == "1") {
          formGroup.get('deviceId').setErrors(null)
          formGroup.get('deviceName').setErrors(null)
          return
        }
        if (type.value == "2" || type.value == "3") {
          let value = formGroup.get('deviceName').value?.toString().replace(/\s\s+/g, '');
          if (value != '' && value != undefined) {
            formGroup.get('deviceId').setErrors(null)
            formGroup.get('deviceName').setErrors(null)
            return
          }
          else {
            formGroup.get('deviceName').setErrors(
              {
                required: true
              })
            return
          }
        }
      }
    }
  }

  formValidate2() {
    return (formGroup: FormGroup) => {
      const type = formGroup.get('type');
      if (formGroup.get('type').value != '') {
        if (type.value == "1") {
          let value = formGroup.get('zoneId').value?.toString().replace(/\s\s+/g, '');
          if (value != '' && value != undefined) {
            console.log("valuee ===", value);
            formGroup.get('coinId').setErrors(null)
            formGroup.get('zoneId').setErrors(null)
            formGroup.get('dayType').setErrors(null)
            formGroup.get('weekDay').setErrors(null)
            return
          }
          else {
            formGroup.get('zoneId').setErrors(
              {
                required: true
              })
            return
          }
        }
        if (type.value == "2" || type.value == "4") {
          formGroup.get('coinId').setErrors(null)
          formGroup.get('zoneId').setErrors(null)
          formGroup.get('dayType').setErrors(null)
          formGroup.get('weekDay').setErrors(null)
          return
        }
        if (type.value == "3" || type.value == "5") {
          if (formGroup.get('dayType').value != '' && formGroup.get('dayType').value != null) {
            if (formGroup.get('dayType').value == 'day') {
              formGroup.get('coinId').setErrors(null)
              formGroup.get('zoneId').setErrors(null)
              formGroup.get('dayType').setErrors(null)
              formGroup.get('weekDay').setErrors(null)
              return
            }
            else if (formGroup.get('dayType').value == 'week') {
              console.log("weekday==", formGroup.get('weekDay').value);

              if (formGroup.get('weekDay').value != '') {
                formGroup.get('coinId').setErrors(null)
                formGroup.get('zoneId').setErrors(null)
                formGroup.get('dayType').setErrors(null)
                formGroup.get('weekDay').setErrors(null)
                return
              }
              else {
                formGroup.get('weekDay').setErrors(
                  {
                    required: true
                  })
                return
              }
            }
          }
          else {
            formGroup.get('dayType').setErrors(
              {
                required: true
              })
            return
          }
        }
      }
    }
  }

  onsubmitVehicleReport(data) {
    var date1 = moment(data.fromDate, 'DD-MM-YYYY');
    var date2 = moment(data.toDate, 'DD-MM-YYYY');
    var diff = date2.diff(date1, 'days');
    console.log("vehicle data==", data);
    if (diff >= 0 && diff <= 30) {
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.height = '90vh';
      dialogConfig.width = '90vw';
      dialogConfig.data = {
        data: data
      }
      const dialogRef = this.dialog.open(VehiclewisereportComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        this.vehicleReport.reset();
      })
    }
    else {
      this.dayError = true;
    }
  }

  onsubmitLocationReport(data) {
    data.coinId = this.coinData.filter((obj) => {
      if (data.coinId == obj.coinName) {
        return obj;
      }
    });
    console.log("datataaa==", data);
    var date1 = moment(data.fromDate, 'DD-MM-YYYY');
    var date2 = moment(data.toDate, 'DD-MM-YYYY');
    var diff = date2.diff(date1, 'days');
    console.log("location data==", data, diff)
    if (diff >= 0 && diff <= 30) {
      this.dayError1 = false;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.height = '90vh';
      dialogConfig.width = '90vw';
      dialogConfig.data = {
        data: data
      }
      const dialogRef = this.dialog.open(LocationReportComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        this.locationReport.reset();
      })
    }
    else {
      this.dayError1 = true;
    }
  }

  onsubmitZoneReport(data) {
    console.log("zone data==", data)
    var date1 = moment(data.fromDate, 'DD-MM-YYYY');
    var date2 = moment(data.toDate, 'DD-MM-YYYY');
    var diff = date2.diff(date1, 'days');
    if (diff >= 0 && diff <= 30) {
      this.dayError2 = false;
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.height = '90vh';
      dialogConfig.width = '90vw';
      dialogConfig.data = {
        data: data
      }
      const dialogRef = this.dialog.open(ZoneReportComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        this.zoneReport.reset();
      })
    }
    else {
      this.dayError2 = true;
    }
  }

  vehicleNames(event) {
    var data = {
      hint: event.target.value.toString(),
    }
    this.deviceData = [];
    this.api.vehicleAutoPopulate(data).then((res: any) => {
      console.log("res===", res);
      if (res.status) {
        this.deviceData = res.success;
      }
    })
  }

  coinNames(event) {
    var data = {
      hint: event.target.value.toString(),
    }
    this.coinData = [];
    this.api.coinAutoPopulate(data).then((res: any) => {
      console.log("res===", res);
      if (res.status) {
        this.coinData = res.success;
      }
    })
  }

  // zoneNames(event){
  //   var data={
  //     hint: event.target.value.toString(),
  //   }
  //   this.api.zoneAutoPopulate(data).then((res:any)=>{
  //       console.log("res===",res);
  //       if(res.status){
  //         this.zoneData=res.success;
  //       }
  //   })
  // }

}
