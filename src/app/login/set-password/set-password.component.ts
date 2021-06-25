import { Component, OnInit,ViewChild } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GeneralService } from '../../services/general.service';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';
import {ReCaptchaV3Service, ReCaptcha2Component} from 'ngx-captcha';

@Component({
  selector: 'app-set-password',
  templateUrl: './set-password.component.html',
  styleUrls: ['./set-password.component.css']
})
export class SetPasswordComponent implements OnInit {
  setPasswordForm: FormGroup
  passwordType: string = 'password';
  passwordIcon: string = 'visibility_off';
  verified: boolean
  @ViewChild('captchaRef') public captchaRef: ReCaptcha2Component;
  siteKey:string;
  theme:string;
  size:string;

  constructor(
    private fb: FormBuilder,
    private general: GeneralService,
    private api: ApiService,
    private router: Router,
    private reCaptchaV3Service: ReCaptchaV3Service,
  ) {

  }

  ngOnInit(): void {
    this.setPasswordForm = this.fb.group(
      {
        userName: ['', [Validators.email, Validators.required]],
        password: ['', Validators.required],
        recaptcha:['',Validators.required],
        otp1: ['', Validators.required],
        otp2: ['', Validators.required],
        otp3: ['', Validators.required],
        otp4: ['', Validators.required],
        otp5: ['', Validators.required],
        otp6: ['', Validators.required],
      },
    );
this.captchavalidation()
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

  verifyUser(email,a) {
    // console.log("verifyUser data==", email.toString())
      var data = {
        userName:email.toString()
      }
      if(a !=''){
        this.api.forgetPassword(data).then((res: any) => {
          console.log("forgetPassword res==", res)
          if (res.status) {
            this.general.openSnackBar(res.success, '')
            this.verified = true
          }
          else {
            this.general.openSnackBar(res.success, '')
            this.verified = false
          }
        })
      }else{
        this.verified=false;
      }

    }
  submit(value) {
    console.log('value=', value);
    var data = {
      userName: value.userName,
      newPassword: value.password,
      otp: value.otp1 + value.otp2 + value.otp3 + value.otp4 + value.otp5 + value.otp6
    }
    console.log('data=', data);
    if (this.setPasswordForm.valid) {
      this.api.forgetPasswordVerify(data).then((res: any) => {
        console.log('set new pwd==', res);
        if (res.status) {
          this.general.openSnackBar(res.success, '')
          this.router.navigate(['/login']);
        }
        else {
          // this.general.openSnackdBar(res.success == false ? res.message : res.success, '')

        }
      });
    }
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon =
      this.passwordIcon === 'visibility_off' ? 'visibility' : 'visibility_off';
  }
  captchavalidation(){
    this.siteKey="6LdTWk8bAAAAAHH9GbQjQAx9jjWumB_8Eqt1mTs2"
    this.theme= 'normal '
    this.size='normal'
    /*   this.reCaptchaV3Service.execute(this.siteKey, 'submit', (token) => {
      console.log(toke)
    }, {
        useGlobalDomain: false
    }); */
  }
  handleReset(){
  this.captchaRef.resetCaptcha()
  }
}
