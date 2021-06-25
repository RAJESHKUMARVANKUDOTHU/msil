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
  deviceId: any = [];
  servicedVehicleData: any = [];
  vehicleZoneData: any = [];
  jcSummaryData: any = [];
  dataSource: any = [];
  displayedColumns1 = ['i', 'deviceId', 'deviceName', 'coinName', 'inTime', 'outTime', 'totTime'];
  displayedColumns2 = ['i', 'deviceName', 'coinName', 'inTime', 'outTime', 'totTime'];
  displayedColumns3 = ['i', 'deviceId', 'coinName', 'inTime', 'outTime', 'totTime'];
  displayedColumns4 = ['i', 'deviceName', 'totTime'];
  displayedColumns6 = ['i', 'deviceId', 'zoneName', 'inTime', 'outTime', 'totalTime'];
  displayedColumns7 = [];
  searhKey: string = '';
  limit: any = 10
  offset: any = 0
  currentPageLength: any = 10
  currentPageSize: any = 10
  vehicleTotLen: any = 0
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
          deviceId: this.vehicleReportData.deviceId,
          fromDate: from,
          toDate: to,
          timeZoneOffset: this.general.getZone(),
          limit: limit,
          offset: offset
        }
        console.log("data to send==", data);
        this.api.deviceIdReport(data).then((res: any) => {
          this.vehicleName = [];
          console.log("res 2==", res);
          if (res.status) {
            this.currentPageLength = parseInt(res.totalLength);
            this.vehicleName = res.success;
            for (let i = 0; i < res.success.length; i++) {
              res.success[i].totTime = this.general.getTotTime(res.success[i].inTime, res.success[i].outTime);
            }
            this.dataSource = new MatTableDataSource(this.vehicleName);
            setTimeout(() => {
              this.dataSource.sort = this.sort;
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

      if (this.vehicleReportData.type == '4') {
        data = {
          fromDate: from,
          toDate: to,
          timeZoneOffset: this.general.getZone(),
          limit: limit,
          offset: offset
        }
        console.log("data to send==", data);
        this.api.getvehicleServicedReport(data).then((res: any) => {
          this.vehicleName = []
          console.log("res 4==", res);
          if (res.status) {
            this.currentPageLength = parseInt(res.totalLength);
            this.vehicleName = res.success;
            this.vehicleTotLen = parseInt(res.totalLength);
            for (let i = 0; i < res.success.length; i++) {
              res.success[i].totTime = this.general.getTotTime(res.success[i].gateInTime, res.success[i].deRegTime);
            }
            this.dataSource = new MatTableDataSource(this.vehicleName);
            setTimeout(() => {
              this.dataSource.sort = this.sort;
            })
          }
          resolve(res);
        }).catch(err => {
          console.log("err===", err);
          reject(err);
        })
      }
      if (this.vehicleReportData.type == '6') {
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
      else if (this.vehicleReportData.type == '7') {
        data = {
          fromDate: from,
          toDate: to,
          timeZoneOffset: this.general.getZone(),
        }
        console.log("data to send==", data);
        this.api.getJcSummaryData(data).then((res: any) => {
          console.log("res 7 from api==", res);
          this.jcSummaryData = {};
          if (res.status) {
            this.jcSummaryData.data = res.success;
            this.jcSummaryData.head = ['Sl no.', 'Date', 'Vehicle no.', 'Find Id.'];

            if (this.jcSummaryData.data[0]?.hasOwnProperty('zoneJC')) {
              res.success[0].zoneJC.forEach(obj => {
                let suffix = {
                  tripCount: 'trip count',
                  inTime: 'first in time',
                  outTime: 'last out time',
                  std: 'Standard time',
                  deviation: 'Deviation'
                }
                let a = [obj.zoneName + ' ' + suffix.tripCount, obj.zoneName + ' ' + suffix.inTime, obj.zoneName + ' ' + suffix.outTime, suffix.std, suffix.deviation]
                this.jcSummaryData.head = this.jcSummaryData.head.concat(a);
              });
            }
            console.log("res 7==", this.jcSummaryData);
          }
          resolve(res);

        }).catch(err => {
          console.log("err===", err);
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
        deviceId: this.vehicleReportData.deviceId,
        fromDate: from,
        toDate: to,
        timeZoneOffset: this.general.getZone()
      }
      fileName = "Report of device Id - " + this.vehicleReportData.deviceId;
      console.log("download data to send==", data);
      this.api.downloadDeviceIdReport(data, fileName).then((res: any) => {
        console.log("res 2==", res);
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
    if (this.vehicleReportData.type == '4') {
      data = {
        fromDate: from,
        toDate: to,
        timeZoneOffset: this.general.getZone(),
      }
      console.log("download data to send==", data);
      fileName = "Report - Number of vehicles Serviced";
      this.api.downloadVehicleReport(data, fileName).then((res: any) => {
        console.log("res 1==", res);
        if (res.status) {
          this.general.openSnackBar("Downloading!!!", '');
        }
      }).catch(err => {
        console.log("err===", err);
      })
    }
    if (this.vehicleReportData.type == '6') {
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
    if (this.vehicleReportData.type == '7') {
      let fileName = 'Vehicle and Job card wise report.xlsx';
      let element = document.getElementById('htmlData');
      console.log("htmlData===",element);
      const ws: XLSX.WorkSheet = XLSX.utils.table_to_sheet(element, {dateNF:'mmm d yyyy hh:mm AM/PM;@',cellDates:true});

      /* generate workbook and add the worksheet */
      const wb: XLSX.WorkBook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Sheet1');

      /* save to file */
      XLSX.writeFile(wb, fileName);
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
  searchVehicle(data) {
    console.log('search data===', data);
    if (data) {
      this.jcSummaryData.data = this.jcSummaryData.data.filter((obj) => {
        return (
          (obj.deviceId
            .toString()
            .toLowerCase()
            .indexOf(data.toString().toLowerCase()) > -1) || (obj.deviceName
              .toString()
              .toLowerCase()
              .indexOf(data.toString().toLowerCase()) > -1)
        );
      });
    }
    else {
      this.getData(this.limit, this.offset, '7');
    }
  }
}
