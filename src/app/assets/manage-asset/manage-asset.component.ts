import { Component, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ChartType } from 'chart.js';
import { MultiDataSet, Label } from 'ng2-charts';
import { LoginAuthService } from '../../services/login-auth.service';
import { ApiService } from '../../services/api.service';
import { GeneralService } from '../../services/general.service';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { MatOption } from '@angular/material/core';

@Component({
  selector: 'app-manage-asset',
  templateUrl: './manage-asset.component.html',
  styleUrls: ['./manage-asset.component.css'],
})
export class ManageAssetComponent implements OnInit {
  @ViewChild('allSelected') private allSelected: MatOption
  assignAssetForm: FormGroup;
  deassignAssetForm: FormGroup;
  findData: any;
  getAssetList: any;
  getDeAssetList: any;
  id: any;
  public doughnutChartLabels: string[] = ['Device', 'Gateways', 'Coin'];
  public doughnutChartData: any = [0, 0, 0];
  public doughnutChartData1: any = [0, 0, 0];
  public doughnutChartData2: any = [0, 0, 0];
  countActive: any = [];
  countOffline: any = [];
  countReg: any = [];
  chartOptions = {
    responsive: true,
  };
  interval : any;
  public colors: Array<any> = [
    {
      backgroundColor: ['rgb(21,157,7)', 'rgb(255,165,7)', 'rgb(5,120,200)'],
    },
  ];

  public offlinecolors: Array<any> = [
    {
      backgroundColor: ['rgb(255,165,7)', 'rgb(21,157,7)', 'rgb(5,120,200)'],
    },
  ];
  public Activecolors: Array<any> = [
    {
      backgroundColor: ['rgb(255,165,7)', 'rgb(21,157,7)', 'rgb(5,120,200)'],
    },
  ];
  constructor(
    private login: LoginAuthService,
    private api: ApiService,
    private general: GeneralService,
    private fb: FormBuilder,
    public dialog: MatDialog
  ) { 
    this.general.deviceChanges.subscribe((res)=>{
      console.log(res)
      if(res){
        this.devicesCount();
        this.getAssignAssetList();
        this.getDeAssignAssetList();
      }
    })
  }

  ngOnInit(): void {
    this.assignAssetForm = this.fb.group({
      deviceId: ['', Validators.required],
      deviceName: ['', Validators.required],
    });
    this.deassignAssetForm = this.fb.group({
      deviceId: ['', Validators.required],
    });
    // this.doughnutChartData=this.countActive
    // this.doughnutChartData1=this.countOffline
    // this.doughnutChartData2=this.countReg

    this.devicesCount();
    // this.refreshDevice();
    this.getAssignAssetList();
    this.getDeAssignAssetList();
    this.login.loginCheckData.subscribe(res=>{
      if(!res.other){
        this.clearTimeInterval()
      }
    })
    this.interval = setInterval(()=>{
      this.devicesCount();
    },10000)
  }

  ngOnDestroy() {
    this.clearTimeInterval()
  }

  clearTimeInterval(){
    clearInterval(this.interval);
  }

  devicesCount() {
    this.api
      .allDeviceCount()
      .then((res: any) => {

        console.log('allDeviceCount count====', res);
        if (res.success) {
          this.countActive = res.success.online;
          this.countOffline = res.success.offline;
          this.countReg = res.success.registered;
          this.doughnutChartData = [
            this.countActive.deviceCount,
            this.countActive.gatewayCount,
            this.countActive.coinCount,
          ];
          this.doughnutChartData1 = [
            this.countOffline.deviceCount,
            this.countOffline.gatewayCount,
            this.countOffline.coinCount,
          ];
          this.doughnutChartData2 = [
            this.countReg.deviceCount,
            this.countReg.gatewayCount,
            this.countReg.coinCount,
          ];
          console.log('this.doughnutChartData2', this.doughnutChartData2);
        }
        else {
        }
      })
      .catch((err: any) => {
        console.log('error===', err);
      });
  }

  getAssetInfo(a) {
    this.id = a._id;
    // this.userId=a.userId
  }
  getAssignAssetList() {
    this.api
      .assignAssetList()
      .then((res: any) => {

        console.log('assignAsset list res====', res);
        if (res.status) {
          this.getAssetList = res.success;
        }
        else {
          this.getAssetList = []
        }
      })
      .catch((err: any) => {
        console.log('error===', err);
      });
  }

  getDeAssignAssetList() {
    this.api
      .deassignAssetList()
      .then((res: any) => {

        console.log('deassignAsset list res====', res);
        if (res.status) {
          this.getDeAssetList = res.success;
        }
        else {
          this.getDeAssetList = [];

        }
      })
      .catch((err: any) => {
        console.log('error===', err);
      });
  }

  assignAsset(data) {
    data._id = this.id;
    // data.userId=this.userId
    console.log('assign data==', data);
    if (this.assignAssetForm.valid) {

      this.api
        .assignAsset(data)
        .then((res: any) => {

          console.log('assignAsset res====', res);
          if (res.status) {
            this.assignAssetForm.reset()
            this.general.openSnackBar(res.message, '');
            this.assignAssetForm.reset()
            this.getAssignAssetList();
            this.getDeAssignAssetList();
            this.general.deviceChanges.next(true)
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '')
            this.general.deviceChanges.next(false)
          }
        })
        .catch((err: any) => {
          console.log('error===', err);
        });
    }
  }

  deassignAsset(data) {
     console.log("data==",data)
    // data.userId=this.userId
    if (this.deassignAssetForm.valid) {

      this.api
        .deassignAsset(data)
        .then((res: any) => {

          console.log('De assignAsset res====', res);
          if (res.status) {
            this.deassignAssetForm.reset()
            this.getAssignAssetList()
            this.getDeAssignAssetList();
            this.general.deviceChanges.next(true)
            this.general.openSnackBar(res.success, '');
          }
          else {
            this.general.openSnackBar(res.success == false ? res.message : res.success, '')
            this.general.deviceChanges.next(false)
          }
        })
        .catch((err: any) => {
          console.log('error===', err);
        });
    }
  }
  toggleAllSelectionDevice(formData) {

    if (this.allSelected.selected) {
      formData.controls.deviceId.patchValue([...this.getDeAssetList.map(obj => obj.deviceId), 0])
    }
    else {
      formData.controls.deviceId.patchValue([])
    }
  }
}
