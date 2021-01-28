import { Component, OnInit } from '@angular/core';
import { ChatService } from 'src/app/services/chat.service';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-medical-personnel-center',
  templateUrl: './medical-personnel-center.component.html',
  styleUrls: ['./medical-personnel-center.component.css']
})
export class MedicalPersonnelCenterComponent implements OnInit {
  baseURL: string = "http://34.231.177.197:3000";
  events: string[] = [];
  opened: boolean;
  listInlist: boolean = false;
  listInPatient: boolean = false;
  listInAppointment: boolean = false;
  listInScreening: boolean = false;
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

  constructor(private loginService: LoginService, private chatService: ChatService) {
    this.loginService.isProfileUpdated.subscribe(data => {
      this.pic = data;
    })
  }

  ngOnInit() {
    let optionsData = {
      userID: localStorage.getItem("medicalPersonnelID"),
      userType: 'Doctor'
    }
    this.chatService.Connect(optionsData);
    this.previewImg = "../../../assets/images/ui/Icons/1x/profile-1.png";
    var signInRes = localStorage.getItem("SignInRes");

    if (signInRes) {
      this.signObj = JSON.parse(signInRes);
      this.userID = localStorage.getItem('userID');
      console.log(this.signObj);

      if (this.signObj.medicalPersonnel.profile.userProfile.profilePic === "") {
        this.pic = "../../../assets/images/ui/Icons/1x/profile-1.png"
      }
      else {
        let a = this.signObj.medicalPersonnel.profile.userProfile.profilePic;
        this.pic = this.baseURL + a
        console.log("picture url from sidebar (admincenter) of the Admin : ", a);
      }

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
    this.listInScreening = false;
  }

  closeSubList() {
    this.listInlist = false;
    this.listInPatient = false;
    this.listInAppointment = false;
    this.listInScreening = false;
  }

  openPatientList() {
    this.listInPatient = !this.listInPatient;
    this.listInlist = false;
    this.listInAppointment = false;
    this.listInScreening = false;
  }
  closePatientList() {
    this.listInPatient = false;
  }

  openAppointmentList() {
    this.listInAppointment = !this.listInAppointment;
    this.listInlist = false;
    this.listInPatient = false;
    this.listInScreening = false;
  }
  closeAppointmentList() {
    this.listInAppointment = false;
  }
  openScreeningList() {
    this.listInScreening = !this.listInScreening;
    this.listInlist = false;
    this.listInPatient = false;
    this.listInAppointment = false;

  }
  closeScreeningList() {
    this.listInScreening = false;
  }

}
