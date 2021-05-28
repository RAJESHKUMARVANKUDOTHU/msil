import { Component, OnInit, Inject } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { GeneralService } from '../../services/general.service';
@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styleUrls: ['./edit-profile.component.css']
})
export class EditProfileComponent implements OnInit {
  profileData: any
  editProfile
  constructor(
    public dialogRef: MatDialogRef<EditProfileComponent>,
    @Inject(MAT_DIALOG_DATA) data,
    private fb: FormBuilder,
    private general: GeneralService,
    private api: ApiService
  ) {
    this.profileData = data.data
  }

  ngOnInit(): void {
    this.editProfile = this.fb.group({
      userName: [this.profileData.userName, [Validators.email, Validators.required]],
      role:[this.profileData.role,Validators.required],
      department:[this.profileData.department,Validators.required]
    })
  }

  submit(data) {
    data.id = this.profileData._id
    console.log("edit profile data==", data)

    this.api.updateSubUser(data).then((res: any) => {
      console.log("update sub user res===", res)
      if (res.status) {
        this.general.openSnackBar(res.success, '')
      }
      else { }
    }).catch((err: any) => {
      console.log("error===", err)
    })
  }
}
