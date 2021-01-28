import {
  Component,
  OnInit,
  ViewChild,
  ElementRef,
  ChangeDetectorRef,
} from "@angular/core";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { FormGroup, FormBuilder, FormArray } from "@angular/forms";
import { get } from "http";
import { ActivatedRoute } from "@angular/router";
import { LoginService } from "src/app/services/login.service";
import { HttpErrorResponse, HttpClient } from "@angular/common/http";
import { MatSnackBar } from "@angular/material";

import { PatientProfileComponent } from "../patient-profile/patient-profile.component";
@Component({
  selector: "app-patient-profilee",
  templateUrl: "./patient-profilee.component.html",
  styleUrls: ["./patient-profilee.component.css"],
})
export class PatientProfileeComponent implements OnInit {
  family_history_record_id: any;
  allergy_record_id: any;
  isLoading: boolean = false;
  loading: boolean;
  patientProfileForm: FormGroup;
  editFamilyHistoryForm: FormGroup;
  viewFamilyHistoryForm: FormGroup;
  editAllergiesForm: FormGroup;
  addPatientPhysicalExamForm: FormGroup;
  addPatientScreeningRecordForm: FormGroup;
  previewImg: any;
  refImg: any;
  closeResult: string;
  isViewBottom: boolean = false;
  signInRes: any;
  signObj: any;
  userID: any;
  sub: any;
  id: string;
  patients: any = [];
  patientFamilyHistory: any = [];
  patientFamilyHistoryID: any;
  patientFamilyAllergies: any = [];
  patientPhysicalExamRecords: any = [];
  selectedPatient: any;
  patientObj: any;
  addPatientFamilyHistoryObj: any;
  deletePatientFamilyHistoryObj: any;
  addPatientAllergiesObj: any;
  deletePatientAllergiesObj: any;
  fetchPatientPhysicalExamObj: any;
  deletePatientPhyExamRecordObj: any;
  deleteAllPatientPhyExamRecordObj: any;
  fetchPatientScreeningRecordsObj: any;
  patientScreeningRecords: any = [];
  file: any;
  fileName: any;
  fileSize: any;
  fileValue: any;
  theImg: any;
  previewImg1: any;
  @ViewChild("fileInput", { static: true }) el: ElementRef;
  @ViewChild("autoFocusTest", { static: false }) nativeEl: ElementRef;
  constructor(
    private modalService: NgbModal,
    private fb: FormBuilder,
    private loginService: LoginService,
    private activatedRoute: ActivatedRoute,
    private cd: ChangeDetectorRef,
    private _snackBar: MatSnackBar,
    private patProComponent: PatientProfileComponent, private http: HttpClient
  ) { }

  ngOnInit() {
    this.refImg = "../../../assets/images/ui/Icons/1x/profile-1.png";
    this.loading = true;
    this.sub = this.activatedRoute.params.subscribe((params) => {
      this.id = params["id"];
      this.loginService.id = this.id;
      console.log("id from component : ", this.id);
      console.log("id from login service : ", this.loginService);
    });

    this.addPatientPhysicalExamForm = this.fb.group({
      medical_personnel_id: [""],
      patientID: [""],
      hospital_reg_num: [""],
      medical_record_id: [""],
      profilePic: [""],
    });

    this.addPatientScreeningRecordForm = this.fb.group({
      patientID: [""],
      profilePic: [""],
      recordMoreDetails: [""],
      recordName: [""],
      byWhomName: [""],
      byWhomType: [""],
      byWhomID: [""],
      medical_record_id: [""],
    });

    this.patientProfileForm = this.fb.group({
      patientID: [""],
      medical_record_number: [""],
      firstName: [""],
      lastName: [""],
      gender: [""],
      dob: [""],
      phoneNumber: [""],
      age: [""],
      emailID: [""],
      address: [""],
      city: [""],
      state: [""],
      country: [""],
      pincode: [""],
    });

    this.patientProfileForm.disable();

    this.editFamilyHistoryForm = this.fb.group({
      familyHistory: this.fb.array([]),
    });

    this.editAllergiesForm = this.fb.group({
      allergiesHistory: this.fb.array([]),
    });

    this.signInRes = localStorage.getItem("SignInRes");
    if (this.signInRes) {
      this.signObj = JSON.parse(this.signInRes);
      this.userID = localStorage.getItem("userID");
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
    }
    this.patProComponent.ngOnInit();
  }

  onSearchChange1(searchValue: string): void {
    console.log("changed dob value : ", searchValue.substr(0, 4));
    var d1: any = searchValue.substr(0, 4);
    var presentDate: any = Math.round(new Date().getTime() / 1000)
    console.log("present data : ", presentDate);
    var timestamp: any = presentDate;
    var date = new Date(timestamp * 1000);
    //var formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
    var formattedDate: any = date.getFullYear();

    console.log(formattedDate);
    var calculatedDate: any = formattedDate - d1;
    console.log(calculatedDate);
    this.patientProfileForm.patchValue({
      "age": calculatedDate
    });
    //this.calculateAmount1();
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

  getPatientData(obj) {
    this.loginService.getPatientData(obj).subscribe(
      (res) => {
        console.log("res from rou", res);
        if (res.response === 3) {
          this.loading = false;
          this.patients = res.patients;
          let index = -1;
          index = this.patients.findIndex((val) => {
            return val.patientID == this.id;
          });
          if (index != -1) {
            this.selectedPatient = this.patients[index];
            console.log(
              "selected patient from patient medical module : ",
              this.selectedPatient
            );
            this.autoPatchPatientProfileData(this.selectedPatient);
          }
        } else if (res.response === 0) {
          this.loading = false;
          //alert(res.message)
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.loading = false;
          console.log("Client Side Error");
        } else {
          this.loading = false;
          console.log(err);
        }
      }
    );
  }

  autoPatchPatientProfileData(selectedPatient) {
    console.log("fetched dob :" + selectedPatient.dob.substring(0, 10));
    var timestamp = selectedPatient.dob.substring(0, 10); // replace your timestamp
    var date = new Date(timestamp * 100);
    var formattedDate =
      date.getFullYear() +
      "/" +
      ("0" + (date.getMonth() + 1)).slice(-2) +
      "/" +
      ("0" + date.getDate()).slice(-2);
    console.log("converted dob : " + formattedDate);

    let dob = this.selectedPatient.dob / 1000;
    let unixDates = dob;
    var date1 = new Date(unixDates * 1000);
    let timeToShow =
      date1.getFullYear() +
      "-" +
      ("0" + (date1.getMonth() + 1)).slice(-2) +
      "-" +
      ("0" + date1.getDate()).slice(-2);

    this.patientProfileForm.patchValue({
      patientID: selectedPatient.patientID,
      medical_record_number: selectedPatient.medical_record_id,
      firstName: selectedPatient.firstName,
      lastName: selectedPatient.lastName,
      gender: selectedPatient.gender,
      dob: formattedDate,
      phoneNumber: selectedPatient.phoneNumber.phoneNumber,
      age: selectedPatient.age,
      emailID: selectedPatient.emailID,
      address: selectedPatient.address,
      city: selectedPatient.city,
      state: selectedPatient.state,
      country: selectedPatient.country,
      pincode: selectedPatient.postalCode,
    });
    this.patientObj = {
      hospital_reg_num: this.selectedPatient.hospital_reg_num,
      token: this.signObj.access_token,
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
      patientID: this.selectedPatient.patientID,
      medical_record_id: this.selectedPatient.medical_record_id,
    };
    this.getFamilyHistory(this.patientObj);
    this.getFamilyAllergies(this.patientObj);

    this.fetchPatientPhysicalExamRecords();
    this.fetchPatientScreeningRecords();
  }
  //Patch Family History
  patchFamilyHistory(pfhData) {
    for (let i: number = 0; i <= pfhData.length - 1; i++) {
      this.familyDeseases.push(
        this.fb.group({
          dieseaseName: pfhData[i].dieseaseName,
          relationship: pfhData[i].relationship,
        })
      );
    }
  }
  //Fetch Patient Family History
  getFamilyHistory(obj) {
    this.loginService.getPatientFamilyHistoryData(obj).subscribe(
      (res) => {
        console.log("res from rou", res);
        if (res.response === 3) {

          setTimeout(() => {
            this.loading = false
            console.log("set time out for 5 seconds...");
          }, 5000)
          console.log("the family history res : ", res);
          console.log("the family history res ARRAY : ", res.records);
          this.patientFamilyHistory = res.records.famliyDiseases;
          this.family_history_record_id = res.records.family_history_record_id;
          this.patientFamilyHistoryID = this.patientFamilyHistory;
          console.log("length of array : ", this.patientFamilyHistory);
          this.patchFamilyHistory(this.patientFamilyHistory);
        } else if (res.response === 0) {
          this.loading = false;
          this.patientFamilyHistory = [];
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.loading = false;
          console.log("Client Side Error");
        } else {
          this.loading = false;
          console.log(err);
        }
      }
    );
  }

  //Patch Patient Allergie
  addDarta(data) {
    for (let i: number = 0; i <= data.length - 1; i++) {
      console.log("data", data[i]);
      this.allergiesList.push(
        this.fb.group({
          allergieName: data[i].name,
          notes: data[i].note,
        })
      );
    }
  }
  //Fetch Patient Allergie
  getFamilyAllergies(obj) {
    this.loginService.getPatientAllergiesData(obj).subscribe(
      (res) => {
        console.log("res from fetch patient allergies : ", res);
        if (res.response === 3) {
          this.loading = false;
          this.allergy_record_id = res.records.allergy_record_id;
          console.log("the family allergies : ", res);
          // this.patientFamilyAllergies = res.allergy_records[0].allergies;
          // this.addDarta(this.patientFamilyAllergies)
          // console.log("Fetched Patient Family Allergies Data : ", this.patientFamilyAllergies);

          this.patientFamilyAllergies = res.records.allergies;
          console.log(
            "length of array : ",

            this.patientFamilyAllergies
          );
          this.addDarta(this.patientFamilyAllergies);
          // if (this.patientFamilyAllergies.length >= 1) {
          //   this.patientFamilyAllergies = this.patientFamilyAllergies[0].allergies;
          //   this.addDarta(this.patientFamilyAllergies);
          //   console.log(
          //     "Fetched Patient Family Allergies Data : ",
          //     this.patientFamilyAllergies
          //   );
          // }
          //this.addDarta(this.patientFamilyAllergies)
        } else if (res.response === 0) {
          this.loading = false;
          this.patientFamilyAllergies = [];
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.loading = false;
          console.log("Client Side Error");
        } else {
          this.loading = false;
          console.log(err);
        }
      }
    );
  }

  //get family history
  get familyDeseases() {
    return <FormArray>this.editFamilyHistoryForm.get("familyHistory");
  }

  get familyDiseases() {
    return <FormArray>this.editFamilyHistoryForm.get("familyHistory");
  }
  //Add patient to the family history
  addMember() {
    this.familyDeseases.push(
      this.fb.group({
        dieseaseName: [""],
        relationship: [""],
      })
    );
  }
  //Remove patient from family history
  removeDesease(index) {
    this.familyDeseases.removeAt(index);
  }
  //get allergies
  get allergiesList() {
    return <FormArray>this.editAllergiesForm.get("allergiesHistory");
  }
  //Add allergie to the list
  addAllergie() {
    this.allergiesList.push(
      this.fb.group({
        allergieName: [""],
        notes: [""],
      })
    );
  }
  //Remove allargie from list
  removeAllergie(index) {
    this.allergiesList.removeAt(index);
  }

  deletePatientFamilyHistory() {
    this.isLoading = true;
    //trying to delete using service
    this.deletePatientFamilyHistoryObj = {
      hospital_reg_num: this.selectedPatient.hospital_reg_num,
      patientID: this.selectedPatient.patientID,
      medical_record_id: this.selectedPatient.medical_record_id,
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
    };
    console.log(
      "the req for delete pat fam history obj : ",
      this.deletePatientFamilyHistoryObj
    );

    this.loginService
      .deletePatientFamilyHistoryData(
        this.deletePatientFamilyHistoryObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          console.log("res from delete patient family history  : ", res);
          if (res.response === 3) {
            this.isLoading = false;
            this.loading = false;
            this.modalService.dismissAll();
            this.openSnackBar(res.message, "");
            this.ngOnInit();
            console.log(
              "Res from Patient Family History Data Delete : ",
              res.message
            );
          } else if (res.response === 0) {
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            this.loading = false;
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log(err);
          }
        }
      );
  }

  //Add Family History

  patchFamilyHistoryForm(payLoad) {
    for (let i: number = 0; i <= payLoad.length - 1; i++) {
      this.familyDiseases.push(
        this.fb.group({
          healthCondition: payLoad[i].dieseaseName,
          relationship: payLoad[i].relationship,
          age: this.selectedPatient.age.toString(),
          note: "",
        })
      );
    }
  }

  addFamilyHistorySubmit() {
    //console.log("this.patientFamilyHistoryID is : ",this.patientFamilyHistoryID[0].family_history_record_id);

    this.isLoading = true;
    let payLoad = this.editFamilyHistoryForm.value.familyHistory;
    let diseaseArray: any[] = [];
    for (let i: number = 0; i <= payLoad.length - 1; i++) {
      diseaseArray.push({
        dieseaseName: payLoad[i].dieseaseName, //healthCondition
        relationship: payLoad[i].relationship,
        age: "" + this.selectedPatient.age,
        note: "",
      });
    }
    console.log("Diseases array data from form : ", diseaseArray);
    if (this.patientFamilyHistory.length >= 1) {
      this.addPatientFamilyHistoryObj = {
        hospital_reg_num: this.selectedPatient.hospital_reg_num,
        patientID: this.selectedPatient.patientID,
        medical_record_id: this.selectedPatient.medical_record_id,
        byWhom: "admin",
        byWhomID: this.signObj.hospitalAdmin.userID,
        famliyDiseases: diseaseArray,
        family_history_record_id: this.family_history_record_id,
      };
    } else {
      this.addPatientFamilyHistoryObj = {
        hospital_reg_num: this.selectedPatient.hospital_reg_num,
        patientID: this.selectedPatient.patientID,
        medical_record_id: this.selectedPatient.medical_record_id,
        byWhom: "admin",
        byWhomID: this.signObj.hospitalAdmin.userID,
        famliyDiseases: diseaseArray,
        //family_history_record_id: this.selectedPatient.family_history_record_id,
      };
    }
    console.log(
      "the req for pat family history obj : ",
      this.addPatientFamilyHistoryObj
    );
    this.loginService
      .addPatientFamilyHistoryData(
        this.addPatientFamilyHistoryObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          console.log("res from add patient family history  : ", res);
          if (res.response === 3) {
            this.family_history_record_id = res.family_history_record_id;
            this.isLoading = false;
            this.loading = false;
            this.modalService.dismissAll();
            this.openSnackBar(res.message, "");

            //this.patientFamilyHistory = res.familyDiseases;
            this.ngOnInit();
            //console.log("Res from Patient Family History Data : ", res.famliyDiseases);
          } else if (res.response === 0) {
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            this.loading = false;
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log(err);
          }
        }
      );
  }

  //Add Patient Allergies
  addPatientAllergiesSubmit() {
    this.isLoading = true;
    let payLoad = this.editAllergiesForm.value.allergiesHistory;
    let allergiesArray: any[] = [];
    for (let i: number = 0; i <= payLoad.length - 1; i++) {
      allergiesArray.push({
        name: payLoad[i].allergieName,
        note: payLoad[i].notes,
      });
    }
    console.log("Allergies array data from form : ", allergiesArray);
    if (this.patientFamilyAllergies.length >= 1) {
      this.addPatientAllergiesObj = {
        hospital_reg_num: this.selectedPatient.hospital_reg_num,
        patientID: this.selectedPatient.patientID,
        medical_record_id: this.selectedPatient.medical_record_id,
        byWhom: "admin",
        byWhomID: this.signObj.hospitalAdmin.userID,
        allergies: allergiesArray,
        allergy_record_id: this.allergy_record_id,
      };
    } else {
      this.addPatientAllergiesObj = {
        hospital_reg_num: this.selectedPatient.hospital_reg_num,
        patientID: this.selectedPatient.patientID,
        medical_record_id: this.selectedPatient.medical_record_id,
        byWhom: "admin",
        byWhomID: this.signObj.hospitalAdmin.userID,
        allergies: allergiesArray,
        //allergy_record_id
      };
    }

    console.log(
      "the req for add patient allergies obj : ",
      this.addPatientAllergiesObj
    );
    this.loginService
      .addPatientAllergiesData(
        this.addPatientAllergiesObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          console.log("res from add patient allergies req  : ", res);
          if (res.response === 3) {
            this.isLoading = false;
            this.loading = false;
            this.modalService.dismissAll();
            this.openSnackBar(res.message, "");

            this.patientFamilyAllergies = res.allergies;
            this.ngOnInit();
            console.log("Res from Patient Allergies Data : ", res.allergies);
          } else if (res.response === 0) {
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            this.loading = false;
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log(err);
          }
        }
      );
  }

  deletePatientAllergies() {
    this.isLoading = true;
    //trying to delete using service
    this.deletePatientAllergiesObj = {
      hospital_reg_num: this.selectedPatient.hospital_reg_num,
      patientID: this.selectedPatient.patientID,
      medical_record_id: this.selectedPatient.medical_record_id,
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
    };
    console.log(
      "the req for delete pat fam history obj : ",
      this.deletePatientAllergiesObj
    );

    this.loginService
      .deletePatientAllergiesData(
        this.deletePatientAllergiesObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          console.log("res from delete patient allergies history  : ", res);
          if (res.response === 3) {
            this.isLoading = false;
            this.loading = false;
            this.modalService.dismissAll();
            this.openSnackBar(res.message, "");

            this.ngOnInit();
            console.log(
              "Res from Patient Allergies Data Delete : ",
              res.message
            );
          } else if (res.response === 0) {
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            this.loading = false;
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log(err);
          }
        }
      );
  }

  //Fetch Patient Physical Exam Reocrds
  fetchPatientPhysicalExamRecords() {
    this.fetchPatientPhysicalExamObj = {
      hospital_reg_num: this.selectedPatient.hospital_reg_num,
      patientID: this.selectedPatient.patientID,
      medical_record_id: this.selectedPatient.medical_record_id,
      byWhomID: this.signObj.hospitalAdmin.userID,
      byWhom: "admin",
    };
    console.log(
      "the req for fetch pat phy exam records obj : ",
      this.fetchPatientPhysicalExamObj
    );

    this.loginService
      .getPatientPhysicalExamRecordsData(
        this.fetchPatientPhysicalExamObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          console.log("res from fetch patient physical exam records  : ", res);
          if (res.response === 3) {
            this.loading = false;
            this.patientPhysicalExamRecords = res.physical_exam_records;
            console.log(
              "Res from Patient Phy Exam Records Data : ",
              res.physical_exam_records
            );
          } else if (res.response === 0) {
            this.loading = false;
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.loading = false;
            console.log("Client Side Error");
          } else {
            this.loading = false;
            console.log(err);
          }
        }
      );
  }

  //Fetch Patient Screening Records
  fetchPatientScreeningRecords() {
    this.fetchPatientScreeningRecordsObj = {
      hospital_reg_num: this.selectedPatient.hospital_reg_num,
      patientID: this.selectedPatient.patientID,
      medical_record_id: this.selectedPatient.medical_record_id,
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
      illnessID: this.selectedPatient.illnessID,
    };
    console.log(
      "Obj Data to fetch patient Screening Records : ",
      this.fetchPatientScreeningRecordsObj
    );
    this.loginService
      .getPatientScreeningRecordsData(
        this.fetchPatientScreeningRecordsObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          console.log("res from fetch patient screening records  : ", res);
          if (res.response === 3) {
            this.loading = false;
            this.patientScreeningRecords = res.illnessScreeningRecords;
            console.log(
              "Res from Patient Screening Records Data : ",
              res.illnessScreeningRecords
            );
          } else if (res.response === 0) {
            this.loading = false;
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.loading = false;
            console.log("Client Side Error");
          } else {
            this.loading = false;
            console.log(err);
          }
        }
      );
  }

  deletePatientScreeningFile(patientScreeningRecordsData) {
    this.isLoading = true;
    this.deletePatientPhyExamRecordObj = {
      medical_record_id: patientScreeningRecordsData.medical_record_id,
      illnessScreeningID: patientScreeningRecordsData.illnessScreeningID,
      patientID: patientScreeningRecordsData.patientID,
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
      hospital_reg_num: this.signObj.hospitalAdmin.hospital_reg_num,
    };
    console.log(
      "the req for delete pat screening exam record obj : ",
      this.deletePatientPhyExamRecordObj
    );
    this.loginService
      .deletePatientScreeningRecordsData(
        this.deletePatientPhyExamRecordObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          console.log("res from delete patient phy exam record : ", res);
          if (res.response === 3) {
            this.isLoading = false;
            this.loading = false;
            this.modalService.dismissAll();
            this.openSnackBar(res.message, "");
            this.fetchPatientScreeningRecords();
            //this.fetchPatientPhysicalExamRecords();
            console.log(
              "Res from Patient screening Exam Data Delete : ",
              res.message
            );
          } else if (res.response === 0) {
            this.isLoading = false;
            this.loading = false;
            this.modalService.dismissAll();
            this.openSnackBar(res.message, "");
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            this.loading = false;
            console.log("Client Side Error");
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log("Server Side", err);
          }
        }
      );
  }

  //Image Upload
  fileProgress(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    this.fileName = file.name;
    this.fileSize = file.size;
    this.fileSize = this.fileSize / 1024;
    this.fileValue = "kb";
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.addPatientScreeningRecordForm.get("profilePic").setValue(file);
        this.previewImg = reader.result;
      };
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }
  removeUploadedFile() {
    //alert("remove uploaded file");
    let newFileList = Array.from(this.el.nativeElement.files);
    this.addPatientScreeningRecordForm.get("profilePic").setValue(null);
  }

  addPatientScreeningRecordSubmit() {
    this.isLoading = true;

    let payLoad = this.addPatientScreeningRecordForm.value;
    let formData = new FormData();
    console.log("payload from pat phy exam record : ", payLoad);

    formData.append("patientID", this.selectedPatient.patientID);
    formData.append(
      "screeningRecord",
      this.addPatientScreeningRecordForm.get("profilePic").value
    );
    formData.append("recordMoreDetails", "");
    formData.append("recordName", this.fileName);
    formData.append(
      "hospital_reg_num",
      this.signObj.hospitalAdmin.hospital_reg_num
    );
    formData.append("byWhom", "admin");
    formData.append("byWhomID", this.signObj.hospitalAdmin.userID);
    formData.append(
      "medical_record_id",
      this.selectedPatient.medical_record_id
    );

    console.log("req data to add pat screening reocrd : ", formData);

    this.loginService
      .addPatientScreeningRecordsData(formData, this.signObj.access_token)
      .subscribe(
        (updateAdminGenUserData) => {
          console.log(
            "res from add patient screening record data : ",
            updateAdminGenUserData
          );
          if (updateAdminGenUserData.response === 3) {
            this.isLoading = false;

            this.loading = false;
            this.modalService.dismissAll();
            this.openSnackBar(updateAdminGenUserData.message, "");
            this.ngOnInit();
          } else {
            this.isLoading = false;
            this.loading = false;
            this.modalService.dismissAll();
            this.openSnackBar(updateAdminGenUserData.message, "");
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            this.loading = false;
            console.log("Client Side Error", err);
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log("Server Side", err);
          }
        }
      );
  }

  deletePatientAllPhysicalExamFile() {
    this.deleteAllPatientPhyExamRecordObj = {
      medical_record_id: this.selectedPatient.medical_record_id,
      hospital_reg_num: this.selectedPatient.hospital_reg_num,
      patientID: this.selectedPatient.patientID,
      medical_personnel_id: this.selectedPatient.medical_personnel_id,
    };
    console.log(
      "the req for delete all pat phy exam record obj : ",
      this.deleteAllPatientPhyExamRecordObj
    );
    this.loginService
      .deleteAllPatientPhysicalExamRecordsData(
        this.deleteAllPatientPhyExamRecordObj,
        this.signObj.access_token
      )
      .subscribe(
        (res) => {
          console.log("res from delete all patient phy exam record : ", res);
          if (res.response === 3) {
            this.loading = false;
            this.modalService.dismissAll();
            this.openSnackBar(res.message, "");
            this.patientPhysicalExamRecords = [];
            this.ngOnInit();
            console.log(
              "Res from Patient Phy Exam Data Delete All : ",
              res.message
            );
          } else if (res.response === 0) {
            this.loading = false;
            this.modalService.dismissAll();
            this.openSnackBar(res.message, "");
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.loading = false;
            console.log("Client Side Error");
          } else {
            this.loading = false;
            console.log(err);
          }
        }
      );
  }

  hideBottom() {
    this.theImg = this.patProComponent.patientProfileForm.get(
      "profilePic"
    ).value;

    console.log("img from patient profile component :", this.theImg);
    if (this.isViewBottom === false) {
      this.isViewBottom = true;
      this.patientProfileForm.enable();
      //this.nativeEl.nativeElement.focus()
    } else {
      this.isViewBottom = false;
      this.patientProfileForm.disable();
    }
  }

  updatePatientProfileData() {
    this.isLoading = true;
    let payLoad = this.patientProfileForm.value;
    let formData = new FormData();
    console.log("payload from pat gen info : ", payLoad);

    let timeToSend: any = new Date(payLoad.dob).getTime();

    console.log("the converting time : " + timeToSend);

    formData.append("firstName", payLoad.firstName);
    formData.append("lastName", payLoad.lastName);
    formData.append("gender", payLoad.gender);
    formData.append("age", payLoad.age);
    formData.append("phoneNumber", payLoad.phoneNumber);
    formData.append("address", payLoad.address);
    formData.append("city", payLoad.city);
    formData.append("dob", timeToSend);
    formData.append("state", payLoad.state);
    formData.append("country", payLoad.country);
    formData.append("postalCode", payLoad.pincode);
    formData.append(
      "medical_personnel_id",
      this.selectedPatient.medical_personnel_id
    );
    formData.append("hospital_reg_num", this.selectedPatient.hospital_reg_num);
    formData.append("latitude", this.selectedPatient.loc[0]);
    formData.append("longitude", this.selectedPatient.loc[1]);
    formData.append(
      "profilePic",
      this.patProComponent.patientProfileForm.get("profilePic").value
    );
    formData.append("emailID", payLoad.emailID);
    formData.append("patientID", this.selectedPatient.patientID);
    formData.append(
      "phoneNumberCountryCode",
      this.selectedPatient.phoneNumber.countryCode
    );

    console.log(
      "req data to update patient profile with img from pat-profilee-component : ",
      formData
    );

    this.loginService
      .updatePatient(formData, this.signObj.access_token)
      .subscribe(
        (updateAdminGenUserData) => {
          console.log(
            "res from add patient screening record data : ",
            updateAdminGenUserData
          );
          if (updateAdminGenUserData.response === 3) {
            this.patProComponent.patientProfileForm.get("profilePic").value ===
              null;
            this.isLoading = false;
            this.loading = false;
            //this.modalService.dismissAll();
            this.openSnackBar(updateAdminGenUserData.message, "");
            this.ngOnInit();
          } else {
            this.patProComponent.patientProfileForm.get("profilePic").value ===
              null;
            this.isLoading = false;
            this.loading = false;
            //this.modalService.dismissAll();
            this.openSnackBar(updateAdminGenUserData.message, "");
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.patProComponent.patientProfileForm.get("profilePic").value ===
              null;
            this.isLoading = false;
            this.loading = false;
            console.log("Client Side Error", err);
          } else {
            this.patProComponent.patientProfileForm.get("profilePic").value ===
              null;
            this.isLoading = false;
            this.loading = false;
            console.log("Server Side", err);
            this.openSnackBar(err.statusText, "");
          }
        }
      );
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

  viewFamilyHistory(viewFamilyHistoryContent) {
    this.modalService
      .open(viewFamilyHistoryContent, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  editFamilyHistory(addFamilyHistoryContent) {
    this.modalService
      .open(addFamilyHistoryContent, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  viewAllergies(viewAllergiesContent) {
    this.modalService
      .open(viewAllergiesContent, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  addAllergies(addAllergiesContent) {
    this.modalService
      .open(addAllergiesContent, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  addFiles(addFilesContent) {
    this.modalService
      .open(addFilesContent, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          this.fileName = "";
          this.fileSize = "";
          this.fileValue = "";
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.fileName = "";
          this.fileSize = "";
          this.fileValue = "";
        }
      );
  }

  deleteFile(deleteFileContent) {
    this.modalService
      .open(deleteFileContent, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
}
