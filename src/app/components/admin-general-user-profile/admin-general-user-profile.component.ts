import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-admin-general-user-profile',
  templateUrl: './admin-general-user-profile.component.html',
  styleUrls: ['./admin-general-user-profile.component.css']
})
export class AdminGeneralUserProfileComponent implements OnInit {

  baseURL: string = "http://34.231.177.197:3000";
  adminGeneralUserProfileForm: FormGroup;
  signInRes: any;
  signObj: any;
  token: any;
  userID: any;
  id: string;
  sub: any;
  selectedAdminGenUser: any;
  loading: boolean;
  adminTeamData: any = [];

  checkAdministrator: string;
  isAdminSystmMngr: boolean;

  constructor(private router: Router, private fb: FormBuilder, private loginService: LoginService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {
    this.checkAdministrator = localStorage.getItem("AdministratorSystemManager");

    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    })

    var signInRes = localStorage.getItem("SignInRes");
    if (signInRes) {
      this.signObj = JSON.parse(signInRes);
      console.log(this.signObj);
      this.token = this.signObj.access_token;
    }

    this.adminGeneralUserProfileForm = this.fb.group({
      userID: [""],
      verificationStatus: [""],
      identity: [""],
      preferLanguage: [""],
      hospital_reg_num: [""],
      registerTime: [""],
      firstName: [""],
      lastName: [""],
      emailID: [""],
      department: [""],
      phoneNumber: this.fb.group({
        countryCode: [''],
        phoneNumber: [''],
      })
    });

    //get All Admin General Users Data
    this.signInRes = localStorage.getItem("SignInRes");
    if (this.signInRes) {
      this.signObj = JSON.parse(this.signInRes);
      this.userID = localStorage.getItem('userID');

      let medicalObj = {
        "adminUserID": this.userID
      }
      this.getAdminWithGenUserData(medicalObj);
    }

    //Giving Access Controls to AdministratorSystemManager & AdministratorGeneral
    if (this.checkAdministrator === "3") {
      this.isAdminSystmMngr = true;
      this.adminGeneralUserProfileForm.enable()
    }
    else {
      this.isAdminSystmMngr = false;
      this.adminGeneralUserProfileForm.disable()
    }

  }



  getAdminWithGenUserData(obj) {
    this.loginService.getAdminWithGenUserData(obj, this.token).subscribe(
      (res) => {
        console.log(res)
        if (res.response === 3) {
          this.adminTeamData = res.adminusers;
          console.log("Admin Team Data for Admin Profile : ", this.adminTeamData)
          let index = -1
          index = this.adminTeamData.findIndex(val => {
            //console.log("val data : ",val.userID);
            //console.log("id data : ",this.id);
            return val.userID == this.id
          })
          if (index != -1) {
            this.selectedAdminGenUser = this.adminTeamData[index]
          }
          this.autoAddAdminGeneralUserProfileData(this.selectedAdminGenUser)
        }
        else if (res.response === 0) {
          this.loading = false;
          alert(res.message)
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client Side Error")
        } else {
          console.log(err)
        }
      })
  }

  //Show Admin Data
  autoAddAdminGeneralUserProfileData(adminTeamData) {

    console.log("Admin Team Data : ", adminTeamData);
    this.adminGeneralUserProfileForm.patchValue({
      userID: adminTeamData.userID,
      verificationStatus: adminTeamData.verificationStatus,
      identity: adminTeamData.identity,
      preferLanguage: adminTeamData.preferLanguage,
      hospital_reg_num: adminTeamData.hospital_reg_num,
      registerTime: adminTeamData.registerTime,
      firstName: adminTeamData.firstName,
      lastName: adminTeamData.lastName,
      emailID: adminTeamData.emailID,
      department: adminTeamData.department,
      phoneNumber: {
        phoneNumber: adminTeamData.phoneNumber.phoneNumber,
        countryCode: adminTeamData.phoneNumber.countryCode
      }
    })

    console.log("Admin Gen User Full Details", this.adminGeneralUserProfileForm.value)
  }

  //Update Admin General User Data
  updateAdminGeneralUser() {
    this.loginService.updateAdminGenUser(this.adminGeneralUserProfileForm.value, this.signObj.access_token).subscribe(
      (updateAdminGenUserData) => {
        console.log("req for update admin gen user data : ", updateAdminGenUserData);
        if (updateAdminGenUserData.response === 3) {
          alert(updateAdminGenUserData.message);
        }
        else {
          alert(updateAdminGenUserData.message);
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client Side Error", err);

        } else {
          console.log("Server Side", err)
        }
      }
    );
  }


}
