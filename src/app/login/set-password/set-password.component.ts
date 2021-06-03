import { Component, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';
import { GeneralService } from '../../services/general.service';
import { ApiService } from '../../services/api.service';
import { ActivatedRoute, Router } from '@angular/router';

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
  constructor(
    private fb: FormBuilder,
    private general: GeneralService,
    private api: ApiService,
    private router: Router,

  ) {

  }

  ngOnInit(): void {
    this.setPasswordForm = this.fb.group(
      {
        userName: ['', [Validators.email, Validators.required]],
        password: ['', Validators.required],
        otp1: ['', Validators.required],
        otp2: ['', Validators.required],
        otp3: ['', Validators.required],
        otp4: ['', Validators.required],
        otp5: ['', Validators.required],
        otp6: ['', Validators.required],
      },
    );
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

  verifyUser(email) {
    console.log("verifyUser data==", email.toString())
    var data = {
      userName: email.toString()
    }
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
          this.general.openSnackBar(res.success == false ? res.message : res.success, '')

        }
      });
    }
  }

  hideShowPassword() {
    this.passwordType = this.passwordType === 'text' ? 'password' : 'text';
    this.passwordIcon =
      this.passwordIcon === 'visibility_off' ? 'visibility' : 'visibility_off';
  }

}
