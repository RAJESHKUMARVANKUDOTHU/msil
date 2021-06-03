import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../services/api.service';
import { LoginAuthService } from '../services/login-auth.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatOption } from '@angular/material/core';
import { GeneralService } from '../services/general.service';

@Component({
  selector: 'app-geofence',
  templateUrl: './geofence.component.html',
  styleUrls: ['./geofence.component.css']
})
export class GeofenceComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  @ViewChild('allSelected') private allSelected: MatOption
  @ViewChild('allSelected1') private allSelected1: MatOption
  geofenceForm: FormGroup
  geoFenceData: any = []
  coinData: any
  deviceData: any
  dataSource: any = []
  displayedColumns = ['i', 'deviceId', 'deviceName', 'location', 'sms', 'email','delete']
  limit: any = 10
  offset: any = 0
  currentPageLength: any = 10
  currentPageSize: any = 10
  constructor(
    private login: LoginAuthService,
    private api: ApiService,
    public general: GeneralService,
    private fb: FormBuilder
  ) { }

  ngOnInit(): void {
    this.geofenceForm = this.fb.group({
      alert: ['', Validators.required],
      deviceId: ['', Validators.required],
      coin: ['', Validators.required]
    })

    this.refreshDevice()
    this.refreshCoin()
    this.getGeofence()
  }

  refreshCoin() {
    var data = ''
    this.api.getCoinData(data).then((res: any) => {
      this.coinData = []
      if (res.status) {
        this.coinData = res.success
        console.log("this.coinData====", this.coinData);

      }
      else { }
    }).catch((err: any) => {
      console.log("error===", err)
    })
  }

  refreshDevice() {
    var data = ''
    this.api.getDeviceData(data).then((res: any) => {
      this.deviceData = []
      console.log("find submit====", res);
      if (res.status) {
        this.deviceData = res.success
      }
      else { }
    }).catch((err: any) => {
      console.log("error===", err)
    })
  }
  
  toggleAllSelectionDevice(formData) {
    if (this.allSelected.selected) {
      formData.controls.deviceId.patchValue([...this.deviceData.map(obj => obj.deviceId), 0])
    }
    else {
      formData.controls.deviceId.patchValue([])
    }
  }

  toggleAllSelectionCoin(formData) {
    if (this.allSelected1.selected) {
      formData.controls.coin.patchValue([...this.coinData.map(obj => obj._id), 0])
    }
    else {
      formData.controls.coin.patchValue([])
    }
  }

  submit(value) {
    var data = {
      sms: value.alert == 'sms' ? true : false,
      email: value.alert == 'email' ? true : false,
      deviceId: this.general.filterArray(value.deviceId),
      coin: this.general.filterArray(value.coin)
    }
    console.log("geofence Data==", data)
    this.api.geofenceSetting(data).then((res: any) => {
      if (res.status) {
        console.log("geofence setting res==", res);
        this.general.openSnackBar(res.message, '')
        this.geofenceForm.reset()
        this.getGeofence(this.limit, this.offset);
      }
      else {
        this.general.openSnackBar(res.message, '')
      }
    }).catch((err: any) => {
      console.log("err", err)
    })
  }

  getGeofence(limit = 10, offset = 0) {
    var data = {
      limit: limit,
      offset: offset
    }
    console.log("data==",data)
    this.api.getGeofenceSetting(data).then((res: any) => {
      this.geoFenceData = []
      if (res.status) {
        this.currentPageLength = parseInt(res.totalLength)

        console.log("geofence setting res==", res)
        this.geoFenceData = res.success
        this.dataSource = new MatTableDataSource(this.geoFenceData);

        setTimeout(() => {
          this.dataSource.sort = this.sort;
          // this.dataSource.paginator = this.paginator
        })
      }
      else { }


    }).catch(err => {
      console.log("error===", err);

    })
  }
  delete(data){
    if(confirm("Are you sure that you want to perform this operation ?")){
      this.api.deleteGoefenceSetting(data).then((res:any)=>{
        console.log("delete  geofence setting res",res)
        if(res.status){
          this.general.openSnackBar(res.success, '')
          this.getGeofence(this.limit,this.offset)
        }
        else{ }
      }).catch(err=>{
        console.log("err==",err)
      })
    }
    else{
      this.getGeofence(this.limit,this.offset)
    }
  }

  search(a) {
    console.log(a)
    this.dataSource = new MatTableDataSource(this.geoFenceData);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
      this.dataSource.filter = a.trim().toLowerCase()
    })
  }
  getUpdate(event) {

    this.limit = event.pageSize
    this.offset = event.pageIndex * event.pageSize
    this.getGeofence(this.limit, this.offset)
  }
}
