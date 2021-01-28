import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';

import { ChartDataSets, ChartOptions, ChartType } from 'chart.js';
import { Color, Label, MultiDataSet } from 'ng2-charts';
import { PatientService } from 'src/app/services/patient.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {

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
  constructor(private modalService: NgbModal, private patientService: PatientService,
    private router: Router, private _snackBar: MatSnackBar, private loginService: LoginService,) { }

  ngOnInit() {
    this.signInRes = localStorage.getItem("SignInRes");
    if (this.signInRes) {
      this.signObj = JSON.parse(this.signInRes);
      this.userID = localStorage.getItem('userID');

      if (this.signObj && this.signObj.hospitalAdmin) {
        let getPatientsData = {
          "byWhom": "admin",
          "byWhomID": this.signObj.hospitalAdmin.userID,
          "category": "All",
          "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
          "token": this.signObj.access_token
        }
        this.getPatientData(getPatientsData);
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
      } this.loading = true;
      this.fetchMedicalPersonnelsData();

      let getHospitalAppointmentsDataObj = {
        "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
        "adminUserID": this.signObj.hospitalAdmin.userID
      }

      this.getHospitalAppointmentsData(getHospitalAppointmentsDataObj)
    }
    this.callYear();
    this.callYear1();
    this.callBarChart();
    this.callLineChart();
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

          let count: any[] = this.numberOfPAtient;
          this.listSize = count.length;
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
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
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
