import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../../services/api.service';
import { LoginAuthService } from '../../services/login-auth.service';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-offline-device',
  templateUrl: './offline-device.component.html',
  styleUrls: ['./offline-device.component.css']
})
export class OfflineDeviceComponent implements OnInit {
  @ViewChild('sort1') sort1: MatSort;
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('sort2') sort2: MatSort;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('sort3') sort3: MatSort;
  @ViewChild('paginator3') paginator3: MatPaginator;
  fileName: any = ''
  offlineDeviceData: any = []
  offlineGatewayData: any = []
  offlineCoinData: any = []
  dataSource0: any = [];
  dataSource1: any = [];
  dataSource2: any = [];
  displayedColumns1 = ['i', 'deviceId', 'deviceName', 'updatedAt'];
  displayedColumns2 = ['i', 'gatewayName', 'gatewayId', 'updatedAt'];
  displayedColumns3 = ['i', 'coinId', 'coinName', 'gatewayId', 'updatedAt'];
  interval : any;
  limit:any=10
  offset:any=0
  type:any='all'
  currentPageLength1:any=10
  currentPageSize1:any=10
  currentPageLength2:any=10
  currentPageSize2:any=10
  currentPageLength3:any=10
  currentPageSize3:any=10
  constructor(
    private login: LoginAuthService,
    private api: ApiService,
    private general: GeneralService
  ) { }

  ngOnInit(): void {
    this.refreshOfflineDeviceList();
    this.general.deviceChanges.subscribe((res) => {
      if (res) {
        this.refreshOfflineDeviceList(this.limit,this.offset,this.type);
      }
    });
    this.login.loginCheckData.subscribe(res=>{
      if(!res.other){
        this.clearTimeInterval()
      }
    })
    this.interval = setInterval(()=>{
      this.refreshOfflineDeviceList(this.limit,this.offset,this.type)
    },10000)
  }

  ngOnDestroy() {
    this.clearTimeInterval()
  }

  clearTimeInterval(){
    clearInterval(this.interval);
  }

  refreshOfflineDeviceList(limit=10,offset=0,type='all') {
    var data={
      limit:limit,
      offset:offset,
      filterType:type
    }
    console.log("data===",data)
    this.api.getOfflineDevice(data).then((res: any) => {

      console.log("getOfflineDevice res====", res);
      this.offlineDeviceData = []
      this.offlineGatewayData = []
      this.offlineCoinData = []
      if (res.status) {
        this.offlineDeviceData = res.success.device.offlineDevice
        this.offlineGatewayData = res.success.gateway.offlineGateway
        this.offlineCoinData = res.success.coin.offlineCoin
      
        if(type=='all'){
          this.currentPageLength1=res.success.device.offlineDeviceCount
          this.currentPageLength2=res.success.gateway.offlineGatewayCount
          this.currentPageLength3=res.success.coin.offlineCoinCount
        }
        if(type=='devices'){
          this.currentPageLength1=res.success.device.offlineDeviceCount
        }
        if(type=='gateway'){
          this.currentPageLength2=res.success.gateway.offlineGatewayCount
        }
        if(type=='coin'){
          this.currentPageLength3=res.success.coin.offlineCoinCount
        }
     
        this.dataSource0 = new MatTableDataSource(this.offlineDeviceData);
        this.dataSource1 = new MatTableDataSource(this.offlineGatewayData);
        this.dataSource2 = new MatTableDataSource(this.offlineCoinData);

        setTimeout(() => {
          // this.dataSource0.paginator = this.paginator1
          this.dataSource0.sort = this.sort1
          // this.dataSource1.paginator = this.paginator2
          this.dataSource1.sort = this.sort2
          // this.dataSource2.paginator = this.paginator3
          this.dataSource2.sort = this.sort3
        })
      }
      else { }

    }).catch((err: any) => {
      console.log("error===", err)
    })
  }

  download(type) {
    this.fileName = ''
    var data={
      timeZoneOffset:this.general.getZone()
    }
    if (type == 'device') {
      this.fileName = "Offline Device"
      console.log("data=",data)
      this.api.downloadOfflineDevice(data,this.fileName).then((res: any) => {
        console.log("offline device download==", res)
        if (res) {
          this.general.loadingFreez.next({ status: false, msg: "Downloaded Successfully!!" })
        }
        else {
          this.general.openSnackBar(res.success == false ? res.message : res.success, '')
        }
      }).catch((err: any) => {
        console.log("error==", err)
      })
    }
    else if (type == 'gateway') {
      this.fileName = "Offline Gateway"
      console.log("data=",data)
      this.api.downloadOfflineGateways(data,this.fileName).then((res: any) => {
        console.log("offline gateway download==", res)
        if (res) {
          this.general.loadingFreez.next({ status: false, msg: "Downloaded Successfully!!" })
        }
        else {
          this.general.openSnackBar(res.success == false ? res.message : res.success, '')
        }
      }).catch((err: any) => {
        console.log("error==", err)
      })
    }
    else if (type == 'coin') {
      this.fileName = "Offline coins"
      console.log("data=",data)
      this.api.downloadOfflineCoin(data,this.fileName).then((res: any) => {
        console.log("offline coins download==", res)
        if (res) {
          this.general.loadingFreez.next({ status: false, msg: "Downloaded Successfully!!" })
        }
        else {
          this.general.openSnackBar(res.success == false ? res.message : res.success, '')
        }
      }).catch((err: any) => {
        console.log("error==", err)
      })
    }
  }

  getUpdate(event,type) {  
    this.type=type
    this.limit = event.pageSize
    this.offset = event.pageIndex * event.pageSize
    this.refreshOfflineDeviceList(this.limit, this.offset,this.type)
    
  }

}
