import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import * as moment from 'moment';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { GeneralService } from '../services/general.service';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-grouping',
  templateUrl: './grouping.component.html',
  styleUrls: ['./grouping.component.css']
})
export class GroupingComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  groupData: any = [];
  grouping: any = [];
  limit: any = 10;
  offset: any = 0;
  searchKey: string = '';
  currentPageLength: any = 10;
  currentPageSize: any = 10;
  dataSource: any = [];
  displayedColumns = ['i', 'deviceId', 'deviceName', 'coinName', 'inTime', 'outTime', 'totalTime'];
  constructor(
    public dialogRef: MatDialogRef<GroupingComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private api: ApiService,
    public general: GeneralService,
  ) {
    this.groupData = data.data;
    console.log("this.groupData====", this.groupData);
  }

  ngOnInit(): void {
    this.getGroupingData();
  }

  getGroupingData(limit = 10, offset = 0) {
    return new Promise((resolve, reject) => {
      var data = {
        deviceName: this.groupData.deviceName,
        deviceId: this.groupData.deviceId,
        timeZoneOffset: this.general.getZone(),
        limit: limit,
        offset: offset
      }
      console.log("data to send==", data)
      this.api.getGroupingData(data).then((res: any) => {
        this.grouping = [];
        console.log("res ==", res);
        if (res.status) {
          this.currentPageLength = parseInt(res.totalLength);
          this.grouping = res.success;
          this.dataSource = new MatTableDataSource(this.grouping);

          setTimeout(() => {
            this.dataSource.sort = this.sort;
          })
          resolve(res);
        }
      }).catch(err => {
        console.log("err===", err);
        reject(err);
      })
    })
  }

  getUpdate(event) {
    this.limit = event.pageSize
    this.offset = event.pageIndex * event.pageSize
    this.getGroupingData(this.limit, this.offset).then(() => {
      this.search(this.searchKey);
    })
  }

  search(a) {
    this.searchKey = a;
    this.dataSource = new MatTableDataSource(this.grouping);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      this.dataSource.filter = a.trim().toLowerCase();
    })
  }
}
