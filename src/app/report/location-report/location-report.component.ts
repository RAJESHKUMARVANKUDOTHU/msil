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
import * as CanvasJS from '../../../assets/canvasjs-3.2.7/canvasjs.min';
import { GeneralService } from '../../services/general.service';
import { ApiService } from '../../services/api.service';
import { conditionallyCreateMapObjectLiteral } from '@angular/compiler/src/render3/view/util';
@Component({
  selector: 'app-location-report',
  templateUrl: './location-report.component.html',
  styleUrls: ['./location-report.component.css']
})
export class LocationReportComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  locationReportData: any
  locationData: any = []
  bayData: any = []
  bayDataTemp: any = []
  dataSource: any = [];
  dataPoints: any = []
  minutes: any = []
  limit: any = 10
  offset: any = 0
  currentPageLength: any = 10
  currentPageSize: any = 10
  displayedColumns1 = ['i', 'deviceId', 'deviceName', 'inTime', 'outTime', 'totTime'];
  displayedColumns2 = ['i', 'coinName', 'totalVehicle', 'avgTime',];

  constructor(
    public dialogRef: MatDialogRef<LocationReportComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private api: ApiService,
    public general: GeneralService,
  ) {
    this.locationReportData = data.data
    console.log("this.locationReportData ===", this.locationReportData)
  }

  ngOnInit(): void {
    this.getData(10, 0, this.locationReportData.type)
    if (this.locationReportData.type == '2') {


    }
  }
  getData(limit, offset, type) {
    var data = {}
    let from = moment(this.locationReportData.fromDate).format("YYYY-MM-DD")
    let to = moment(this.locationReportData.toDate).format("YYYY-MM-DD")
    this.locationReportData.type = type
    if (this.locationReportData.type == '1') {
      data = {
        coinId: this.locationReportData.coinId.coinId,
        fromDate: from,
        toDate: to,
        timeZoneOffset: this.general.getZone(),
        limit: limit,
        offset: offset
      }
      console.log("data to send==", data)
      this.api.getLocationReport(data).then((res: any) => {
        this.currentPageLength = parseInt(res.totalLength)

        this.locationData = []
        console.log("res==", res)
        if (res.status) {
          this.locationData = res.success
          for (let i = 0; i < res.success.length; i++) {
            res.success[i].totTime = this.general.getTotTime(res.success[i].inTime, res.success[i].outTime)
          }
          this.dataSource = new MatTableDataSource(this.locationData);

          setTimeout(() => {
            this.dataSource.sort = this.sort;
            // this.dataSource.paginator = this.paginator

          })
        }
      }).catch(err => {
        console.log("err===", err)
      })
    }

    if (this.locationReportData.type == '2') {
      data = {
        zoneId: this.locationReportData.zoneId._id,
        fromDate: from,
        toDate: to,
        timeZoneOffset: this.general.getZone()
      }
      console.log("data to send==", data)
      this.api.getAverageTimeOfBays(data).then((res: any) => {
        this.bayData = []
        console.log("res 2==", res)
        if (res.status) {
          for (let i = 0; i < res.success.length; i++) {
            this.bayData.push({
              coinName: res.success[i].coinName,
              avgTime: this.getTime(res.success[i].avgTime).time,
              totalVehicle: res.success[i].totalVehicle,
              minutes: this.getTime(res.success[i].avgTime).m
            })
          }
          this.averageTimeOfBayGraph(this.bayData)
        }
        this.dataSource = new MatTableDataSource(this.bayData);

        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator
        })

      }).catch(err => {
        console.log("err===", err)
      })
    }
  }

  averageTimeOfBayGraph(data) {
    var chart = null
    this.dataPoints = []
    for (let i = 0; i < data.length; i++) {

      this.dataPoints.push(
        {
          label: data[i].coinName,
          y: parseInt(data[i].minutes)
        }
      )
    }
    console.log(this.dataPoints, data)
    chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Average time taken by bays",
        fontColor: "#002060",
      },
      axisY: {
        title: "Average time (in minutes)",
        gridThickness: 0,
      },
      axisX: {
        title: "Bay"
      },
      dataPointWidth: 30,
      data: [{
        type: "column",
        dataPoints: this.dataPoints,
        yValueFormatString: "#,##0#\" min\"",
      }]
    });

    chart.render();
    chart.destroy()
    chart = null;
    chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Average time taken by bays",
        fontColor: "#002060",
      },
      axisY: {
        title: "Average time (in minutes)",
        gridThickness: 0,
      },
      axisX: {
        title: "Bay"
      },
      dataPointWidth: 30,
      data: [{
        type: "column",
        dataPoints: this.dataPoints,
        yValueFormatString: "#,##0#\" min\"",
      }]
    });
    chart.render();
  }


  download() {
    var data = {}
    var fileName = ''
    let from = moment(this.locationReportData.fromDate).format("YYYY-MM-DD")
    let to = moment(this.locationReportData.toDate).format("YYYY-MM-DD")

    if (this.locationReportData.type == '1') {
      data = {
        coinId: this.locationReportData.coinId.coinId,
        fromDate: from,
        toDate: to,
        timeZoneOffset: this.general.getZone()
      }
      fileName = "Report of location - " + this.locationReportData.coinId.coinName
      this.api.downloadLocationReport(data, fileName).then((res: any) => {
        console.log("res==", res)
        if (res.status) {
          this.general.openSnackBar("Downloading!!!", '')

        }
      }).catch(err => {
        console.log("err===", err)
      })
    }

    if (this.locationReportData.type == '2') {
      data = {
        zoneId: this.locationReportData.zoneId._id,
        fromDate: from,
        toDate: to,
        timeZoneOffset: this.general.getZone()
      }
      fileName = "Report of Bay - " + this.locationReportData.zoneId.zoneName
      this.api.downloadAverageTimeOfBays(data, fileName).then((res: any) => {
        console.log("res==", res)
        if (res.status) {
          this.general.openSnackBar("Downloading!!!", '')

        }
      }).catch(err => {
        console.log("err===", err)
      })
    }
  }


  getTime(data) {
    data = Math.abs(data)
    let min = Math.floor((data / 1000 / 60) << 0)
    let ms = data % 1000;
    data = (data - ms) / 1000;
    let s = data % 60;
    data = (data - s) / 60;
    let m = data % 60;
    data = (data - m) / 60;
    let h = data

    let ss = s <= 9 && s >= 0 ? "0" + s : s;
    let mm = m <= 9 && m >= 0 ? "0" + m : m;
    let hh = h <= 9 && h >= 0 ? "0" + h : h;

    var time = hh + ':' + mm + ':' + ss
    var a = {
      m: min,
      time: this.general.convertTime(time)
    }
    return a
  }
  search(a, data) {
    this.dataSource = new MatTableDataSource(data);
    setTimeout(() => {
      this.dataSource.sort = this.sort;
      // this.dataSource.paginator = this.paginator;
      this.dataSource.filter = a.trim().toLowerCase()
    })
  }
  getUpdate(event, type) {

    this.limit = event.pageSize
    this.offset = event.pageIndex * event.pageSize
    this.getData(this.limit, this.offset, type)
  }

}
