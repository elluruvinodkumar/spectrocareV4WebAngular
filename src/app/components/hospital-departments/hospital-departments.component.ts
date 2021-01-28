import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { runInThisContext } from 'vm';
import { MatSnackBar } from '@angular/material';
import { log } from 'console';

@Component({
  selector: 'app-hospital-departments',
  templateUrl: './hospital-departments.component.html',
  styleUrls: ['./hospital-departments.component.css']
})
export class HospitalDepartmentsComponent implements OnInit {
  selectedData: any = [];
  ServicesDataArray: any = [];
  sendedServicesDataArray: any = [];
  //departmentsData: any = [];
  departmentsData: any = [
    { "deptName": "Adult Intensivist", "location": "R101", "Items": "Urine test", "Amount": "10", "Issuedate": "2020-03-13", "Status": "Draft" },
    { "deptName": "Allergy", "location": "R101", "Items": "Urine test", "Amount": "20", "Issuedate": "2020-03-14", "Status": "Paid" },
    { "deptName": "Anesthesia", "location": "R101", "Items": "Urine test", "Amount": "50", "Issuedate": "2020-03-23", "Status": "Unpaid" },
    { "deptName": "Burn/Trauma", "location": "R101", "Items": "Urine test", "Amount": "10", "Issuedate": "2020-04-13", "Status": "Overdue" },
    { "deptName": "Cardiology", "location": "R101", "Items": "Urine test", "Amount": "20", "Issuedate": "2020-02-23", "Status": "Paid" },
    { "deptName": "ENT", "location": "R101", "Items": "Urine test", "Amount": "60", "Issuedate": "2020-04-31", "Status": "Draft" },
  ]
  signInRes: any;
  signObj: any;
  userID: string;
  loading: boolean;
  isLoading: boolean = false;
  isAlter: boolean = false;
  addDepartmentForm: FormGroup;
  addServiceForm: FormGroup;
  addHospitalDepartmentsDataObj: any;
  term: any;
  //show date
  n = new Date();
  y = this.n.getFullYear();
  m = this.n.getMonth() + 1;
  d = this.n.getDate();
  presentDate = this.m + "/" + this.d + "/" + this.y;
  constructor(private loginService: LoginService, private fb: FormBuilder,
    private _snackBar: MatSnackBar,) { }

  ngOnInit() {
    this.selectedData = []
    this.signInRes = localStorage.getItem("SignInRes");
    if (this.signInRes) {
      this.signObj = JSON.parse(this.signInRes);
      this.userID = localStorage.getItem('userID');
      this.fetchHospitalDepartmentsData();

    }
    this.loading = true;
    //this.selectedData = this.departmentsData;

    this.addDepartmentForm = this.fb.group({
      addDepartmentArray: this.fb.array([

      ])
    });

    this.addServiceForm = this.fb.group({
      serviceHistory: this.fb.array([

      ])
    });

  }


  //Fetch fetchHospitalDepartmentsDataObj
  fetchHospitalDepartmentsData() {
    this.selectedData = [];
    //this.isLoading = true;
    let fetchHospitalDepartmentsDataObj = {
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
    }
    console.log("req for fetch hsptl deprtmnts : ", fetchHospitalDepartmentsDataObj);
    //Get fetchHospitalDepartmentsDataObj
    this.loginService.getHospitalDepartmentsData(fetchHospitalDepartmentsDataObj, this.signObj.access_token).subscribe(
      (resForFetchMedicalPersonnelData) => {
        if (resForFetchMedicalPersonnelData.response === 3) {
          this.loading = false;
          //this.isLoading = false;
          this.selectedData = [];
          this.selectedData = resForFetchMedicalPersonnelData.records.departments;
          console.log(resForFetchMedicalPersonnelData);

          console.log("Fetched Departments data before for loop : ", this.selectedData);
          for (let i = 0; i <= this.selectedData.length - 1; i++) {

            this.ServicesDataArray.push(Object.assign(this.selectedData[i], { isAlter: true }));
          }
          // console.log("after add extra value : ", this.ServicesDataArray);

          // console.log("Resp from fetch departments : ", resForFetchMedicalPersonnelData);

          console.log("Fetched Departments data after for loop : ", this.selectedData);
        }
        else {
          //this.isLoading = false;
          console.log("failed case", resForFetchMedicalPersonnelData);

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

  addDepartmentToList() {
    console.log("add dept called");

    this.selectedData.push({
      department: "",
      location: "",
    })
    this.openSnackBar("Record created, please insert data", "");
    // this.selectedData.push({
    //   department: "",
    //   location: "",
    // })
    console.log(" added hosp dept data : ", this.selectedData);

  }

  removeService(index) {
    this.selectedData.splice(index, 1);
  }
  updatedIndexBasedValue(index, depart, loc) {
    if (depart.value != '' && loc.value != '') {
      console.log("added department value : ", depart.value);
      let i = -1;
      i = this.selectedData.findIndex(x => {
        console.log("index value : ", x)
        return x.department.trim().toLowerCase() == depart.value.trim().toLowerCase();
      })
      if (i == -1) {
        this.openSnackBar("department added...", "");
        this.selectedData[index] = {
          department: depart.value,
          location: loc.value,
          isAlter: true
        }
      }
      else {
        this.openSnackBar1("department is there...", "")
      }

    }
    else {
      this.openSnackBar1("Insert values...", "");
      console.log("insert values");
    }
  }
  editDepartment(index) {
    this.selectedData[index].isAlter = false;
    console.log("data ", this.selectedData);

  }

  addAdminPersonalSettingsSubmit() {

    console.log("available data : ", this.selectedData);
    //this.ServicesDataArray = [];
    let DataArray: any[] = this.selectedData;
    for (let i = 0; i <= DataArray.length - 1; i++) {
      let aleteredData = DataArray[i];
      delete aleteredData.isAlter;
      this.sendedServicesDataArray.push(aleteredData);
    }

    this.addHospitalDepartmentsDataObj = {
      "adminManagerUserID": this.signObj.hospitalAdmin.userID,
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
      "departments": this.sendedServicesDataArray
    }

    this.loginService.addHospitalDepartmentsData(this.addHospitalDepartmentsDataObj, this.signObj.access_token)
      .subscribe(
        (resForAddDepartmentsData) => {
          if (resForAddDepartmentsData.response === 3) {
            this.loading = false;
            this.openSnackBar(resForAddDepartmentsData.message, "");

            this.fetchHospitalDepartmentsData();
          }
          else {
            this.openSnackBar(resForAddDepartmentsData.message, "");
          }
        })

  }
  //Mat Snack Bar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      panelClass: ['theme-snackbar'],
      duration: 5000,
      verticalPosition: "bottom", // 'top' | 'bottom'
      horizontalPosition: "right", //'start' | 'center' | 'end' | 'left' | 'right'
    });
  }

  //Mat Snack Bar
  openSnackBar1(message: string, action: string) {
    this._snackBar.open(message, action, {
      panelClass: ['red-snackbar'],
      duration: 5000,
      verticalPosition: "bottom", // 'top' | 'bottom'
      horizontalPosition: "right", //'start' | 'center' | 'end' | 'left' | 'right'
    });
  }
}
