import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar } from '@angular/material';


interface Unit {
  viewValue: string;
}
@Component({
  selector: 'app-hospital-fees',
  templateUrl: './hospital-fees.component.html',
  styleUrls: ['./hospital-fees.component.css']
})
export class HospitalFeesComponent implements OnInit {
  selectedData: any;
  //departmentsData: any = [];

  unit: Unit[] = [
    { viewValue: 'USD' },
    { viewValue: 'INR' },
    { viewValue: 'NT$' },
    { viewValue: 'CNY' },
    { viewValue: 'HKD' }
  ];
  servicesData: any = [
    { "serviceName": "ON-LINE CONSULTATION-STANDARD APPOINTMENT 15 MINS", "cost": "20.96", "vat": "10", "location": "R101", "Items": "Urine test", "Amount": "10", "Issuedate": "2020-03-13", "Status": "Draft" },
    { "serviceName": "ON-LINE CONSULTATION-LONG APPOINTMENT 15-30 MINS", "cost": "30.26", "vat": "10", "location": "R101", "Items": "Urine test", "Amount": "20", "Issuedate": "2020-03-14", "Status": "Paid" },
    { "serviceName": "ON-LINE CONSULTATION-PROLONGED APPOINTMENT 30-45 MINS", "cost": "40.16", "vat": "10", "location": "R101", "Items": "Urine test", "Amount": "50", "Issuedate": "2020-03-23", "Status": "Unpaid" },
    { "serviceName": "Ambulatory Clinics", "cost": "80.60", "vat": "10", "location": "R101", "Items": "Urine test", "Amount": "10", "Issuedate": "2020-04-13", "Status": "Overdue" },
    { "serviceName": "Anesthesia", "cost": "10.52", "vat": "10", "location": "R101", "Items": "Urine test", "Amount": "20", "Issuedate": "2020-02-23", "Status": "Paid" },
    { "serviceName": "Bariatric Medicine/Surgery", "cost": "29.76", "vat": "10", "location": "R101", "Items": "Urine test", "Amount": "60", "Issuedate": "2020-04-31", "Status": "Draft" },
  ];
  servicesData1: any = [];
  ServicesDataArray: any = [];
  term: any;
  signInRes: any;
  signObj: any;
  userID: string;
  loading: boolean;
  isLoading: boolean = false;
  //show date
  n = new Date();
  y = this.n.getFullYear();
  m = this.n.getMonth() + 1;
  d = this.n.getDate();
  presentDate = this.m + "/" + this.d + "/" + this.y;
  constructor(private fb: FormBuilder, private loginService: LoginService,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.signInRes = localStorage.getItem("SignInRes");
    if (this.signInRes) {
      this.signObj = JSON.parse(this.signInRes);
      this.userID = localStorage.getItem('userID');
    }
    this.loading = true;
    this.fetchServicesData();
  }

  removeService(index, selectedservicesData1) {
    console.log(index, selectedservicesData1);

    this.servicesData1.splice(index, 1);
    //deleteServicesData
    let removeServiceObj = {
      "adminUserID": selectedservicesData1.adminUserID,
      "hospital_reg_num": selectedservicesData1.hospital_reg_num,
      "serviceID": selectedservicesData1.serviceID
    }
    this.loginService.deleteServicesData(removeServiceObj, this.signObj.access_token).subscribe(
      (resForRemoveServiceData) => {
        if (resForRemoveServiceData.response === 3) {
          this.loading = false;
          console.log("success message : ", resForRemoveServiceData.message);

        }
        else {
          console.log("failed message : ", resForRemoveServiceData.message);

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
  updatedIndexBasedValue(index, serviceName, serviceCost, serviceVATPercent, currency) {

    if (serviceName.value != '' && serviceCost.value != '' && serviceVATPercent.value != '' && currency.value != '') {
      this.servicesData1[index] = {
        serviceName: serviceName.value,
        serviceCost: serviceCost.value,
        serviceVATPercent: serviceVATPercent.value,
        currency: currency.value,
        isAlter: true
      }
    }
    else {
      this.openSnackBar1("Insert values...", "");
      console.log("insert values");
    }

    let addServiceObject = {
      adminUserID: this.signObj.hospitalAdmin.userID,
      hospital_reg_num: this.signObj.hospitalAdmin.hospital_reg_num,
      serviceName: serviceName.value,
      serviceCost: serviceCost.value,
      serviceVATPercent: serviceVATPercent.value,
      isAvailable: true,
      currency: currency.value
    }

    console.log(addServiceObject);

    this.loginService.addServicesData(addServiceObject, this.signObj.access_token).subscribe(
      (resForAddServiceData) => {
        if (resForAddServiceData.response === 3) {
          this.loading = false;
          console.log("response : ", resForAddServiceData);

          this.openSnackBar(resForAddServiceData.message, "");
          console.log("added service id : ", resForAddServiceData.serviceID);

          console.log("success message : ", resForAddServiceData.message);

        }
        else {
          this.openSnackBar1(resForAddServiceData.message, "");
          console.log("failed message", resForAddServiceData.message);

          this.loading = false;
        }
      },
      (err: HttpErrorResponse) => {
        this.openSnackBar1("Please try after sometime...", "");
        if (err.error instanceof Error) {
          this.loading = false;
          console.log("Client Side Error")
        } else {
          this.loading = false;
          console.log(err)
        }
      }
    );

    // }

  }
  editDepartment(index) {
    this.servicesData1[index].isAlter = false;
    console.log("data ", this.servicesData1);

  }
  //Fetch Administrative Roles
  fetchServicesData() {
    let fetchServicesDataObj = {
      "requestedByWhom": "admin",
      "requestedPersonID": this.signObj.hospitalAdmin.userID,
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
    }
    console.log("req for fetch medical roles : ", fetchServicesDataObj);
    //Get fetchHospitalDepartmentsDataObj
    this.loginService.getServicesData(fetchServicesDataObj, this.signObj.access_token).subscribe(
      (resForFetchAdministrativeRolesData) => {
        if (resForFetchAdministrativeRolesData.response === 3) {
          this.loading = false;
          this.servicesData1 = resForFetchAdministrativeRolesData.services;

          console.log("fetched services data value : ", this.servicesData1);
          for (let i = 0; i <= this.servicesData1.length - 1; i++) {
            //console.log("the for loop data : ", this.selectedData[i]);
            //this.ServicesDataArray.push(Object.assign({name:this.selectedData[i]}, { isAlter: true }));
            this.ServicesDataArray.push(Object.assign(this.servicesData1[i], { isAlter: true }));
            //console.log(this.selectedData[i]);
          }
          console.log("after add extra value : ", this.ServicesDataArray);

        }
        else {
          console.log("failed case", resForFetchAdministrativeRolesData.message);

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

  addService() {
    this.servicesData1.push({
      adminUserID: this.signObj.hospitalAdmin.userID,
      hospital_reg_num: this.signObj.hospitalAdmin.hospital_reg_num,
      serviceName: "",
      serviceCost: "",
      serviceVATPercent: "",
      isAvailable: true,
      currency: ""
    })

    this.openSnackBar("Record created, please insert data", "");
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

