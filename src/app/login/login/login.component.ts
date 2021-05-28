import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { LoginAuthService } from '../../services/login-auth.service';
import { GeneralService } from '../../services/general.service'
import { ApiService } from '../../services/api.service';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  public loginInvalid: boolean;
  passwordType: string = 'password';
  passwordIcon: string = 'visibility_off';
  loginData: any
  verifyOtp: boolean
  disable: boolean
  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private login: LoginAuthService,
    private general: GeneralService,
    private api: ApiService,
  ) { }

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      userName: ['', [Validators.email, Validators.required]],
      password: ['', Validators.required],
      otp1: [''],
      otp2: [''],
      otp3: [''],
      otp4: [''],
      otp5: [''],
      otp6: [''],
    })

  }

  getCodeBoxElement(index) {
    return document.getElementById('codeBox' + index);
  }

  onKeyUpEvent(index, event) {
    const eventCode = event.which || event.keyCode;

    if (index !== 6) {
      this.getCodeBoxElement(index + 1).focus();
    } else {
      this.getCodeBoxElement(index).blur();
    }

    if (eventCode === 8 && index !== 1) {
      this.getCodeBoxElement(index - 1).focus();
    }
  }
  onSubmit(value) {
    this.loginInvalid = false
    this.verifyOtp = false
    if (this.loginForm.valid) {
      try {
        var data = {
          userName: value.userName,
          password: value.password
        }
        console.log("data===", data)
        localStorage.clear()
        this.api.login(data).then((res: any) => {
          console.log("login res===", res)
          this.loginData = res.success
          this.verifyOtp = res.success.isTwoStepAuth == true ? true : false

          if (res.status) {
            if (res.token) {
              localStorage.setItem('token',res.token)
              var start = new Date() as any
              var end = new Date()
              var date = end.setHours(start.getHours() + 1);
              res.success.timer = date
            
              if (this.login.login(res.success)){
                console.log("i stepped")
                this.router.navigate(['/dashboard'])
              }
              else {
                this.loginInvalid = true
              }
            }
            else{
              this.loginInvalid = true
            }
          }
          else {
            this.loginInvalid = true
          }


        }).catch((err) => {
          console.log("err======", err)
        })
      }
      catch (err) {
        this.loginInvalid = true;
      }
    }
  }

  openOTP(value) {
    console.log("otp===", value)
    var data = {
      userId: this.loginData.userId,
      userType: this.loginData.userType,
      otp: value.otp1 + value.otp2 + value.otp3 + value.otp4 + value.otp5 + value.otp6
    }
    console.log("otp sent===", data)
    this.api.verifyTwoStepOtp(data).then((res: any) => {
      console.log("verifyTwoStepOtp res==", res.success)
      if (res.status) {

        this.general.openSnackBar("OTP verified successfully..!!!", '')
        if (res.token) {
          var start = new Date() as any
          var end = new Date()
          var date = end.setHours(start.getHours() + 1);
          res.success.timer = date
          if (this.login.login(res.success)) {
            console.log("i stepped")
            this.router.navigate(['/dashboard'])
          }
        }
      }
      else {

        this.general.openSnackBar("Wrong OTP :-)", '')
        this.loginForm.reset()
      }
    })
  }

  forgetPassword() {
    this.router.navigate(['/set-password'])

  }
  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon = this.passwordIcon === 'visibility_off' ? 'visibility' : 'visibility_off';
  }
}
