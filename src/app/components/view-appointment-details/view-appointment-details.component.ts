import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-view-appointment-details',
  templateUrl: './view-appointment-details.component.html',
  styleUrls: ['./view-appointment-details.component.css']
})
export class ViewAppointmentDetailsComponent implements OnInit {
  sub: any;
  id: string;
  signObj: any;
  queryObj: any = {};
  closeResult: string;
  successResponse: string;
  failureResponse: string;
  isLoading: boolean = false;
  userID: string;
  loading: boolean;
  viewSuccessContent1: string = "Cancel Successful!";
  viewFailureContent1: string = "Cancel Failed!";
  viewSuccessContent2: string = "Accept Successful!";
  viewFailureContent2: string = "Accept Failed!";
  viewSuccessContent3: string = "Reschedule Successful!";
  viewFailureContent3: string = "Reschedule Failed!";
  reasonForCancel = [
    { value: 'Patient no-show', viewValue: 'Patient no-show' },
    { value: 'Cancelled by doctor', viewValue: 'Cancelled by doctor' },
    { value: 'Cancelled by patient', viewValue: 'Cancelled by patient' },
    { value: 'Others', viewValue: 'Others' }
  ];
  cancelPatientAppointmentForm: FormGroup;
  patientProfileForm: FormGroup;
  baseURL: string = "http://34.231.177.197:3000";
  serverURL: any = 'http://34.231.177.197:3000';
  //patient: any;
  patient: any = {
    "appointmentDetails": {
      "appointmentDate": "dd/mm/yyyy",
      "appointmentDuration": "xx mins",
      "appointmentID": "APNTIDxxxxxxxx",
      "appointmentStatus": "Xxxxxxxxxxx",
      "appointmentTime": "XX",
    },
    "reasonForVisit": "xxxxxxxx",
    "visitType": "xxxxxxxx",
    "creatorDetails": { "byWhom": "xxxxxxxx", "byWhomID": "xxxxxxxx" },
    "doctorMedicalPersonnelID": "xxxxxxxx",
    "hospital_reg_num": "xxxxxxxx",
    "patientDetails": {
      "patientID": "xxxxxxxx", "medical_record_id": "xxxxxxxx", "firstName": "xxxxxxxx", "lastName": "xxxxxxxx", "gender": "xxxxxxxx",
      "phoneNumber": { "countryCode": "+xx", "phoneNumber": "xxxxxxxxxx" }
    },
    "patientID": "xxxxxxxx",
    "doctorDetails": {
      "profile": {
        "userProfile": {
          "age": 0,
          "department": "xxxxxxxx",
          "emailID": "xxxxxxxx",
          "emergencyPhoneNumber": { "countryCode": "+xx", "phoneNumber": "xxxxxxxx" },
          "firstName": "xxxxxxxx",
          "gender": "xxxxxxxx",
          "hospitalApprove": false,
          "hospital_reg_num": "xxxxxxxx",
          "lastName": "xxxxxxxx",
          "medical_personnel_id": "xxxxxxxx",
          "phoneNumber": { "countryCode": "+xx", "phoneNumber": "xxxxxxxxxx" },
          "preferLanguage": "xxxxxxxx",
          "profilePic": "/images/MedicalPersonnels/bcLio1602840536184dora.jpg",
          "registerTime": "xxxxxxxx",
          "userID": "xxxxxxxx",
          "userType": "xxxxxxxx"
        }
      }
    }
  }
  @ViewChild('viewSuccessContent', { static: true }) modalSuccessExample: ElementRef<any>;
  @ViewChild('viewFailureContent', { static: true }) modalFailureExample: ElementRef<any>;
  @ViewChild('viewAcceptSuccessContent', { static: true }) modalAcceptSuccessExample: ElementRef<any>;
  @ViewChild('viewAcceptFailureContent', { static: true }) modalAcceptFailureExample: ElementRef<any>;
  @ViewChild('viewRescheduleSuccessContent', { static: true }) modalRescheduleSuccessExample: ElementRef<any>;
  @ViewChild('viewRescheduleFailureContent', { static: true }) modalRescheduleFailureExample: ElementRef<any>;
  constructor(private activatedRoute: ActivatedRoute, private modalService: NgbModal,
    private loginService: LoginService, private fb: FormBuilder, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.sub = this.activatedRoute.queryParamMap.subscribe(params => {
      this.queryObj = { ...params.keys, ...params }
    })
    var signInRes = localStorage.getItem("SignInRes");
    if (signInRes) {
      this.signObj = JSON.parse(signInRes);
    }
    //this.id = this.queryObj.params && this.queryObj.params.userID ? this.queryObj.params.userID : "";
    this.id = this.queryObj.params
    console.log("value of query params : ", this.id);
    this.fetchAppointmentData();
    if (this.queryObj.params.userType === "creator") {
      console.log("req from creator ...");
      if ((this.queryObj.params.isCancel === "true") &&
        (this.queryObj.params.isAccept === "false") &&
        (this.queryObj.params.isReschedule === "false")) {
        console.log("isCancel value is TRUE...");
        this.modalService.open(this.modalSuccessExample)
      }
      else if ((this.queryObj.params.isCancel === "false") &&
        (this.queryObj.params.isAccept === "true") &&
        (this.queryObj.params.isReschedule === "false")) {
        console.log("isAccept value is TRUE...");
        // setTimeout(() => {
        //   this.updateAppointmentAccessStatus();
        //   this.loading = false
        //   console.log("set time out for 5 seconds...");
        // }, 5000)
        this.modalService.open(this.modalAcceptSuccessExample)
      }
      else if ((this.queryObj.params.isCancel === "false") &&
        (this.queryObj.params.isAccept === "false") &&
        (this.queryObj.params.isReschedule === "true")) {
        console.log("isReschedule value is TRUE...");
        this.modalService.open(this.modalRescheduleSuccessExample)
      }
      else {
        console.log("isReschedule value is FALSE...");
        this.modalService.open(this.modalRescheduleFailureExample)
      }
    }
    else if (this.queryObj.params.userType === "doctor") {
      console.log("req from doctor ...");
      if ((this.queryObj.params.isCancel === "true") &&
        (this.queryObj.params.isAccept === "false") &&
        (this.queryObj.params.isReschedule === "false")) {
        console.log("isCancel value is TRUE...");
        this.modalService.open(this.modalSuccessExample)
      }
      else if ((this.queryObj.params.isCancel === "false") &&
        (this.queryObj.params.isAccept === "true") &&
        (this.queryObj.params.isReschedule === "false")) {
        console.log("isAccept value is TRUE...");
        // setTimeout(() => {
        //   this.updateAppointmentAccessStatus();
        //   this.loading = false
        //   console.log("set time out for 5 seconds...");
        // }, 5000)
        this.modalService.open(this.modalAcceptSuccessExample)
      }
      else if ((this.queryObj.params.isCancel === "false") &&
        (this.queryObj.params.isAccept === "false") &&
        (this.queryObj.params.isReschedule === "true")) {
        console.log("isReschedule value is TRUE...");
        this.modalService.open(this.modalRescheduleSuccessExample)
      }
      else {
        console.log("isReschedule value is FALSE...");
        this.modalService.open(this.modalRescheduleFailureExample)
      }
    }
    else if (this.queryObj.params.userType === "Patient") {
      console.log("req from patient ...");
      if ((this.queryObj.params.isCancel === "true") &&
        (this.queryObj.params.isAccept === "false") &&
        (this.queryObj.params.isReschedule === "false")) {
        console.log("isCancel value is TRUE...");
        this.modalService.open(this.modalSuccessExample)
      }
      else if ((this.queryObj.params.isCancel === "false") &&
        (this.queryObj.params.isAccept === "true") &&
        (this.queryObj.params.isReschedule === "false")) {
        console.log("isAccept value is TRUE...");
        // setTimeout(() => {
        //   this.updateAppointmentAccessStatus();
        //   this.loading = false
        //   console.log("set time out for 5 seconds...");
        // }, 5000)
        //this.modalService.open(this.modalAcceptSuccessExample)
      }
      else if ((this.queryObj.params.isCancel === "false") &&
        (this.queryObj.params.isAccept === "false") &&
        (this.queryObj.params.isReschedule === "true")) {
        console.log("isReschedule value is TRUE...");
        this.modalService.open(this.modalRescheduleSuccessExample)
      }
      else {
        console.log("isReschedule value is FALSE...");
        this.modalService.open(this.modalRescheduleFailureExample)
      }
    }

    this.cancelPatientAppointmentForm = this.fb.group({
      cancelReason: [""]
    });
    this.patientProfileForm = this.fb.group({
      time: [""],
      date: [""]
    })

  }

  //Cancel Appointment
  cancelAppointment() {
    //this.isLoading = true;
    let reqDataForCancelAppointment = {
      "hospital_reg_num": this.patient.hospital_reg_num,
      "appointmentID": this.queryObj.params.appointmentID,
      "byWhom": this.patient.creatorDetails.byWhom,
      "byWhomID": this.patient.creatorDetails.byWhomID,
      "reason": this.cancelPatientAppointmentForm.value.cancelReason
    }
    console.log("Req for cancel appointment : ", reqDataForCancelAppointment);
    //Service for Cancel Appointment
    this.loginService.cancelAppointment(reqDataForCancelAppointment, this.signObj.access_token).subscribe(
      (resForCancelAppointment) => {
        if (resForCancelAppointment.response === 3) {
          //this.isLoading = false;
          this.modalService.dismissAll();
          this.openSnackBar(resForCancelAppointment.message, "");
        }
        else {
          //this.isLoading = false;
          this.modalService.dismissAll();
          console.log(resForCancelAppointment.message);
          this.openSnackBar1(resForCancelAppointment.message, "");
          //alert(resForCancelAppointment.message);
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          //this.isLoading = false;
          console.log("Client Side Error", err);
        } else {
          //this.isLoading = false;
          console.log("Server Side", err)
        }
      })
  }


  //fetchAppointmentData
  fetchAppointmentData() {
    this.isLoading = true;
    let reqDataForFetchAppointmentData = {
      "appointmentID": this.queryObj.params.appointmentID,
    }
    console.log("Req for fetch appointment data : ", reqDataForFetchAppointmentData);
    //Service for Cancel Appointment
    this.loginService.fetchAppointmentData(reqDataForFetchAppointmentData).subscribe(
      (resForFetchAppointmentData) => {
        if (resForFetchAppointmentData.response === 3) {
          console.log("fetched appointment dATA : ", resForFetchAppointmentData);
          this.patient = resForFetchAppointmentData.appointment;
          this.isLoading = false;
          this.loading = false;
          this.openSnackBar(resForFetchAppointmentData.message, "");
          setTimeout(() => {
            if ((this.queryObj.params.isCancel === "false") &&
              (this.queryObj.params.isAccept === "true") &&
              (this.queryObj.params.isReschedule === "false")) {
              this.updateAppointmentAccessStatus();
            }
            // else if ((this.queryObj.params.isCancel === "true") &&
            //   (this.queryObj.params.isAccept === "false") &&
            //   (this.queryObj.params.isReschedule === "false")) {
            //   this.cancelAppointment();
            // }
            this.loading = false
            console.log("set time out for 5 seconds...");
          }, 5000)
        }
        else {
          this.isLoading = false;
          this.loading = false;
          console.log(resForFetchAppointmentData.message);
          //alert(resForCancelAppointment.message);
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
          console.log("Server Side", err)
        }
      })
  }

  //Update Appointment Access Status
  updateAppointmentAccessStatus() {


    //this.isLoading = true;
    let reqDataForAppointment = {
      "hospital_reg_num": this.patient.hospital_reg_num,
      "appointmentID": this.queryObj.params.appointmentID,
      "doctorMedicalPersonnelID": this.patient.doctorMedicalPersonnelID,
      "isAccepted": 1
    }
    console.log("Req for update acept appointment status : ", reqDataForAppointment);
    //Service for Cancel Appointment
    this.loginService.updateAppointmentAcceptStatus(reqDataForAppointment, this.signObj.access_token).subscribe(
      (resForCancelAppointment) => {
        if (resForCancelAppointment.response === 3) {
          //this.isLoading = false;
          this.viewSuccessContent2 = resForCancelAppointment.message;
          this.modalService.open(this.modalAcceptSuccessExample)
          //this.modalService.dismissAll();
          this.openSnackBar(resForCancelAppointment.message, "");
        }
        else {
          //this.isLoading = false;
          this.viewFailureContent2 = resForCancelAppointment.message;
          this.modalService.open(this.modalAcceptFailureExample)
          //this.modalService.dismissAll();
          console.log(resForCancelAppointment.message);
          this.openSnackBar1(resForCancelAppointment.message, "");
          //alert(resForCancelAppointment.message);
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          //this.isLoading = false;
          console.log("Client Side Error", err);
        } else {
          //this.isLoading = false;
          console.log("Server Side", err)
        }
      })
  }

  viewSuccessMethod(viewSuccessContent) {
    this.modalService.open(viewSuccessContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "sm", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  viewFailureMethod(viewFailureContent) {
    this.modalService.open(viewFailureContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "sm", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  viewAcceptSuccessMethod(viewAcceptSuccessContent) {
    this.modalService.open(viewAcceptSuccessContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "sm", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  viewAcceptFailureMethod(viewAcceptFailureContent) {
    this.modalService.open(viewAcceptFailureContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "sm", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  viewRescheduleSuccessMethod(viewRescheduleSuccessContent) {
    this.modalService.open(viewRescheduleSuccessContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "sm", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  viewRescheduleFailureMethod(viewRescheduleFailureContent) {
    this.modalService.open(viewRescheduleFailureContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "sm", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }

}


