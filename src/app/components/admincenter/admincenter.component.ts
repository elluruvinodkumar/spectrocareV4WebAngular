import { Component, OnInit, ViewChild } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
//import { MatSidenav } from '@angular/material';

@Component({
  selector: 'app-admincenter',
  templateUrl: './admincenter.component.html',
  styleUrls: ['./admincenter.component.css']
})
export class AdmincenterComponent implements OnInit {
  baseURL: string = "http://34.231.177.197:3000";
  events: string[] = [];
  opened: boolean;
  listInlist: boolean = false;
  listInPatient: boolean = false;
  listInAppointment: boolean = false;
  signObj: any;
  userID: string;
  previewImg: any;
  pic: any;
  name: string;
  loginAsAdmin: boolean = false;
  shouldRun = [/(^|\.)plnkr\.co$/, /(^|\.)stackblitz\.io$/].some(h => h.test(window.location.host));

  checkAdministrator: string;
  isAdminSystmMngr: boolean;
  isSidenavOpen: boolean = false;
  //@ViewChild("sidenav", { static: true }) sideNav: MatSidenav;
  constructor(private loginService: LoginService) {
    this.loginService.isProfileUpdated.subscribe(data => {
      this.pic = data;
    })
  }

  ngOnInit() {
    this.previewImg = "../../../assets/images/ui/Icons/1x/profile-1.png";
    var signInRes = localStorage.getItem("SignInRes");

    if (signInRes) {
      this.signObj = JSON.parse(signInRes);
      this.userID = localStorage.getItem('userID');
      console.log(this.signObj);
      //if (this.signObj && this.signObj.hospitalAdmin) {
      this.loginAsAdmin = true;
      if (this.signObj.hospitalAdmin.profilePic === "") {
        this.pic = "../../../assets/images/ui/Icons/1x/profile-1.png"
      }
      else {
        let a = this.signObj.hospitalAdmin.profilePic;
        this.pic = this.baseURL + a
        console.log("picture url from sidebar (admincenter) of the Admin : ", a);
      }
    }
    this.checkAdministrator = localStorage.getItem("AdministratorSystemManager");

    //Giving Access Controls to AdministratorSystemManager & AdministratorGeneral
    if (this.checkAdministrator === "3") {
      this.isAdminSystmMngr = true;
      //this.homeForm.enable()
    }
    else {
      this.isAdminSystmMngr = false;
      //this.homeForm.disable()
    }
  }

  openSideBar() {
    this.isSidenavOpen = true;
  }
  closeSideBar() {
    this.isSidenavOpen = false;
  }

  openSubList() {
    this.listInlist = !this.listInlist;
    this.closePatientList();
    this.closeAppointmentList();
  }

  closeSubList() {
    this.listInlist = false;
    this.listInPatient = false;
    this.listInAppointment = false;
  }

  openPatientList() {
    this.listInPatient = !this.listInPatient;
    this.listInlist = false;
    this.listInAppointment = false;
  }
  closePatientList() {
    this.listInPatient = false;
  }

  openAppointmentList() {
    this.listInAppointment = !this.listInAppointment;
    this.listInlist = false;
    this.listInPatient = false;

  }
  closeAppointmentList() {
    this.listInAppointment = false;
  }

}
