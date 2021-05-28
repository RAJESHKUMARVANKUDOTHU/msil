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
  selector: 'app-manage-gateway',
  templateUrl: './manage-gateway.component.html',
  styleUrls: ['./manage-gateway.component.css']
})
export class ManageGatewayComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  gatewayData: any = []
  dataSource: any = [];
  fileName: String = ''
  role:any
  limit:any=10
  offset:any=0
  currentPageLength:any=10
  currentPageSize:any=10
  displayedColumns = ['i', 'gatewayId', 'gatewayName', 'macId', 'updatedOn', 'edit', 'delete'];
  constructor(
    public dialog: MatDialog,
    private login: LoginAuthService,
    private api: ApiService,
    private general: GeneralService
  ) { }

  ngOnInit(): void {
    this.refreshGateway()
    this.role=this.login.getLoginDetails().role
    this.general.deviceChanges.subscribe((res) => {
      if (res) {
        this.refreshGateway()
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
      type: 'gateway'
    }

    const dialogRef = this.dialog.open(AddAssetsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.refreshGateway(this.limit, this.offset)
    });
  }

  refreshGateway(limit=10,offset=0) {
    var data={
      limit:limit,
      offset:offset
    }
    this.api.getGatewayData(data).then((res: any) => {
      this.gatewayData = []
      console.log("gateway submit====", res);

      if (res.status) {
        this.currentPageLength = parseInt(res.totalLength)
        for (let i = 0; i < res.success.length; i++) {
          if (res.success[i] != null) {

            this.gatewayData.push({
              i: i + 1,
              id: res.success[i]._id,
              userId: res.success[i].userId,
              gatewayName: res.success[i].gatewayName,
              gatewayId: res.success[i].gatewayId,
              macId: res.success[i].macId != null? res.success[i].macId : '-',
              updatedOn: res.success[i].pingAlertTime ,
              edit: 'edit',
              delete: 'delete_forever'
            })
          }

        }
        this.dataSource = new MatTableDataSource(this.gatewayData);

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

  edit(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '50vh';
    dialogConfig.width = '30vw';
    dialogConfig.data = {
      type: 'gateway',
      data: data
    }

    const dialogRef = this.dialog.open(EditAssetsComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.refreshGateway(this.limit, this.offset)
    });
  }

  delete(data) {
    data._Id = data.id
    if (confirm('Are you sure you want to delete gateway?')) {

      this.api.deleteGateway(data).then((res: any) => {

        console.log("gateway delete====", res);

        if (res.status) {

          this.general.deviceChanges.next(true)
          this.refreshGateway(this.limit, this.offset)
          this.general.openSnackBar(res.success, '')
        }
        else {
          this.general.openSnackBar(res.success == false ? res.message : res.success, '')
          this.general.deviceChanges.next(false)
        }
      }).catch((err: any) => {
        console.log("error===", err)
      })
    }
    else { }
  }

  download() {
    this.fileName = "Registered gateways"
    var data={
      timeZoneOffset:this.general.getZone()
    }
    this.api.downloadRegisteredGateways(data,this.fileName).then((res: any) => {
      console.log("Registerd gateway download==", res)
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
  getUpdate(event) {
 
    this.limit = event.pageSize
    this.offset = event.pageIndex * event.pageSize
    this.refreshGateway(this.limit, this.offset)
  }
}
