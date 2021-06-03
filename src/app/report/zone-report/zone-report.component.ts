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
import { GeneralService } from '../../services/general.service';
import { ApiService } from '../../services/api.service';
import * as CanvasJS from '../../../assets/canvasjs-3.2.7/canvasjs.min';

@Component({
  selector: 'app-zone-report',
  templateUrl: './zone-report.component.html',
  styleUrls: ['./zone-report.component.css']
})
export class ZoneReportComponent implements OnInit {

  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  zoneReportData: any
  zoneData: any = []
  dataSource: any = [];
  avgTime: any = [];
  sdtTime: any = [];
  dataPoints: any = []
  displayedColumns1 = ['i', 'deviceId', 'deviceName', 'inTime', 'outTime', 'totTime'];
  limit: any = 10
  offset: any = 0
  currentPageLength: any = 10
  currentPageSize: any = 10
  constructor(
    public dialogRef: MatDialogRef<ZoneReportComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private api: ApiService,
    public general: GeneralService,
  ) {
    this.zoneReportData = data.data
    console.log("this.zoneReportData ===", this.zoneReportData)
  }

  ngOnInit(): void {
    this.getData(10, 0, this.zoneReportData.type)
  }
  getData(limit, offset, type) {
    var data = {}
    let from = moment(this.zoneReportData.fromDate).format("YYYY-MM-DD")
    let to = moment(this.zoneReportData.toDate).format("YYYY-MM-DD")
    this.zoneReportData.type = type
    if (this.zoneReportData.type == '1') {
      data = {
        zoneId: this.zoneReportData.zoneId._id,
        fromDate: from,
        toDate: to,
        timeZoneOffset: this.general.getZone(),
        limit: limit,
        offset: offset
      }
      console.log("data to send==", data)
      this.api.getZoneWiseReport(data).then((res: any) => {
        this.zoneData = []
        console.log("res==", res)
        if (res.status) {
          this.currentPageLength = parseInt(res.totalLength)

          this.zoneData = res.success
          for (let i = 0; i < res.success.length; i++) {
            res.success[i].totTime = this.general.getTotTime(res.success[i].inTime, res.success[i].outTime)
          }
          this.dataSource = new MatTableDataSource(this.zoneData);

          setTimeout(() => {
            this.dataSource.sort = this.sort;
            // this.dataSource.paginator = this.paginator

          })
        }
      }).catch(err => {
        console.log("err===", err)
      })
    }

    if (this.zoneReportData.type == '2') {
      data = {
        fromDate: from,
        toDate: to,
        timeZoneOffset: this.general.getZone(),

      }
      console.log("data to send==", data)
      this.api.getZonePerformance(data).then((res: any) => {
        this.zoneData = []
        console.log("res 2==", res)
        if (res.status) {
          this.zoneData = res.success
          this.avgTime = []
          this.sdtTime = []
          for (let i = 0; i < this.zoneData.length; i++) {
            this.avgTime.push(
              {
                label: this.zoneData[i].zoneName,
                y: this.zoneData[i].totalAverageTime,
              }
            )
            this.sdtTime.push(
              {
                label: this.zoneData[i].zoneName,
                y: parseInt(this.zoneData[i].standardTime)
              }
            )
            this.zonePerformanceChart()
          }
        }
      }).catch(err => {
        console.log("err===", err)
      })
    }
    if (this.zoneReportData.type == '3') {
      data = {
        fromDate: from,
        toDate: to,
        timeZoneOffset: this.general.getZone(),
        type: this.zoneReportData.dayType,
        day: this.zoneReportData.dayType == 'week' ? this.zoneReportData.weekDay : ''
      }
      console.log("data to send==", data)
      this.api.zoneWisePerformancePerDay(data).then((res: any) => {
        this.zoneData = []
        console.log("res 3==", res)
        if (res.status) {
          this.zoneData = res.success
          this.dataPoints = [];
          for (let i = 0; i < this.zoneData.length; i++) {
            let dataPointZone = [];
            for (let j = 0; j < this.zoneData[i].data.length; j++) {
              dataPointZone.push({
                x: new Date(this.zoneData[i].data[j].date),
                y: parseInt(this.zoneData[i].data[j].zonePerformance)
              })
            }
            this.dataPoints.push(
              {
                name: this.zoneData[i].zoneName,
                type: "spline",
                yValueFormatString: "#0.## min",
                showInLegend: true,
                dataPoints: dataPointZone,
                indexLabelPlacement: "outside",
                indexLabel: "{y}",
              }
            )
            console.log("datapoints==", this.dataPoints)
          }
          this.zoneWisePerformancePerDayChart()
        }
      }).catch(err => {
        console.log("err===", err)
      })
    }
    if (this.zoneReportData.type == '4') {
      data = {
        fromDate: from,
        toDate: to,
        timeZoneOffset: this.general.getZone(),

      }
      console.log("data to send==", data)
      this.api.zoneWiseEfficiency(data).then((res: any) => {
        this.zoneData = []
        console.log("res 4==", res)
        if (res.status) {
          this.zoneData = res.success
          this.dataPoints = []
          for (let i = 0; i < this.zoneData.length; i++) {
            this.dataPoints.push(
              {
                label: this.zoneData[i].zoneName,
                y: parseInt(this.zoneData[i].zoneWiseEfficiency),
              }
            )

            this.zoneEfficiencyChart()
          }
        }
      }).catch(err => {
        console.log("err===", err)
      })
    }
    if (this.zoneReportData.type == '5') {
      data = {
        fromDate: from,
        toDate: to,
        timeZoneOffset: this.general.getZone(),
        type: this.zoneReportData.dayType,
        day: this.zoneReportData.dayType == 'week' ? this.zoneReportData.weekDay : ''
      }
      console.log("data to send==", data)
      this.api.getZoneWiseEfficiencyByDay(data).then((res: any) => {
        this.zoneData = []
        console.log("res 5==", res)
        if (res.status) {
          this.zoneData = res.success
          this.dataPoints = [];
          for (let i = 0; i < this.zoneData.length; i++) {
            let dataPointZone = [];
            for (let j = 0; j < this.zoneData[i].data.length; j++) {
              dataPointZone.push({
                x: new Date(this.zoneData[i].data[j].date),
                y: parseInt(this.zoneData[i].data[j].zonePerformance)
              })
            }
            this.dataPoints.push(
              {
                name: this.zoneData[i].zoneName,
                type: "spline",
                yValueFormatString: "#0.## \" %\"",
                showInLegend: true,
                dataPoints: dataPointZone,
                indexLabelPlacement: "outside",
                indexLabel: "{y}",
              }
            )
            console.log("datapoints==", this.dataPoints)
          }
          this.zoneWiseEfficiencyPerDayChart()
        }
      }).catch(err => {
        console.log("err===", err)
      })
    }

  }

  // getTime(data) {
  //   let min = Math.floor(data / (1000 * 60))
  //   return min
  // }
  zonePerformanceChart() {
    var chart = null
    chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Zone Performance",
        fontSize: 25,
      },
      axisX: {
        title: "Zone",
        labelMaxWidth: 120,
      },
      axisY: {
        title: "Avg. time (in minutes)",
        titleFontColor: "#4F81BC",
        lineColor: "#4F81BC",
        labelFontColor: "#4F81BC",
        tickColor: "#4F81BC",
        gridThickness: 0,
        includeZero: true
      },
      axisY2: {
        title: "Zone Standard time (in minutes)",
        titleFontColor: "#C0504E",
        lineColor: "#C0504E",
        labelFontColor: "#C0504E",
        tickColor: "#C0504E",
        gridThickness: 0,
        includeZero: true
      },
      toolTip: {
        shared: true
      },
      legend: {
        cursor: "pointer",
        itemclick: toggleDataSeries
      },
      dataPointWidth: 60,
      data: [{
        type: "column",
        name: "Actual Avg. time",
        indexLabelPlacement: "outside",
        indexLabel: "{y}",
        showInLegend: true,
        yValueFormatString: "#,##0#\" min\"",
        dataPoints: this.avgTime
      },
      {
        type: "column",
        name: "Standard time",
        indexLabelPlacement: "outside",
        indexLabel: "{y}",
        axisYType: "secondary",
        showInLegend: true,
        yValueFormatString: "#,##0#\" min\"",
        dataPoints: this.sdtTime
      }]
    });
    chart.render();
    chart.axisY2[0].set("minimum", chart.axisY[0].get("minimum"), false);
    chart.axisY2[0].set("maximum", chart.axisY[0].get("maximum"));
    function toggleDataSeries(e) {
      if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      }
      else {
        e.dataSeries.visible = true;
      }
      chart.render();
    }
  }
  zoneEfficiencyChart() {
    var chart = null
    console.log("this.datapoints==", this.dataPoints)
    chart = new CanvasJS.Chart("chartContainer", {
      animationEnabled: true,
      exportEnabled: true,
      title: {
        text: "Zone Efficiency",
        fontColor: "#002060",
      },
      axisY: {
        title: "Efficiency (in %)",
        gridThickness: 0,
        includeZero: true,
        suffix: "%",
      },
      axisX: {
        title: "Zone"
      },
      dataPointWidth: 30,
      data: [{
        type: "column",
        dataPoints: this.dataPoints,
        yValueFormatString: "#,##0#\" %\"",
      }]
    });

    chart.render();

  }


  zoneWisePerformancePerDayChart() {
    var chart = null
    chart = new CanvasJS.Chart("chartContainer", {
      exportEnabled: true,
      animationEnabled: true,
      title: {
        text: "Zone Performance per day"
      },
      axisX: {
        valueFormatString: "DD MMM,YY",
        //labelMaxWidth: 120,
        labelAutoFit: true,
        intervalType: "day",
        // interval: 1,
        labelAngle: 0,

      },
      axisY: {
        title: "Avg time(in min)",
        suffix: "min",
        gridThickness: 0,
        includeZero: true
      },
      legend: {
        cursor: "pointer",
        fontSize: 16,
        itemclick: toogleDataSeries
      },
      toolTip: {
        shared: true
      },
      data: this.dataPoints
    });
    chart.render();

    function toogleDataSeries(e) {
      if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      chart.render();
    }
  }
  zoneWiseEfficiencyPerDayChart() {
    var chart = null
    chart = new CanvasJS.Chart("chartContainer", {
      exportEnabled: true,
      animationEnabled: true,
      title: {
        text: "Zone efficiency per day"
      },
      axisX: {
        valueFormatString: "DD MMM,YY",
        labelAutoFit: true,
        intervalType: "day",
        // interval: 1,
        labelAngle: 0,
      },
      axisY: {
        title: "Avg time(in %)",
        suffix: "%",
        gridThickness: 0,
        includeZero: true
      },
      legend: {
        cursor: "pointer",
        fontSize: 16,
        itemclick: toogleDataSeries
      },
      toolTip: {
        shared: true
      },
      data: this.dataPoints
    });
    chart.render();

    function toogleDataSeries(e) {
      if (typeof (e.dataSeries.visible) === "undefined" || e.dataSeries.visible) {
        e.dataSeries.visible = false;
      } else {
        e.dataSeries.visible = true;
      }
      chart.render();
    }
  }
  getValue() {
    for (let i = 0; i < this.zoneData.length; i++) {
      console.log("this.zoneData[i].zoneName==", this.zoneData[i].zoneName)
      return this.zoneData[i].zoneName
    }
  }
  getDatapoints() {
    for (let i = 0; i < this.dataPoints.length; i++) {
      console.log("this.dataPoints[i]===", this.dataPoints[i]);

      return this.dataPoints[i]
    }
  }
  download() {
    var data = {}
    var fileName = ''
    let from = moment(this.zoneReportData.fromDate).format("YYYY-MM-DD")
    let to = moment(this.zoneReportData.toDate).format("YYYY-MM-DD")

    if (this.zoneReportData.type == '1') {
      data = {
        zoneId: this.zoneReportData.zoneId._id,
        fromDate: from,
        toDate: to,
        timeZoneOffset: this.general.getZone()
      }
      fileName = "Report of zone Name - " + this.zoneReportData.zoneId.zoneName
      this.api.downloadzoneWiseReport(data, fileName).then((res: any) => {
        console.log("res==", res)
        if (res.status) {
          this.general.openSnackBar("Downloading!!!", '')

        }
      }).catch(err => {
        console.log("err===", err)
      })
    }

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
