import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../services/api.service';
import { GeneralService } from '../services/general.service';
import { LoginAuthService } from '../services/login-auth.service';
import { GroupingComponent } from '../grouping/grouping.component';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';

@Component({
  selector: 'app-geofence-dashboard',
  templateUrl: './geofence-dashboard.component.html',
  styleUrls: ['./geofence-dashboard.component.css']
})
export class GeofenceDashboardComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  deviceData: any = [];
  dataSource: any = [];
  displayedColumns = ['i', 'deviceId', 'deviceName', 'coinId', 'updatedOnLoc', 'geofenceStatus'];
  geoFencestatus: boolean = false;
  limit: any = 10;
  offset: any = 0;
  currentPageLength: any = 10;
  currentPageSize: any = 10;
  interval: any;
  searchKey:string='';
  constructor(
    public general: GeneralService,
    private api: ApiService,
    public login: LoginAuthService,
    public dialog: MatDialog,
  ) { }

  ngOnInit(): void {
    this.refreshGeofence();
    this.login.loginCheckData.subscribe(res => {
      if (!res.other) {
        this.clearTimeInterval();
      }
    });
    this.interval = setInterval(() => {
      // this.refreshGeofence(this.limit,this.offset);
    }, 10000);
  }

  ngOnDestroy() {
    this.clearTimeInterval();
  }

  clearTimeInterval() {
    clearInterval(this.interval);
  }

  status(data) {
    this.deviceData.forEach((element, index) => {
      if (element.deviceId == data.deviceId) {
        this.deviceData[index].geoFencestatus = true
      }
      else {
        this.deviceData[index].geofenceStatus = false
      }
    });

  }
  refreshGeofence(limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      var data = {
        limit: limit,
        offset: offset
      }
      this.api.getDeviceGeofence(data).then((res: any) => {
        console.log("getDeviceGeofence res==", res);
        if (res.status) {
          this.currentPageLength = parseInt(res.totalLength);
          this.deviceData = res.success;
             this.dataSource = new MatTableDataSource(this.deviceData);
          setTimeout(() => {
            this.dataSource.sort = this.sort;
          })
        }
        resolve(res);
      }).catch(err => {
        console.log("error==", err);
        reject(err);
      })
    })
  }

  search(a) {
    this.searchKey=a;
    this.dataSource = new MatTableDataSource(this.deviceData);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.filter = a.trim().toLowerCase();
    })
  }

  getUpdate(event) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.refreshGeofence(this.limit, this.offset).then(()=>{
      this.search(this.searchKey);
    })
  }

  openDailog(data) {
    data.type = "group";
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '90vh';
    dialogConfig.width = '90vw';
    dialogConfig.data = {
      data: data
    }
    const dialogRef = this.dialog.open(GroupingComponent, dialogConfig);
    dialogRef.afterClosed().subscribe(result => {
    })
  }

  openInfo(data) {
    console.log("data==", data);
    data.type = "non-group";
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '50vh';
    dialogConfig.width = '30vw';
    dialogConfig.data = {
      data: data
    }
    const dialogRef = this.dialog.open(GroupingComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {

    });
  }
}
