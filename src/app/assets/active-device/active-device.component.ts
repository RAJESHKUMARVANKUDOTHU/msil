import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../../services/api.service';
import { LoginAuthService } from '../../services/login-auth.service';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-active-device',
  templateUrl: './active-device.component.html',
  styleUrls: ['./active-device.component.css']
})
export class ActiveDeviceComponent implements OnInit {
  @ViewChild('sort1') sort1: MatSort;
  @ViewChild('paginator1') paginator1: MatPaginator;
  @ViewChild('sort2') sort2: MatSort;
  @ViewChild('paginator2') paginator2: MatPaginator;
  @ViewChild('sort3') sort3: MatSort;
  @ViewChild('paginator3') paginator3: MatPaginator;
  loginData:any;
  activeDeviceData: any = [];
  activeGatewayData: any = [];
  activeCoinData: any = [];
  dataSource0: any = [];
  dataSource1: any = [];
  dataSource2: any = [];
  fileName: any = '';
  displayedColumns1 = ['i', 'deviceId', 'deviceName', 'updatedAt'];
  displayedColumns2 = ['i', 'gatewayId', 'gatewayName','gatewayType', 'updatedAt'];
  displayedColumns3 = ['i', 'coinId', 'coinName', 'zoneId', 'gatewayId', 'updatedAt'];
  interval: any;
  limit: any = 10;
  offset: any = 0;
  type: any = 'all';
  currentPageLength1: any = 10;
  currentPageSize1: any = 10;
  currentPageLength2: any = 10;
  currentPageSize2: any = 10;
  currentPageLength3: any = 10;
  currentPageSize3: any = 10;
  constructor(
    private login: LoginAuthService,
    private api: ApiService,
    private general: GeneralService
  ) { }

  ngOnInit(): void {
    this.loginData = this.login.getLoginDetails();
    this.refreshActiveDeviceList();
    this.general.deviceChanges.subscribe((res) => {
      if (res) {
        this.refreshActiveDeviceList(this.limit, this.offset, this.type);
      }
    })
    this.login.loginCheckData.subscribe(res => {
      if (!res.other) {
        this.clearTimeInterval();
      }
    })
    this.interval = setInterval(() => {
      this.refreshActiveDeviceList(this.limit, this.offset, this.type);
    }, 10000)
  }

  ngOnDestroy() {
    this.clearTimeInterval();
  }

  clearTimeInterval() {
    clearInterval(this.interval);
  }


  refreshActiveDeviceList(limit = 10, offset = 0, type = 'all') {
    var data = {
      limit: limit,
      offset: offset,
      filterType: type
    }
    this.api.getOnlineDevice(data).then((res: any) => {
      console.log("getOnlineDevice res====", res);
      this.activeDeviceData = [];
      this.activeGatewayData = [];
      this.activeCoinData = [];
      if (res.status) {
        this.activeDeviceData = res.success.device.onlineDevice;
        this.activeGatewayData = res.success.gateway.onlineGateway;
        this.activeCoinData = res.success.coin.onlineCoin;
        if (type == 'all') {
          this.currentPageLength1 = res.success.device.onlineDeviceCount;
          this.currentPageLength2 = res.success.gateway.onlineGatewayCount;
          this.currentPageLength3 = res.success.coin.onlineCoinCount;
        }
        if (type == 'devices') {
          this.currentPageLength1 = res.success.device.onlineDeviceCount;
        }
        if (type == 'gateway') {
          this.currentPageLength2 = res.success.device.onlineDeviceCount;
        }
        if (type == 'coin') {
          this.currentPageLength3 = res.success.device.onlineDeviceCount;
        }
        this.dataSource0 = new MatTableDataSource(this.activeDeviceData);
        this.dataSource1 = new MatTableDataSource(this.activeGatewayData);
        this.dataSource2 = new MatTableDataSource(this.activeCoinData);

        setTimeout(() => {
          this.dataSource0.sort = this.sort1;
          this.dataSource1.sort = this.sort2;
          this.dataSource2.sort = this.sort3;
        })
      }
    }).catch((err: any) => {
      console.log("error===", err);
    })
  }

  download(type) {
    this.fileName = '';
    var data = {
      timeZoneOffset: this.general.getZone()
    }
    if (type == 'device') {
      this.fileName = "Online Finds";
      this.api.downloadOnlineDevice(data, this.fileName).then((res: any) => {
        console.log("online device download==", res);
        if (res) {
          this.general.loadingFreez.next({ status: false, msg: "Downloaded Successfully!!" });
        }
        else {
          this.general.openSnackBar(res.success == false ? res.message : res.success, '');
        }
      }).catch((err: any) => {
        console.log("error==", err);
      })
    }
    else if (type == 'gateway') {
      this.fileName = "Online Gateways";
      this.api.downloadOnlineGateways(data, this.fileName).then((res: any) => {
        console.log("Online gateway download==", res);
        if (res) {
          this.general.loadingFreez.next({ status: false, msg: "Downloaded Successfully!!" });
        }
        else {
          this.general.openSnackBar(res.success == false ? res.message : res.success, '');
        }
      }).catch((err: any) => {
        console.log("error==", err);
      })
    }
    else if (type == 'coin') {
      this.fileName = "Online Coins";
      this.api.downloadOnlineCoin(data, this.fileName).then((res: any) => {
        console.log("Online coins download==", res);
        if (res) {
          this.general.loadingFreez.next({ status: false, msg: "Downloaded Successfully!!" });
        }
        else {
          this.general.openSnackBar(res.success == false ? res.message : res.success, '');
        }
      }).catch((err: any) => {
        console.log("error==", err);
      })
    }
  }
  getUpdate(event, type) {
    this.type = type;
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.refreshActiveDeviceList(this.limit, this.offset, this.type);
  }
}

