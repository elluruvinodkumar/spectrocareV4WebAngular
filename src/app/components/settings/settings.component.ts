import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar } from '@angular/material';

interface SearchByValue {
  viewValue: string;
}
interface Countries {
  viewValue: string;
}
interface DateFormat {
  viewValue: string;
}
interface TimeFormatType {
  viewValue: string;
}
interface TimeFormat {
  viewValue: string;
}
interface Unit {
  viewValue: string;
}
@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
  signInRes: any;
  signObj: any;
  titleArray: any =
    {
      title: "Admin Center",
      subTitle: "Settings",
      img: "assets/images/ui/Icons/1x/admin center.png"
    };
  searchByValue: SearchByValue[] = [
    { viewValue: 'English' },
    { viewValue: 'Chinese' },
    { viewValue: 'Japanese' },
    { viewValue: 'Spanish' }
  ];
  countries: Countries[] = [
    { viewValue: 'United States' },
    { viewValue: 'China' },
    { viewValue: 'Japan' },
    { viewValue: 'Taiwan' },
    { viewValue: 'India' }
  ];
  dateFormat: DateFormat[] = [
    { viewValue: 'yy/dd/mm' },
    { viewValue: 'yy/mm/dd' },
    { viewValue: 'mm/yy/dd' },
    { viewValue: 'mm/dd/yy' },
    { viewValue: 'dd/mm/yy' },
    { viewValue: 'dd/yy/mm' }
  ];
  timeFormatType: TimeFormatType[] = [
    { viewValue: '12 Hours' },
    { viewValue: '24 Hours' }
  ];
  timeFormat: TimeFormat[] = [
    { viewValue: 'HH/MM/SS' }
  ];
  unit: Unit[] = [
    { viewValue: 'Metric' },
    { viewValue: 'Meter' },
    { viewValue: 'Centimeter' },
    { viewValue: 'Grams' },
    { viewValue: 'Kilograms' }
  ];
  isViewHospitalDepartment: boolean = false;
  isViewHospitalRoles: boolean = false;
  isViewHospitalServiceFees: boolean = false;
  isLoading: boolean = false;
  loading: boolean;
  addAdminPersonalSettingsForm: FormGroup;
  addAdminPersonalSettingsObj: any;
  isValue: any;
  constructor(private router: Router, private fb: FormBuilder,
    private loginService: LoginService, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.loading = true;
    this.signInRes = localStorage.getItem("SignInRes");
    this.signObj = JSON.parse(this.signInRes);
    this.callHospitalDepartments();
    this.addAdminPersonalSettingsForm = this.fb.group({
      language: [""],
      country: [""],
      dateFormat: [""],
      timeFormatType: [""],
      timeFormat: [""],
      unit: [""]
    })
  }

  addAdminPersonalSettingsSubmit() {
    this.isLoading = true;

    let payload = {

      "language": '' + this.addAdminPersonalSettingsForm.value.language,
      "country": '' + this.addAdminPersonalSettingsForm.value.country,
      "dateFormat": '' + this.addAdminPersonalSettingsForm.value.dateFormat,
      "timeFormatType": '' + this.addAdminPersonalSettingsForm.value.timeFormatType,
      "timeFormat": '' + this.addAdminPersonalSettingsForm.value.timeFormat,
      "unit": '' + this.addAdminPersonalSettingsForm.value.unit

    }

    this.addAdminPersonalSettingsObj = {
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
      "userID": this.signObj.hospitalAdmin.userID,
      "personalSettings": payload
    }
    console.log("the req data to add admin personal settings : ", this.addAdminPersonalSettingsObj);
    //addAdminPersonalSettings
    this.loginService.addAdminPersonalSettings(this.addAdminPersonalSettingsObj, this.signObj.access_token).
      subscribe(
        (res) => {
          console.log("res from add admin personal settings : ", res)
          if (res.response === 3) {
            this.isLoading = false;
            this.loading = false;
            //this.illnessMedicationID = res.illnessMedicationID;
            //this.viewAttachment();
            //alert(res.message);
            this.openSnackBar(res.message, "");
            //this.ngOnInit();
          }
          else if (res.response === 0) {
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log(err)
          }
        })


  }
  //Tab Change Event
  onTabChange(event) {
    console.log("event", event)
  }

  showData(letSearch: string) {
    console.log("Print Value", letSearch);
    if (letSearch == "All") {
      //this.term = ""
    } else {
      //this.term = letSearch
    }
  }

  callHospitalDepartments() {
    this.isValue = 1;
    this.isViewHospitalDepartment = true;
    this.isViewHospitalRoles = false;
    this.isViewHospitalServiceFees = false;
  }
  callHospitalRoles() {
    this.isValue = 2;
    this.isViewHospitalDepartment = false;
    this.isViewHospitalRoles = true;
    this.isViewHospitalServiceFees = false;
  }
  callServiceFees() {
    this.isValue = 3;
    this.isViewHospitalDepartment = false;
    this.isViewHospitalRoles = false;
    this.isViewHospitalServiceFees = true;
  }
  //Mat Snack Bar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom', // 'top' | 'bottom'
      horizontalPosition: 'right', //'start' | 'center' | 'end' | 'left' | 'right'
    })
  }
  openSnackBar1(message: string, action: string) {
    this._snackBar.open(message, action, {
      panelClass: ['red-snackbar'],
      duration: 5000,
      verticalPosition: 'bottom', // 'top' | 'bottom'
      horizontalPosition: 'right', //'start' | 'center' | 'end' | 'left' | 'right'
    })
  }
}
