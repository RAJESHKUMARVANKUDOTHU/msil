import { Component, OnInit, Inject, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import * as moment from 'moment';
import * as XLSX from 'xlsx';
import {
  MatDialog,
  MatDialogRef,
  MAT_DIALOG_DATA,
} from '@angular/material/dialog';
import { GeneralService } from '../../services/general.service';
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-vehiclewisereport',
  templateUrl: './vehiclewisereport.component.html',
  styleUrls: ['./vehiclewisereport.component.css']
})
export class VehiclewisereportComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  vehicleReportData: any;
  vehicleName: any = [];
  dataSource: any = [];
  displayedColumns1 = ['i', 'deviceId', 'deviceName', 'coinName', 'inTime', 'outTime', 'totTime'];
  displayedColumns2 = ['i', 'deviceId', 'coinName', 'inTime', 'outTime', 'totTime'];
  displayedColumns3 = ['i', 'deviceId', 'zoneName', 'inTime', 'outTime', 'totalTime'];
  searhKey: string = '';
  limit: any = 10;
  offset: any = 0;
  currentPageLength: any = 10;
  currentPageSize: any = 10;

  constructor(
    public dialogRef: MatDialogRef<VehiclewisereportComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private api: ApiService,
    public general: GeneralService,
  ) {
    this.vehicleReportData = data.data
    console.log("this.vehicleReportData ===", this.vehicleReportData)
  }

  ngOnInit(): void {
    this.getData(10, 0, this.vehicleReportData.type)
  }
  getData(limit, offset, type) {
    return new Promise((resolve, reject) => {
      var data = {};
      this.vehicleReportData.type = type;
      let from = moment(this.vehicleReportData.fromDate).format("YYYY-MM-DD")
      let to = moment(this.vehicleReportData.toDate).format("YYYY-MM-DD")
      console.log(from, to);

      if (this.vehicleReportData.type == '1') {
        data = {
          fromDate: from,
          toDate: to,
          timeZoneOffset: this.general.getZone(),
          limit: limit,
          offset: offset
        }
        console.log("data to send==", data);

        this.api.genericReport(data).then((res: any) => {
          this.vehicleName = [];
          console.log("res 0==", res);
          if (res.status) {
            this.currentPageLength = parseInt(res.totalLength)
            this.vehicleName = res.success;
            for (let i = 0; i < res.success.length; i++) {
              res.success[i].totTime = this.general.getTotTime(res.success[i].inTime, res.success[i].outTime);
            }
            this.dataSource = new MatTableDataSource(this.vehicleName);

            setTimeout(() => {
              this.dataSource.sort = this.sort;
              // this.dataSource.paginator = this.paginator

            })
          }
          resolve(res);

        }).catch(err => {
          console.log("err===", err);
          reject(err);
        })
      }
      if (this.vehicleReportData.type == '2') {
        data = {
          deviceName: this.vehicleReportData.deviceName,
          fromDate: from,
          toDate: to,
          timeZoneOffset: this.general.getZone(),
          limit: limit,
          offset: offset
        }
        console.log("data to send==", data);

        this.api.vehicleNameReport(data).then((res: any) => {
          this.vehicleName = [];
          console.log("res 3==", res);
          if (res.status) {
            this.currentPageLength = parseInt(res.totalLength);
            this.vehicleName = res.success;
            for (let i = 0; i < res.success.length; i++) {
              res.success[i].totTime = this.general.getTotTime(res.success[i].inTime, res.success[i].outTime);
            }
            this.dataSource = new MatTableDataSource(this.vehicleName);

            setTimeout(() => {
              this.dataSource.sort = this.sort;
              // this.dataSource.paginator = this.paginator

            })
          }
          resolve(res);

        }).catch(err => {
          console.log("err===", err);
          reject(err);
        })
      }

      if (this.vehicleReportData.type == '3') {
        data = {
          deviceName: this.vehicleReportData.deviceName,
          fromDate: from,
          toDate: to,
          timeZoneOffset: this.general.getZone(),
          limit: limit,
          offset: offset
        }
        console.log("data to send==", data);
        this.api.getVehicleZoneWiseReport(data).then((res: any) => {
          this.vehicleName = [];
          console.log("res 6==", res);
          if (res.status) {
            this.currentPageLength = parseInt(res.totalLength);
            this.vehicleName = res.success;
            for (let i = 0; i < res.success.length; i++) {
              res.success[i].totalTime = this.general.getTotTime(res.success[i].inTime, res.success[i].outTime);

            }
            this.dataSource = new MatTableDataSource(this.vehicleName);
            setTimeout(() => {
              this.dataSource.sort = this.sort;
            })
          }
          resolve(res);
        }).catch(err => {
          console.log("err===", err)
          reject(err);
        })
      }
    })
  }

  download() {
    var data = {};
    var fileName = '';
    let from = moment(this.vehicleReportData.fromDate).format("YYYY-MM-DD");
    let to = moment(this.vehicleReportData.toDate).format("YYYY-MM-DD");
    if (this.vehicleReportData.type == '1') {
      data = {
        fromDate: from,
        toDate: to,
        timeZoneOffset: this.general.getZone()
      }
      console.log("data to send==", data);
      fileName = "Generic Report";
      this.api.downloadGenericReport(data, fileName).then((res: any) => {
        console.log("res 1==", res);
        if (res.status) {
          this.general.openSnackBar("Downloading!!!", '');
        }
      }).catch(err => {
        console.log("err===", err);
      })
    }

    if (this.vehicleReportData.type == '2') {
      data = {
        deviceName: this.vehicleReportData.deviceName,
        fromDate: from,
        toDate: to,
        timeZoneOffset: this.general.getZone()
      }
      console.log("download data to send==", data);
      fileName = "Vehicle wise report based on location  - " + this.vehicleReportData.deviceName;
      this.api.downloadvehicleNameReport(data, fileName).then((res: any) => {
        console.log("res 1==", res);
        if (res.status) {
          this.general.openSnackBar("Downloading!!!", '');
        }
      }).catch(err => {
        console.log("err===", err);
      })
    }
    if (this.vehicleReportData.type == '3') {
      data = {
        deviceName: this.vehicleReportData.deviceName,
        fromDate: from,
        toDate: to,
        timeZoneOffset: this.general.getZone()
      }
      console.log("download data to send==", data);
      fileName = "Vehicle wise report based on zone  - " + this.vehicleReportData.deviceName;
      this.api.downloadVehicleZoneWiseReport(data, fileName).then((res: any) => {
        console.log("res 1==", res);
        if (res.status) {
          this.general.openSnackBar("Downloading!!!", '');
        }
      }).catch(err => {
        console.log("err===", err)
      })
    }
  }

  getUpdate(event, type) {
    this.limit = event.pageSize;
    this.offset = event.pageIndex * event.pageSize;
    this.getData(this.limit, this.offset, type).then(() => {
      console.log("searhkey==", this.searhKey);
      this.search(this.searhKey.toString(), this.vehicleName);
    }).catch(err => {
      console.log("errr===", err);
    });
  }

  search(a, data) {
    console.log("searhkey==", this.searhKey, data);
    this.searhKey = a;
    this.dataSource = new MatTableDataSource(data);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
      this.dataSource.filter = a.trim().toLowerCase();
    })
  }
}
