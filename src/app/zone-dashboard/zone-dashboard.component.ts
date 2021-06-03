import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { ApiService } from '../services/api.service';
import { GeneralService } from '../services/general.service';
import { LoginAuthService } from '../services/login-auth.service';

@Component({
  selector: 'app-zone-dashboard',
  templateUrl: './zone-dashboard.component.html',
  styleUrls: ['./zone-dashboard.component.css']
})
export class ZoneDashboardComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  zoneData: any = []
  dataSource: any = [];
  displayedColumns = ['i', 'deviceId', 'deviceName', 'zoneName', 'inTime', 'outTime', 'totalTime'];
  interval: any;
  limit: any = 10
  offset: any = 0
  currentPageLength: any = 10
  currentPageSize: any = 10
  constructor(
    public general: GeneralService,
    private api: ApiService,
    private login: LoginAuthService,
  ) { }

  ngOnInit(): void {
    this.refreshZoneData();
    this.login.loginCheckData.subscribe(res => {
      if (!res.other) {
        this.clearTimeInterval()
      }
    });
    this.interval = setInterval(() => {
      this.refreshZoneData(this.limit, this.offset);
    }, 10000);
  }

  ngOnDestroy() {
    this.clearTimeInterval()
  }

  clearTimeInterval() {
    clearInterval(this.interval);
  }

  refreshZoneData(limit = 10, offset = 0) {
    var data = {
      limit: limit,
      offset: offset
    }
    this.api.getZoneDashBoard(data).then((res: any) => {
      console.log("getZoneDashBoard res==", res)
      if (res.status) {
        this.currentPageLength = parseInt(res.totalLength)

        this.zoneData = res.success
        for (let i = 0; i < res.success.length; i++) {
          res.success[i].totalTime = this.general.getTotTime(res.success[i].inTime, res.success[i].outTime)
        }
        this.dataSource = new MatTableDataSource(this.zoneData);

        setTimeout(() => {
          this.dataSource.sort = this.sort;
          // this.dataSource.paginator = this.paginator

        })
      }
      else {

      }
    })
  }

  search(a) {
    this.dataSource = new MatTableDataSource(this.zoneData);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
      this.dataSource.filter = a.trim().toLowerCase()
    })
  }
  getUpdate(event) {

    this.limit = event.pageSize
    this.offset = event.pageIndex * event.pageSize
    this.refreshZoneData(this.limit, this.offset)
  }
}
