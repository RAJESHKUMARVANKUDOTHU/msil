import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router'
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { MatSort } from '@angular/material/sort';
import { FormGroup, Validators, FormBuilder } from '@angular/forms';
import { LoginAuthService } from '../../services/login-auth.service';
import { ApiService } from '../../services/api.service';
import { GeneralService } from '../../services/general.service';

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './admin-dashboard.component.html',
  styleUrls: ['./admin-dashboard.component.css']
})
export class AdminDashboardComponent implements OnInit {
  @ViewChild(MatSort) sort: MatSort;
  @ViewChild(MatPaginator, { static: true }) paginator: MatPaginator;
  displayedColumns: string[] = ["i", 'userName','apiKey', 'updatedAt','settings'];
  dataSource: any = []
  addUserForm: FormGroup
  loginData: any
  getUserList: any = []
  passwordType: string = 'password';
  passwordIcon: string = 'visibility_off';
  constructor(
    private login: LoginAuthService,
    private router: Router,
    private fb: FormBuilder,
    private api: ApiService,
    private general: GeneralService) { }

  ngOnInit(): void {
    this.loginData = this.login.getLoginDetails()

    this.addUserForm = this.fb.group({
      userName: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required]
    })

    this.getAdmins()

  }
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'visibility_off' ? 'visibility' : 'visibility_off';
  }

  addUser(data) {
    console.log("data===", data)
    if (this.addUserForm.valid) {
      try {
        this.api.createUsers(data).then((res: any) => {
          console.log("created user res===", res)
          if (res.status) {
            this.addUserForm.reset()
            this.general.openSnackBar(res.success,'')
            this.getAdmins()
          }
          else { 
            this.general.openSnackBar(!res.success?res.message:res.success,'')
          }
        })
          .catch((err) => {
            console.log("err======", err)
          })
      }
      catch (err) {
        console.log("err======", err)
      }
    }
  }

  getAdmins() {
    this.getUserList = []
    this.api.viewAdmins().then((res: any) => {

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
  setting(data){
    console.log("data",data)
   
    this.general.updateItem('sensegiz','userData',data)
    this.router.navigate(['/admin-settings'])
  }

  // isDeleted(data){
  //   if(data.isDeleted=='N'){
  //     data.isDeleted=data.isDeleted=='Y'?'N':'Y'
  //      this.api.deleteUser(data).then((res:any)=>{
  //       console.log("deleted user res===",res)
  //       if(res.status){
  //         }
  //     }).catch((err)=>{
  //       console.log("err======",err)
  //     }) 
  //   }
  // }

}
