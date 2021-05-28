import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { GeneralService } from '../../services/general.service';
import { ThemeService } from 'ng2-charts';
@Component({
  selector: 'app-admin-setting-info',
  templateUrl: './admin-setting-info.component.html',
  styleUrls: ['./admin-setting-info.component.css']
})
export class AdminSettingInfoComponent implements OnInit {
  userId: any
  meshForm: FormGroup
  meshData: any = []
  gatewayData: any = []
  constructor(
    public dialogRef: MatDialogRef<AdminSettingInfoComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private api: ApiService,
    private general: GeneralService,
    private fb: FormBuilder,
  ) {
    this.userId = data.data
  }

  ngOnInit(): void {
    this.meshForm = this.fb.group({
      items: this.fb.array([])
    });
    this.getMeshData()
    this.refreshGateway()

  }
  getMeshData() {

    var data = { userId: this.userId }
    console.log("data==", data)
    this.api.getMeshData(data).then((res: any) => {
      this.meshData = []
      if (res.status) {
        console.log("res==", res)
        this.meshData = res.success
        const control = <FormArray>this.meshForm.controls.items;
        control.controls = [];
        for (var i = 0; i < this.meshData.length; i++) {
          control.push(this.fb.group(
            {
              userId: [this.meshData[i].userId],
              meshId: [this.meshData[i].meshId,[Validators.required,Validators.min(0),Validators.max(255)]],
              gatewayId: [this.meshData[i].gatewayId],
              gatewayName: [this.meshData[i].gatewayName],
            }
          ))
        }
      }
    }).catch((err: any) => {
      console.log("err==", err)
    })
  }
  refreshGateway() {
    var data = {
      userId: this.userId
    }
    console.log("user id data==", data);

    this.api.getSuperAdminGatewayData(data).then((res: any) => {

      console.log("gatway submit====", res);
      this.gatewayData = []
      if (res.status) {
        this.gatewayData = res.success
      }

    }).catch((err: any) => {
      console.log("error===", err)
    })
  }
  submit(data) {
    if (this.meshForm.valid) {
      console.log("onSubmit mesh data==", data)
      this.api.updateMeshId(data).then((res: any) => {
        if (res.status) {
          console.log("res==", res)
          this.general.openSnackBar(res.success, '')
        }
      }).catch((err: any) => {
        console.log("err==", err)
      })
    }
  }
}
