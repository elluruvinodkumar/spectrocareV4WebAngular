import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-hospital-roles',
  templateUrl: './hospital-roles.component.html',
  styleUrls: ['./hospital-roles.component.css']
})
export class HospitalRolesComponent implements OnInit {
  term: any;
  selectedData: any;
  selectedDoctorSubRole: any = [];
  selectedNurseSubRole: string;
  viewInput: Boolean = false;
  newValue: string;
  newValue1: string;
  medicalRolesData1: any = [];
  doctorSubRoles: any = [];
  nurseSubRoles: any = [];
  medicalRoleOne: string;
  medicalRoleTwo: string;
  signInRes: any;
  signObj: any;
  userID: string;
  loading: boolean;
  isLoading: boolean = false;
  isAlter: boolean = false;
  addDepartmentForm: FormGroup;
  fetchAdministrativeRolesDataObj: any;
  fetchMedicalRolesDataObj: any;
  addHospitalDepartmentsDataObj: any;
  ServicesDataArray: any = [];
  rolesObjArray: any = [];
  readyToSendHospitalRoles: any = [];
  sendedServicesDataArray: any = [];
  addServiceForm: FormGroup;
  //show date
  n = new Date();
  y = this.n.getFullYear();
  m = this.n.getMonth() + 1;
  d = this.n.getDate();
  presentDate = this.m + "/" + this.d + "/" + this.y;
  hospitalMedicalReoles: any = [];
  hospitalNurseRoles: any = [];
  constructor(private loginService: LoginService, private fb: FormBuilder,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.signInRes = localStorage.getItem("SignInRes");
    if (this.signInRes) {
      this.signObj = JSON.parse(this.signInRes);
      this.userID = localStorage.getItem('userID');
      //this.fetchHospitalDepartmentsData();

    }
    this.fetchAdministrativeRolesData();
    this.fetchMedicalRolesData();
    this.loading = true;
    //this.selectedData = this.departmentsData;
    this.addServiceForm = this.fb.group({
      serviceHistory: this.fb.array([

      ])
    });

  }

  //Fetch Administrative Roles
  fetchAdministrativeRolesData() {
    this.selectedData = [];
    this.rolesObjArray = [];
    let fetchAdministrativeRolesDataObj = {
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
    }
    console.log("req for fetch administrative roles : ", fetchAdministrativeRolesDataObj);
    //Get fetchHospitalDepartmentsDataObj
    this.loginService.getAdministrativeRolesData(fetchAdministrativeRolesDataObj, this.signObj.access_token).subscribe(
      (resForFetchAdministrativeRolesData) => {
        if (resForFetchAdministrativeRolesData.response === 3) {
          this.loading = false;
          this.selectedData = [];
          this.rolesObjArray = [];
          this.selectedData = resForFetchAdministrativeRolesData.administrativeRoles;

          console.log("before add extra value : ", this.selectedData);

          for (var value of this.selectedData) {
            this.rolesObjArray.push({ name: value, isAlter: true });
          }
          console.log("the new array : ", this.rolesObjArray);

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

  selectDoctorsRole(selectedDoctorSubRole) {
    console.log("the select value ", selectedDoctorSubRole);

  }
  addDepartmentToList() {
    //unshift
    this.rolesObjArray.push({
      name: "",
      //name: [""],
    })
    this.openSnackBar("Record created...", "");

    console.log(" added hosp role data : ", this.rolesObjArray);
  }
  addDepartmentToList1() {
    this.medicalRolesData1.push({
      roleType: "",
      isAlter: true,
      subRoles: []
    })
    console.log(" added new row to medical/clinical roles : ", this.medicalRolesData1);
    this.openSnackBar("Record created...", "");
  }

  editDepartment(index) {
    console.log(index);
    console.log(this.rolesObjArray[index]);
    this.rolesObjArray[index].isAlter = false;
    console.log("data ", this.rolesObjArray);

  }
  editDepartment1(index, selectedInvoicesData) {
    console.log(index, selectedInvoicesData);
    this.medicalRolesData1[index].isAlter = true;
  }
  removeService(index) {
    this.rolesObjArray.splice(index, 1);
  }
  updatedIndexBasedValue(index, name) {
    if (name.value != '') {
      let i = -1;
      i = this.rolesObjArray.findIndex(x => {
        console.log("index value : ", x)
        return x.name.trim().toLowerCase() == name.value.trim().toLowerCase();
      })
      if (i == -1) {
        this.openSnackBar("Administrative-Role added...", "");
        this.rolesObjArray[index] = {
          name: name.value,
          isAlter: true
        }
      }
      else {
        this.openSnackBar1("Administrative-Role is there...", "")
      }
      // this.rolesObjArray[index] = {
      //   name: name.value,
      //   isAlter: true
      // }
    }
    else {
      this.openSnackBar1("Please insert data...", "");
    }

  }
  updatedIndexBasedValue1(index, roleType) {

    console.log("the data : ", roleType, this.medicalRolesData1[index].subRoles);
    if (roleType != "" && this.medicalRolesData1[index].subRoles &&
      this.medicalRolesData1[index].subRoles.length) {
      console.log("list of medical roles: ", this.medicalRolesData1);


      let i = -1;
      i = this.medicalRolesData1.findIndex(x => {
        console.log("index value : ", x)
        return x.roleType.trim().toLowerCase() == roleType.trim().toLowerCase();
      })
      this.medicalRolesData1[index].roleType = roleType;
      this.medicalRolesData1[index].isAlter = false;

      this.medicalRolesData1.forEach(val => {
        return delete val.isAlter
      })
      let obj = {
        "adminManagerUserID": this.signObj.hospitalAdmin.userID,
        "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
        "medicalRoles": this.medicalRolesData1
      }
      console.log("Request data", obj)

      //addMedicalRolesData
      this.loginService.addMedicalRolesData(obj, this.signObj.access_token)
        .subscribe(
          (resForAddMedicalRolesData) => {
            if (resForAddMedicalRolesData.response === 3) {
              this.medicalRolesData1 = [];
              this.loading = false;
              this.openSnackBar(resForAddMedicalRolesData.message, "");
              this.fetchMedicalRolesData();
            }
            else {
              this.openSnackBar1(resForAddMedicalRolesData.message, "");
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
          })

    } else {
      this.openSnackBar("Add required date", "")
    }
  }

  addAdminPersonalSettingsSubmit() {
    this.loading = true;
    console.log("available data : ", this.selectedData);
    //this.ServicesDataArray = [];
    let DataArray: any[] = this.rolesObjArray;
    for (let i = 0; i <= DataArray.length - 1; i++) {
      let aleteredData = DataArray[i];
      delete aleteredData.isAlter;
      this.sendedServicesDataArray.push(aleteredData);
    }
    //let obj = JSON.parse(this.sendedServicesDataArray)
    console.log(this.sendedServicesDataArray);

    for (let i = 0; i <= this.sendedServicesDataArray.length - 1; i++) {
      let obj2 = this.sendedServicesDataArray[i];
      var myobj = JSON.parse(JSON.stringify(obj2));
      var obj3 = myobj.name;
      this.readyToSendHospitalRoles.push(obj3);
    }
    this.addHospitalDepartmentsDataObj = {
      "adminManagerUserID": this.signObj.hospitalAdmin.userID,
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
      "administrativeRoles": Object.assign(this.readyToSendHospitalRoles)
    }

    console.log(this.addHospitalDepartmentsDataObj);


    this.loginService.addAdministrativeRolesData(this.addHospitalDepartmentsDataObj, this.signObj.access_token)
      .subscribe(
        (resForAddDepartmentsData) => {
          if (resForAddDepartmentsData.response === 3) {
            this.loading = false;
            this.openSnackBar(resForAddDepartmentsData.message, "");
            this.fetchAdministrativeRolesData();
          }
          else {
            this.openSnackBar(resForAddDepartmentsData.message, "");
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
        })



  }

  //Fetch Administrative Roles
  fetchMedicalRolesData() {
    let fetchMedicalRolesDataObj = {
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
    }
    console.log("req for fetch medical roles : ", fetchMedicalRolesDataObj);
    //Get fetchHospitalDepartmentsDataObj
    this.loginService.getMedicalRolesData(fetchMedicalRolesDataObj, this.signObj.access_token).subscribe(
      (resForFetchAdministrativeRolesData) => {
        if (resForFetchAdministrativeRolesData.response === 3) {
          this.loading = false;
          let doctorMainRoles = resForFetchAdministrativeRolesData.medicalRoles;
          console.log("DOCTOR Main rol", doctorMainRoles);

          for (var value of doctorMainRoles) {
            this.medicalRolesData1.push({ roleType: value.roleType, isAlter: false, subRoles: value.subRoles });
          }
          this.medicalRoleOne = this.medicalRolesData1[0];
          this.medicalRoleTwo = this.medicalRolesData1[1];
          console.log("fetched medical roles value : ", this.medicalRolesData1);

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
  sendit1(data: any): void {
    this.newValue1 = data;
    console.log("Value", this.newValue1)
  }
  onSearchChange1(searchValue: string): void {
    console.log("keyup value is : ", searchValue);
    //this.doctorSubRoles.push(searchValue)
    console.log(this.doctorSubRoles);

  }
  sendit(data: any): void {
    this.newValue = data;
    console.log("Value", this.newValue)
  }
  addToDoctorSubRoles(index, roleType) {
    console.log(roleType, index);

    // if (roleType != '') {
    //   console.log("added subrole value : ", roleType);
    //   let i = -1;
    //   i = this.medicalRolesData1.findIndex(x => {
    //     console.log("index value : ", x)
    //     return x.subrole.trim().toLowerCase() == roleType.trim().toLowerCase();
    //   })
    //   if (i == -1) {
    //     this.openSnackBar("subrole added...", "");
    //     this.medicalRolesData1[index].subRoles.push(roleType);
    //     this.newValue = "";
    //   }
    //   else {
    //     this.openSnackBar1("subrole is there...", "")
    //   }
    // }

    this.medicalRolesData1[index].subRoles.push(roleType);
    this.newValue = "";
  }
  addDoctorSubRole() {
    console.log("addDoctorSubRole Called");
    this.viewInput = true;
  }
  addHospitalMedicalRoles() {
    this.viewInput = false;
    console.log("List Of Medical Roles : " + this.doctorSubRoles);

    //let DataArray: any[] = this.doctorSubRoles;
    let DataArray: any[] = this.medicalRolesData1;

    for (let i = 0; i <= DataArray.length - 1; i++) {
      let aleteredData = DataArray[i];
      delete aleteredData.isAlter;
      delete aleteredData.viewValue;
      this.hospitalMedicalReoles.push(aleteredData.value);
    }
    console.log("Medical Roles : " + this.hospitalMedicalReoles);
    let DataArray1: any[] = this.nurseSubRoles;
    for (let i = 0; i <= DataArray1.length - 1; i++) {
      let aleteredData = DataArray1[i];
      delete aleteredData.isAlter;
      delete aleteredData.viewValue;
      this.hospitalNurseRoles.push(aleteredData.value);
    }
    console.log("Nurse Roles : " + this.hospitalNurseRoles);

    let medicalRolesObj = {
      "adminManagerUserID": this.signObj.hospitalAdmin.userID,
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
      "medicalRoles": [
        {
          "roleType": "Doctor",
          "subRoles": this.hospitalMedicalReoles
        },
        {
          "roleType": "Nurse",
          "subRoles": this.hospitalNurseRoles
        }
      ]
    }
    console.log("the sended medical roles data : ", medicalRolesObj);

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

  //Tab Change Event
  onTabChange(event) {
    console.log("event", event)
  }

}
