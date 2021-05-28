import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { AddAssetsComponent } from '../../assets/add-assets/add-assets.component';
import { EditAssetsComponent } from '../../assets/edit-assets/edit-assets.component';
import { LoginAuthService } from '../../services/login-auth.service';
import { ApiService } from '../../services/api.service';
import { GeneralService } from '../../services/general.service';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
@Component({
  selector: 'app-manage-device',
  templateUrl: './manage-device.component.html',
  styleUrls: ['./manage-device.component.css']
})
export class ManageDeviceComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  findData: any = []
  dataSource: any = [];
  serviceData: any = []
  fileName: String = ''
  role:any
  limit:any=10
  offset:any=0
  currentPageLength:any=10
  currentPageSize:any=10
  displayedColumns = ['i', 'deviceId', 'deviceName', 'serviceCategoryId', 'deviceToggleStatus', 'updatedOn', 'delete']; //,'batteryStatus'
  constructor(
    public dialog: MatDialog,
    private login: LoginAuthService,
    private api: ApiService,
    private general: GeneralService
  ) { }

  ngOnInit(): void {
    this.refreshDevice()
    this.getServiceDetails()
    this.role=this.login.getLoginDetails().role
    console.log("this.role",this.role)
    this.general.deviceChanges.subscribe((res) => {
      if (res) {
        this.refreshDevice(this.limit, this.offset)
      }
    })
  }
  openDailog() {

    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '50vh';
    dialogConfig.width = '30vw';
    dialogConfig.data = {
      type: 'find',

    }

    const dialogRef = this.dialog.open(AddAssetsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.refreshDevice(this.limit, this.offset)
    });
  }

  refreshDevice(limit=10,offset=0) {
    var data={
      limit:limit,
      offset:offset
    }
    console.log("data==",data)
    this.api.getDeviceData(data).then((res: any) => {
      this.findData = []
      console.log("find submit====", res);
      if (res.status) {
        this.currentPageLength = parseInt(res.totalLength)

        for (let i = 0; i < res.success.length; i++) {
          if (res.success[i] != null) {
            this.findData.push({
              i: i + 1,
              id: res.success[i]._id,
              userId: res.success[i].userId,
              deviceName: res.success[i].deviceName,
              deviceId: res.success[i].deviceId,
              updatedOn: res.success[i].updatedOnLoc,
              serviceCategoryId: res.success[i].serviceCategoryId,
              deviceAssignedStatus: res.success[i].deviceAssignedStatus,
              deviceToggleStatus: res.success[i].deviceToggleStatus,
              edit: 'edit',
              delete: 'delete_forever'
            })
          }
        }
        this.dataSource = new MatTableDataSource(this.findData);

        setTimeout(() => {
          this.dataSource.sort = this.sort;
          // this.dataSource.paginator = this.paginator
        })
      }
      else { }
    }).catch((err: any) => {
      console.log("error===", err)
    })
  }
  onServiceSelection(value, a) {

    var data = {
      serviceId: a._id,
      deviceId: value.deviceId
    }
    console.log("service select data==", data);
    this.api.updateServiceId(data).then((res: any) => {
      console.log("update Services===", res)
      if (res.status) {
        this.refreshDevice(this.limit, this.offset)
        this.general.openSnackBar(res.success, '')
      }
      else {
        this.general.openSnackBar(res.success == false ? res.message : res.success, '')
      }
    })

  }

  getBatteryStatus(data) {
    if (data == "H") {
      var a = {
        'background-color': 'green',
        'width': '31px'
      }
      return a
    }
    // else if(value == 2){
    //   var a = {
    //     'background-color':'#ffc107',
    //     'width':'18px'
    //   }
    //   return a
    // }
    else if (data == "L") {
      var a = {
        'background-color': 'red',
        'width': '10px'
      }
      return a
    }
    else {
      return {}
    }
  }

  edit(data) {
    if(data.deviceAssignedStatus == false){
      const dialogConfig = new MatDialogConfig();
      dialogConfig.disableClose = true;
      dialogConfig.autoFocus = true;
      dialogConfig.height = '50vh';
      dialogConfig.width = '30vw';
      dialogConfig.data = {
        type: 'find',
        data: data
      }
      const dialogRef = this.dialog.open(EditAssetsComponent, dialogConfig);
      dialogRef.afterClosed().subscribe(result => {
        this.refreshDevice(this.limit, this.offset)
      });
    }
  }

  delete(data) {
    console.log("data==", data)
    data.deviceObjectId = data.id
    if (confirm('Are you sure you want to delete device?')) {
      this.api.deleteDevice(data).then((res: any) => {
        console.log("device delete====", res);
        if (res.status) {
          this.refreshDevice(this.limit, this.offset)
          this.general.deviceChanges.next(true)
          var msg = res.success
          this.general.openSnackBar(msg, '')
        }
        else {
          this.refreshDevice(this.limit, this.offset)
          this.general.deviceChanges.next(false)
          this.general.openSnackBar(res.success == false ? res.message : res.success, '')
        }
      }).catch((err: any) => {
        console.log("error===", err)
      })
    }
    else { }
  }

  toggle(a) {
    var data = {
      _id: a.id,
      deviceName: a.deviceName,
      deviceId: a.deviceId,
      deviceToggleStatus: a.deviceToggleStatus == true ? false : true
    }
    if (confirm('Are you sure you want to perform this operation?')) {
      this.api.deviceOnOff(data).then((res: any) => {
        console.log("toggle====", res);
        if (res.status) {
          this.general.deviceChanges.next(true)
          this.refreshDevice(this.limit, this.offset)
          var msg = res.success
          this.general.openSnackBar(msg, '')
        }
        else { 
          this.refreshDevice(this.limit, this.offset)
          this.general.deviceChanges.next(false)
          this.general.openSnackBar(res.success == false ? res.message : res.success, '')
        }
      }).catch((err: any) => {
        console.log("error===", err)
      })
    }
    else {
      this.refreshDevice(this.limit, this.offset)
    }
  }

  download() {
    this.fileName = "Registered Asset"
    var data={
      timeZoneOffset:this.general.getZone()
    }
    this.api.downloadRegisteredDevice(data,this.fileName).then((res: any) => {
      console.log("Registerd asset download==", res)
      this.general.loadingFreez.next({status:true,msg:"Downloading"})
      if(res){
        this.general.loadingFreez.next({status:false,msg:"Downloaded Successfully!!"})
      }
      else{
       this.general.openSnackBar(res.success == false ? res.message : res.success, '')
      }
    }).catch((err: any) => {
      console.log("error==", err)
    })
  }

  getServiceDetails() {
    this.api.getServiceType().then((res: any) => {
      console.log("servoce details response==", res)
      this.serviceData = []
      if (res.status) {
        this.serviceData = res.success
      }
      else { }
    })
  }

  
  getUpdate(event) {
 
    this.limit = event.pageSize
    this.offset = event.pageIndex * event.pageSize
    this.refreshDevice(this.limit, this.offset)
  }
}

