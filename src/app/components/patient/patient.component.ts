import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PatientService } from 'src/app/services/patient.service';
import { MatSnackBar } from '@angular/material';

import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';

@Component({
  selector: 'app-patient',
  templateUrl: './patient.component.html',
  styleUrls: ['./patient.component.css']
})
export class PatientComponent implements OnInit {
  baseURL: string = "http://34.231.177.197:3000";
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.Taiwan, CountryISO.China, CountryISO.Malaysia];
  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }
  isLoading: boolean;
  deletePatientRecordObj: any;
  signInRes: any;
  signObj: any;
  userID: string;
  patients: any = [];
  filteredPatients: any = [];
  patientData: any;
  loading: boolean;
  isViewPatient: boolean = true;
  isViewPhysicalRecord: boolean = true;
  patientProfileForm: FormGroup;
  updateFamilyRelationDataForm: FormGroup;
  bodyIndexDataForm: FormGroup;
  previewImg: any;
  patientFamilyHistory: any = [];
  patientImmunizationData: any = [];
  patientPhysicalReocrdsData: any = [];
  patientMedicalReocrdsData: any = [];
  phy: any = [];
  isBodyIndex: boolean = true;
  closeResult: string;
  term: any;
  favoriteSeason: string;
  seasons: string[] = ['Normal', 'Abnormal', 'Not Examined'];
  physicalExamination: any = [];
  listSize: any = 0;
  hospitalRegNum: string;
  titleArray: any =
    {
      title: "Patient",
      subTitle: "",
      img: "assets/images/ui/Icons/patient-medical-module/Group 2494.png"
    };

  @ViewChild('fileInput', { static: true }) el: ElementRef;

  constructor(private modalService: NgbModal, private router: Router, private loginService: LoginService, private fb: FormBuilder,
    private cd: ChangeDetectorRef, private patientService: PatientService, private _snackBar: MatSnackBar) { }

  ngOnInit() {

    this.signInRes = localStorage.getItem("SignInRes");
    this.previewImg = "/assets/images/smile.jpg";
    if (this.signInRes) {
      this.signObj = JSON.parse(this.signInRes);
      this.userID = localStorage.getItem('userID');

      if (this.signObj && this.signObj.hospitalAdmin) {
        this.hospitalRegNum = this.signObj.hospitalAdmin.hospital_reg_num;
      }
      else {
        this.hospitalRegNum = this.signObj.medicalPersonnel.profile.userProfile.hospital_reg_num
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

    }
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
  //Tab Change Event
  onTabChange(event) {
    console.log("event", event)
    // this.isViewPatient = true;
  }

  findText(term: string) {
    this.patients;
    this.filteredPatients;
    if (!term) {
      this.patients = this.filteredPatients;
    } else {
      this.patients = this.filteredPatients.filter(x =>
        x.emailID.trim().toLowerCase().startsWith(term.trim().toLowerCase())
      );
    }
  }

  getPatientData(obj) {
    this.patientService.getPatientData(obj).subscribe(
      (res) => {
        console.log(res)
        if (res.response === 3) {
          this.loading = false;
          this.patients = res.patients;
          this.filteredPatients = res.patients;
          let count: any[] = this.patients;
          this.listSize = count.length;
          console.log("Num Of Patients : ", this.listSize);
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

  openDeletePatientModal(viewDeletePatientContent) {
    this.modalService.open(viewDeletePatientContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  deletePatientData(patient) {
    console.log("Deleted Patient Details : " + patient.patientID);

    this.isLoading = true;
    this.deletePatientRecordObj = {
      medical_personnel_id: patient.medical_personnel_id,
      hospital_reg_num: patient.hospital_reg_num,
      patientID: patient.patientID,
      //medical_record_id: patient.medical_record_id
    };
    this.loginService
      .deletePatientRecordData(
        this.deletePatientRecordObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          if (res.response === 3) {
            this.ngOnInit();
            this.isLoading = false;
            //this.loading = false;
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            //this.fetchPatientPhysicalExamRecords();
            // this.ngOnInit()
            console.log(
              "Res from Patient Phy Exam Data Delete : ",
              res.message
            );
          } else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            this.openSnackBar(res.message, "");
            console.log(
              "Res from Patient Phy Exam Data Delete : ",
              res.message
            );
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err);
          }
        }
      );
  }

}
