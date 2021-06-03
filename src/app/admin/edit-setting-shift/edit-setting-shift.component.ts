import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';
import { ApiService } from '../../services/api.service';
import { GeneralService } from '../../services/general.service';
import { LoginAuthService } from '../../services/login-auth.service';
import * as moment from 'moment'
@Component({
	selector: 'app-edit-setting-shift',
	templateUrl: './edit-setting-shift.component.html',
	styleUrls: ['./edit-setting-shift.component.css']
})
export class EditSettingShiftComponent implements OnInit {
	shiftForm: FormGroup
	loginData: any
	shifts: any = []
	constructor(
		public dialogRef: MatDialogRef<EditSettingShiftComponent>,
		@Inject(MAT_DIALOG_DATA) data,
		private api: ApiService,
		private general: GeneralService,
		private login: LoginAuthService,
		private fb: FormBuilder,
	) {
		this.shiftForm = this.fb.group({
			items: this.fb.array([])
		});

	}

	ngOnInit(): void {
		this.loginData = this.login.getLoginDetails()
		this.refreshShift()
	}
	refreshShift() {
		var data = {
			userId: this.loginData.userData
		}
		this.api.getUserShiftSuperAdmin(data).then((res: any) => {
			console.log("shift  data ======", res);
			if (res.status) {
				this.shifts = res.success
				console.log("shift  data ======", this.shifts);

				for (let i = 0; i < res.success.length; i++) {
					var dateobj = new Date()
					var year = dateobj.getFullYear();
					var month = dateobj.getMonth() + 1
					var day = dateobj.getDate()
					var date = month + '/' + day + '/' + year

					var time1 = date + " " + this.shifts[i].startTime + ':00 UTC'
					var time2 = date + " " + this.shifts[i].endTime + ':00 UTC'
					time1 = new Date(time1).toString()
					time2 = new Date(time2).toString()

					var h = new Date(time1).getHours()
					var m = new Date(time1).getMinutes()
					var h1 = new Date(time2).getHours()
					var m1 = new Date(time2).getMinutes()
					var hh = h <= 9 && h >= 0 ? "0" + h : h;
					var mm = m <= 9 && m >= 0 ? "0" + m : m;
					var hh1 = h1 <= 9 && h1 >= 0 ? "0" + h1 : h1;
					var mm1 = m1 <= 9 && m1 >= 0 ? "0" + m1 : m1;

					this.shifts[i].startTime = (hh + ':' + mm)
					this.shifts[i].endTime = (hh1 + ':' + mm1)
				}


				const control = <FormArray>this.shiftForm.controls.items;
				control.controls = [];
				for (var i = 0; i < this.shifts.length; i++) {
					control.push(this.fb.group(
						{
							shiftObjectId: [this.shifts[i]._id],
							userId: [this.shifts[i].userId],
							shiftName: [this.shifts[i].shiftName],
							startTime: [this.shifts[i].startTime],
							endTime: [this.shifts[i].endTime],
						}
					))
				}
			}
		})
	}



	submit(a) {
		console.log(a)
		var cdt1 = moment(a.startTime, 'HH:mm:ss')
		var cdt2 = moment(a.endTime, 'HH:mm:ss')
		var times1 = moment(cdt1).format("YYYY/MM/DD HH:mm:ss")
		var times2 = moment(cdt2).format("YYYY/MM/DD HH:mm:ss")

		if (times1 > times2) {
			times2 = moment(cdt2).add(1, 'days').format("YYYY/MM/DD HH:mm:ss")
		}
		var times = moment(times2, "YYYY/MM/DD HH:mm:ss").diff(moment(times1, "YYYY/MM/DD HH:mm:ss"))
		var d = moment.duration(times)
		var minhour = (d.hours() + ":" + d.minutes()).split(":")
		if ((parseInt(minhour[0]) >= 9 && (parseInt(minhour[1]) >= 0 && parseInt(minhour[1]) <= 59))) {
			var dateobj = new Date()
			var year = dateobj.getFullYear();
			var month = dateobj.getMonth() + 1
			var day = dateobj.getDate()
			var date = month + '/' + day + '/' + year

			var time1 = date + " " + a.startTime
			var time2 = date + " " + a.endTime
			time1 = new Date(time1).toUTCString()
			time2 = new Date(time2).toUTCString()
			var h = new Date(time1).getUTCHours()
			var m = new Date(time1).getUTCMinutes()
			var h1 = new Date(time2).getUTCHours()
			var m1 = new Date(time2).getUTCMinutes()
			var hh = h <= 9 && h >= 0 ? "0" + h : h;
			var mm = m <= 9 && m >= 0 ? "0" + m : m;
			var hh1 = h1 <= 9 && h1 >= 0 ? "0" + h1 : h1;
			var mm1 = m1 <= 9 && m1 >= 0 ? "0" + m1 : m1;

			a.startTime = hh + ':' + mm
			a.endTime = hh1 + ':' + mm1
			console.log("a===", a)

			this.api.updateUserShiftSuperAdmin(a).then((res: any) => {
				console.log("shift edit==", res)
				if (res.status) {
					var msg = 'Shift updated Successfully'
					this.general.openSnackBar(msg, '')
				}
				this.refreshShift()
			})
		}
		else if ((parseInt(minhour[0]) == 9 && parseInt(minhour[1]) < 0) || parseInt(minhour[0]) < 9) {
			alert('Time range should be minimum of 09 hours.')
		}
	}


	delete(a) {
			if (confirm("Are you sure you want to delete the shift")) {
			this.api.deleteUserShiftSuperAdmin(a).then((res: any) => {
				console.log("shift delete==", res)
				if (res.status) {
					var msg = 'Shift deleted Successfully'
					this.general.openSnackBar(msg, '')
				}
				this.refreshShift()
			})
		}
	}
}
