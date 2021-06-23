import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { GeneralService } from '../services/general.service';
import { LoginAuthService } from '../services/login-auth.service';
import { ApiService } from '../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import * as moment from 'moment';

@Component({
  selector: 'app-vehicle-status-track',
  templateUrl: './vehicle-status-track.component.html',
  styleUrls: ['./vehicle-status-track.component.css']
})
export class VehicleStatusTrackComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator) paginator: MatPaginator;
  zoneData: any = []
  dataSource: any = [];
  displayedColumns = ['coinName', 'inTime', 'outTime', 'totTime'];
  vehicleData: any = [];
 
  constructor(
    private api: ApiService,
    public general: GeneralService,
    private login:LoginAuthService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    
    this.route.queryParams.subscribe(async (params) => {
      console.log("params===", params['deviceId'], params['deviceName']);
      await this.getZoneDetails(params['userId']);
      this.getVehicleStatus(params['deviceId'], params['deviceName'], params['userId']);
    })
  }

  getVehicleStatus(id,name,userId) {
    var data = {
      deviceId: id,
      deviceName: name,
      userId:userId
    }
    console.log("data===", data)
    this.api.getVehicleStatusData(data).then(async (res: any) => {
      console.log("res==", res)
      if (res.status) {
        this.vehicleData = res.success;
        this.vehicleData.delayTime = 0;
        this.vehicleData.totalStandardTime = 0
        for (let i = 0; i < this.vehicleData.locations.length; i++) {
          this.vehicleData.locations[i].totTime = this.general.getTotTime(this.vehicleData.locations[i].inTime, this.vehicleData.locations[i].outTime);
        }
        this.zoneData = this.zoneData.filter((zoneObj) => {
          this.vehicleData.zoneJC = this.vehicleData.zoneJC.filter((obj)=>{
            if(zoneObj._id == obj.zoneId){
              if(obj.delayTime != 0){
                zoneObj.time = Math.floor(obj.delayTime / (1000 * 60))
                this.vehicleData.delayTime +=  Math.floor(obj.delayTime / (1000 * 60))
                if(obj.delayTime > 0){
                  zoneObj.delayed = true;
                }
                else{
                  zoneObj.delayed = false;
                  zoneObj.time *= -1;
                }
                this.vehicleData.totalStandardTime += obj.standardTime
              }
            }
            return obj;
          })
          return zoneObj
        })
        console.log("this.zoneData-===", this.zoneData);
        this.vehicleData.EDT =await  this.getEDT(this.vehicleData);
        this.dataSource = new MatTableDataSource(this.vehicleData.locations);
        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator
        })
      } else {
        this.vehicleData = []
      }
    }).catch((err) => {
      console.log("err===", err)
    })
  }

  getZoneDetails(userId) {
    var data = {
      userId: userId
    }
    this.api.getZone().then((res: any) => {
      console.log('zone details response==', res);
      this.zoneData = [];
      if (res.status) {
        let unique = new Set();
        res.success.forEach(obj => {
          if (!(unique.has(obj?.mainZoneId?._id))) {
            if(obj?.mainZoneId?._id){
              unique.add(obj?.mainZoneId?._id)
              this.zoneData.push({
                _id: obj?.mainZoneId?._id,
                zoneName: obj?.mainZoneId?.zoneName,
                standardTime: obj?.mainZoneId?.standardTime,
                delayed: false, time: (obj.standardTime * -1)
              })
            }
          }
        });
        // this.zoneData = res.success.map(obj => ({ ...obj, delayed: false, time: (obj.standardTime * -1) }));
      }
      return
    }).catch(err => {
      console.log("err===", err);
    });
  }

  getFillColor(value) {
    if (value.delayed) {
      return {
        'background-color': 'red',
        width: 'fit-content'
      }
    }
    else {
      return {
        'background-color': 'green',
        width: 'fit-content'
      }
    }
  }


  getEDT(data) {
    const ST = data.totalStandardTime * 60 * 1000;
    let ET = ST;
    data.zoneJC.forEach(obj => {
      if (obj.delayTime != (-1 * (obj.standardTime * 60 * 1000))) {
        ET += obj.delayTime;
      }
    });
    let inTime = data.jcInTime ? data.jcInTime : new Date();
    return moment(inTime).add(ET, 'milliseconds');
  }

}
