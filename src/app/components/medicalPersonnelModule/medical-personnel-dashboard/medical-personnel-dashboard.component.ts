import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { LoginService } from 'src/app/services/login.service';
import { PatientService } from 'src/app/services/patient.service';
import Swiper from 'swiper';
@Component({
  selector: 'app-medical-personnel-dashboard',
  templateUrl: './medical-personnel-dashboard.component.html',
  styleUrls: ['./medical-personnel-dashboard.component.css']
})
export class MedicalPersonnelDashboardComponent implements OnInit {
  baseURL: string = "http://34.231.177.197:3000";
  mySwiper: any = null;
  isValue: any;
  isValue1: any;
  titleArray: any =
    {
      title: "Dashboard",
      subTitle: "",
      img: "../../../assets/images/ui/Icons/1x/dashboard.png"
    };
  patientByDepartment: any[] = [
    { "name": "Cardiology", "patients": "23" },
    { "name": "Neurology", "patients": "30" },
    { "name": "Urology", "patients": "45" },
    { "name": "Surgery", "patients": "20" },
    { "name": "Orthopedics", "patients": "40" },
    { "name": "Oncology", "patients": "10" }
  ];

  yearArray: any[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  monthArray: any[] = ['FirstWeek', 'SecondWeek', 'ThirdWeek', 'FourthWeek'];
  weekArray: any[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  containerArray: any[];
  year1Array: any[] = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  month1Array: any[] = ['FirstWeek', 'SecondWeek', 'ThirdWeek', 'FourthWeek'];
  week1Array: any[] = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  container1Array: any[];
  //containerArray: any[] = this.yearArray;
  todayAppointmentsList: any = []
  // todayAppointmentsList: any =
  //   [{
  //     "lastName": "Bush",
  //     "firstName": "Jarge",
  //     "profilePic": this.baseURL + "/Email-Template-Data/user.png",
  //     "type": "Online",
  //     "time": "10:00 AM"
  //   },
  //   {
  //     "lastName": "Obama",
  //     "firstName": "Barak",
  //     "profilePic": this.baseURL + "/Email-Template-Data/user.png",
  //     "type": "Online",
  //     "time": "10:30 AM"
  //   },
  //   {
  //     "lastName": "Trump",
  //     "firstName": "Donald",
  //     "profilePic": this.baseURL + "/Email-Template-Data/user.png",
  //     "type": "Online",
  //     "time": "11:00 AM"
  //   },
  //   {
  //     "lastName": "Biden",
  //     "firstName": "Joe",
  //     "profilePic": this.baseURL + "/Email-Template-Data/user.png",
  //     "type": "Online",
  //     "time": "11:30 AM"
  //   },
  //   {
  //     "lastName": "Klinton",
  //     "firstName": "Bill",
  //     "profilePic": this.baseURL + "/Email-Template-Data/user.png",
  //     "type": "Online",
  //     "time": "12:00 AM"
  //   }, {
  //     "lastName": "Bush1",
  //     "firstName": "Jarge1",
  //     "profilePic": this.baseURL + "/Email-Template-Data/user.png",
  //     "type": "Online",
  //     "time": "10:00 AM"
  //   },
  //   {
  //     "lastName": "Obama1",
  //     "firstName": "Barak1",
  //     "profilePic": this.baseURL + "/Email-Template-Data/user.png",
  //     "type": "Online",
  //     "time": "10:30 AM"
  //   },
  //   {
  //     "lastName": "Trump1",
  //     "firstName": "Donald1",
  //     "profilePic": this.baseURL + "/Email-Template-Data/user.png",
  //     "type": "Online",
  //     "time": "11:00 AM"
  //   },
  //   {
  //     "lastName": "Biden1",
  //     "firstName": "Joe1",
  //     "profilePic": this.baseURL + "/Email-Template-Data/user.png",
  //     "type": "Online",
  //     "time": "11:30 AM"
  //   },
  //   {
  //     "lastName": "Klinton1",
  //     "firstName": "Bill1",
  //     "profilePic": this.baseURL + "/Email-Template-Data/user.png",
  //     "type": "Online",
  //     "time": "12:00 AM"
  //   }];
  public barChartOptions: ChartOptions
    = {
      responsive: true,
    };
  public barChartLabels: Label[]
  public barChartType: ChartType
  public barChartLegend
  public barChartPlugins = [];
  public barChartData: ChartDataSets[]
  public barChartColors: Color[]

  public lineChartData: ChartDataSets[]
  // = [
  //   { data: [40, 55, 56, 20, 65, 30, 80, 42, 47, 75, 55, 90], label: 'Patients' },
  //   { data: this.getAppointmentCounts(), label: 'Appointments' },
  // ];
  public lineChartLabels: Label[]
  //= ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  public lineChartOptions: ChartOptions = { responsive: true, };
  public lineChartColors: Color[]
    = [
      {
        borderColor: 'black',
      },
    ];
  public lineChartLegend = false;
  public lineChartType = 'line';
  public lineChartPlugins = [];


  //two
  public pieChartData: ChartDataSets[] = [
    { data: [80, 20], label: 'Humans' },
    // { data: [20], label: 'Female' },
  ];
  public pieChartLabels: Label[] = ['Male', 'Female'];
  public pieChartOptions: ChartOptions = { responsive: true, };
  public pieChartColors: Color[] = [
    {
      borderColor: '#bebebe',
      backgroundColor: ['#53b9c6', '#f1f1f1'],
    },
  ];
  public pieChartLegend = false;
  public pieChartType = 'pie';
  public pieChartPlugins = [];


  loading: boolean;
  numberOfPAtient: any;
  signInRes: any;
  signObj: any;
  userID: string;
  listSize: any = 0;
  medicalPersonnellistSize: any = 0;
  medicalPersonnels: any = [];
  listOfAppointments: any = 0;
  appointmentsListSize: any = 0;
  hospitalRegNum: string;
  loginUserID: string;
  constructor(private modalService: NgbModal, private patientService: PatientService,
    private router: Router, private _snackBar: MatSnackBar, private loginService: LoginService,
    private cd: ChangeDetectorRef,) { }

  ngOnInit() {
    this.signInRes = localStorage.getItem("SignInRes");
    if (this.signInRes) {
      this.signObj = JSON.parse(this.signInRes);
      this.userID = localStorage.getItem('userID');

      if (this.signObj && this.signObj.hospitalAdmin) {
        this.hospitalRegNum = this.signObj.hospitalAdmin.hospital_reg_num;
        this.loginUserID = this.signObj.hospitalAdmin.userID;
      }
      else {
        this.hospitalRegNum = this.signObj.medicalPersonnel.profile.userProfile.hospital_reg_num;
        this.loginUserID = this.signObj.medicalPersonnel.profile.userProfile.userID;
      }
      if (this.signObj && this.signObj.hospitalAdmin) {
        let getPatientsData = {
          "byWhom": "admin",
          "byWhomID": this.signObj.hospitalAdmin.userID,
          "category": "All",
          "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
          "token": this.signObj.access_token
        }
        this.getPatientData(getPatientsData)
      }
      else {
        let getPatientsDataObj = {
          "byWhom": "medical personnel",
          "byWhomID": this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id,
          "category": "all",
          "hospital_reg_num": this.signObj.medicalPersonnel.profile.userProfile.hospital_reg_num,
          "token": this.signObj.access_token
        }
        this.getPatientData(getPatientsDataObj);
      }
      this.loading = true;
      this.fetchMedicalPersonnelsData();

      let getHospitalAppointmentsDataObj = {
        "hospital_reg_num": this.hospitalRegNum,
        "adminUserID": this.loginUserID
      }

      this.getHospitalAppointmentsData(getHospitalAppointmentsDataObj)
    }
    this.callYear();
    this.callYear1();
    this.callBarChart();
    this.callLineChart();
    setTimeout(() => {
      this.initiateSwiper();
    }, 100)
  }

  //Swiper
  initiateSwiper() {
    this.mySwiper = new Swiper('.swiper-container', {
      slidesPerView: 5,
      spaceBetween: 5,
      // init: false,

      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      // autoplay: {
      //   delay: 2500,
      //   disableOnInteraction: false,
      // },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 6,
          spaceBetween: 40,
        },
      }
      // And if we need scrollbar
    })


  }

  getAppointmentLabels() {
    var labels = [];
    for (var i = 1; i <= 31; i++) {
      labels.push(i.toString());
    }
    return labels;
  }

  getAppointmentCounts() {
    var counts = [];
    for (var i = 1; i <= 31; i++) {
      counts.push(Math.floor((Math.random() * 100) + 1));
    }
    return counts;
  }

  callBarChart() {
    this.barChartOptions;
    this.barChartLabels = this.containerArray;
    this.barChartType = 'bar';
    this.barChartLegend = false;
    this.barChartPlugins;
    this.barChartData = [
      { data: this.getAppointmentCounts(), label: 'Appointments' },
    ];
    this.barChartColors = [
      {
        borderColor: 'black',
        backgroundColor: '#53b9c6',
      },
    ];

  }

  callLineChart() {
    this.lineChartData = [
      { data: [40, 55, 56, 20, 65, 30, 80, 42, 47, 75, 55, 90], label: 'Patients' },
      { data: this.getAppointmentCounts(), label: 'Appointments' },
    ];
    this.lineChartLabels = this.container1Array;
    this.lineChartOptions;
    this.lineChartColors;
    this.lineChartLegend;
    this.lineChartType;
    this.lineChartPlugins;
  }

  callLastWeek() {
    console.log("Called LastWeek...");
    this.isValue = 1;
    this.containerArray = this.weekArray;
    this.callBarChart()
  }
  callLastMonth() {
    this.isValue = 2;
    this.containerArray = this.monthArray;
    this.callBarChart()
    console.log("Called LastMonth...", this.containerArray);
  }
  callYear() {
    console.log("Called Year...");
    this.isValue = 3;
    this.containerArray = this.yearArray;
    this.callBarChart()
  }

  getPatientData(obj) {
    this.patientService.getPatientData(obj).subscribe(
      (res) => {
        console.log(res)
        if (res.response === 3) {
          this.loading = false;
          this.numberOfPAtient = res.patients;
          this.todayAppointmentsList = res.patients;
          this.cd.detectChanges();
          let count: any[] = this.numberOfPAtient;
          this.listSize = count.length;
          this.initiateSwiper();
        } else if (res.response === 0) {
          this.loading = false;
        }
      }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.loading = false;
          console.log("Client Side Error")
        } else {
          this.loading = false;
          console.log(err)
        }
      })
  }
  //Fetch Medical Personnels Data
  fetchMedicalPersonnelsData() {
    let fetchMedPersonUserData = {
      "userID": this.userID,
      "category": "All",
      "hospital_reg_num": this.hospitalRegNum,
    }
    //Get Medical Personnel Data
    this.loginService.getMedicalPersonnelData(fetchMedPersonUserData, this.signObj.access_token).subscribe(
      (resForFetchMedicalPersonnelData) => {
        if (resForFetchMedicalPersonnelData.response === 3) {
          this.loading = false;
          this.medicalPersonnels = resForFetchMedicalPersonnelData.medicalPersonnels;

          let count: any[] = this.medicalPersonnels;
          this.medicalPersonnellistSize = count.length;
          console.log("Resp from fetched medical personnels : ", resForFetchMedicalPersonnelData);

          console.log("Medical Personnels data : ", this.medicalPersonnels);
        }
        else {
          this.loading = false;
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.loading = false;
          console.log("Client Side Error")
        } else {
          this.loading = false;
          console.log(err)
        }
      }
    );
  }

  getHospitalAppointmentsData(obj) {
    this.loginService.getHospitalAppointmentsData(obj, this.signObj.access_token).subscribe(
      (res) => {
        console.log(res)
        if (res.response === 3) {
          this.loading = false;
          this.listOfAppointments = res.appointments;
          //this.allAppointments = res.appointments;
          let count: any[] = this.listOfAppointments;
          this.appointmentsListSize = count.length;
          console.log("Hospital/Admin having num of Appointments size is : ", this.appointmentsListSize);
          console.log("Appointments Data : ", this.listOfAppointments);

        } else if (res.response === 0) {
          this.loading = false;
        }
      }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.loading = false;
          console.log("Client Side Error")
        } else {
          this.loading = false;
          console.log(err)
        }
      })
  }

  callLastWeek1() {
    console.log("Called LastWeek1...");
    this.isValue1 = 4;
    this.container1Array = this.week1Array;
    this.callLineChart()
  }
  callLastMonth1() {
    console.log("Called LastMonth1...");
    this.isValue1 = 5;
    this.container1Array = this.month1Array;
    this.callLineChart()
  }
  callYear1() {
    console.log("Called Year1...");
    this.isValue1 = 6;
    this.container1Array = this.year1Array;
    this.callLineChart()
  }
  //Mat Snack Bar
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
