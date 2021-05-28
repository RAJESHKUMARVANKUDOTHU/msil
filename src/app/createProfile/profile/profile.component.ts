import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA, MatDialogConfig } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoginAuthService } from '../../services/login-auth.service';
import { ApiService } from '../../services/api.service';
import { GeneralService } from '../../services/general.service';
import { EditProfileComponent } from '../../createProfile/edit-profile/edit-profile.component';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  addSubUserForm: FormGroup
  displayedColumns: string[] = ["i", 'userName','department','role', 'updatedAt', 'edit', 'isDeleted'];
  dataSource: any = []
  getUserList: any = []
  passwordType: string = 'password';
  passwordIcon: string = 'visibility_off';
  constructor(
    public dialog: MatDialog,
    private login: LoginAuthService,
    private router: Router,
    private fb: FormBuilder,
    private general: GeneralService,
    private api: ApiService
  ) { }

  ngOnInit(): void {
    this.addSubUserForm = this.fb.group({
      userName: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      role: ['', Validators.required],
      department: ['']
    },
      {
        validators: this.formValidator(),
      });

    this.getUsers()
  }

  formValidator() {
    return (formGroup: FormGroup) => {
      const type = formGroup.get('role');
      const dept = formGroup.get('department');

      if (type.value == "subAdminRole") {
        if (dept.value != '') {
          dept.setErrors(null)
          return
        }
        else {
          dept.setErrors(

            {
              required: true
            })
          return
        }
      }
      else {
        dept.setErrors(null)
        return null
      }
    }
  }
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'visibility_off' ? 'visibility' : 'visibility_off';
  }

  addSubUser(data) {
    console.log("data===", data)
    if (this.addSubUserForm.valid) {
      try {
        this.api.createSubUsers(data).then((res: any) => {
          console.log("created sub user res===", res)
          if (res.status) {
            this.getUsers()
            this.addSubUserForm.reset()
            this.general.openSnackBar(res.success, '')
          }
        })
          .catch((err) => {
            console.log("error======", err)
          })
      }
      catch (err) {
        console.log("err======", err)
      }
    }
  }

  getUsers() {
    this.getUserList = []
    this.api.viewUsers().then((res: any) => {
      console.log("get user res===", res)
      if (res.status) {
        this.getUserList = res.success
        this.dataSource = new MatTableDataSource(this.getUserList);

        setTimeout(() => {
          this.dataSource.sort = this.sort;
          this.dataSource.paginator = this.paginator
        })
      }
      else { }
    }).catch((err) => {
      console.log("err======", err)
    })
  }

  isDeleted(data) {
    data.isDeleted = data.isDeleted == true ? false : true
    data.id = data._id
    console.log("delete sub usser data==", data);

    this.api.deleteSubuser(data).then((res: any) => {
      console.log("delete sub user res===", res)
      if (res.status) {
        this.getUsers()
        this.general.openSnackBar(res.success, '')
      }
      else {
        this.general.openSnackBar(res.success, '')
      }
    }).catch((err) => {
      console.log("error======", err)
    })
  }

  openDailog(data) {
    const dialogConfig = new MatDialogConfig();
    dialogConfig.disableClose = true;
    dialogConfig.autoFocus = true;
    dialogConfig.height = '50vh';
    dialogConfig.width = '30vw';
    dialogConfig.data = {
      data: data
    }

    const dialogRef = this.dialog.open(EditProfileComponent, dialogConfig);

    dialogRef.afterClosed().subscribe(result => {
      this.getUsers()
    });
  }


}
