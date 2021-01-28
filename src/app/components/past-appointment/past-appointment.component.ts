import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { ModalDismissReasons, NgbModal, NgbDatepickerConfig } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'src/app/services/login.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';

@Component({
  selector: 'app-past-appointment',
  templateUrl: './past-appointment.component.html',
  styleUrls: ['./past-appointment.component.css']
})
export class PastAppointmentComponent implements OnInit {

  patientAppointmentForm: FormGroup;
  cancelPatientAppointmentForm: FormGroup;
  patientAppointmentRejectForm: FormGroup;
  signInRes: any;
  signObj: any;
  userID: string;
  loading: boolean;
  closeResult: string;
  appointmentsData: any;
  singleAppointment: any;
  appointmentTime: any;
  appointmentTimeFrom: any;
  appointmentTimeTo: any;
  isRejectedAppointment: boolean = false;
  dateToShow: any;
  previousAppointments: any = [];
  upcomingAppointments: any = [];
  term: any = ""
  titleArray: any =
    {
      title: "Appointment",
      subTitle: "Past Appointments",
      img: "assets/images/ui/Icons/1x/admin center.png"
    };

  constructor(private loginService: LoginService, private modalService: NgbModal, private fb: FormBuilder, private config: NgbDatepickerConfig,
    private _snackBar: MatSnackBar) {
    const current = new Date()
    config.minDate = { year: current.getFullYear(), month: current.getMonth() + 1, day: current.getDate() }
    //config.maxDate = {year:current.getFullYear(),month:current.getMonth() + 2, day:current.getDate()}
  }

  ngOnInit() {
    this.signInRes = localStorage.getItem("SignInRes");
    this.loading = true;
    if (this.signInRes) {
      this.signObj = JSON.parse(this.signInRes);
      this.userID = localStorage.getItem('userID');
      //this.fetchMedicalPersonsData();
      //this.fetchAdminGenralData();  
    }

    this.fetchHospitalAppointmentData();

    this.patientAppointmentForm = this.fb.group({
      visitType: [""],
      appointmentDate: [""],
      appointmentTime: [""],
      doctorName: [""],
      patientName: [""],
      department: [""],
      reasonForVisit: [""],
      appointmentStatus: [""],
      creatorName: [""]
    });

    this.patientAppointmentRejectForm = this.fb.group({
      visitType: [""],
      appointmentDate: [""],
      appointmentTimeFrom: [""],
      appointmentTimeTo: [""],
      doctorName: [""],
      patientName: [""],
      department: [""],
      reasonForVisit: [""],
      appointmentStatus: [""],
      creatorName: [""],
      doctorMedicalPersonnelID: [""]
    });

    this.cancelPatientAppointmentForm = this.fb.group({
      cancelReason: [""]
    });

  }

  //fetch Admin/Hospital Appointments data
  fetchHospitalAppointmentData() {
    let reqForFetch = {
      "hospital_reg_num": this.signObj.hospitalInformation.hospital_reg_num,
      "adminUserID": this.userID
    }

    //Fetch Admin/Hospital Data using Service
    this.loginService.getAdminAppointmentData(reqForFetch, this.signObj.access_token).subscribe(
      (res) => {
        if (res.response === 3) {
          this.loading = false;
          this.appointmentsData = res.appointments;
          let currentDate = new Date().toLocaleDateString()
          console.log("current", currentDate);

          this.previousAppointments = this.appointmentsData.filter(date => {
            return new Date(date.appointmentDate).toLocaleDateString() < currentDate
          })
          this.upcomingAppointments = this.appointmentsData.filter(date => {
            return new Date(date.appointmentDate).toLocaleDateString() < currentDate
          })
          console.log("Upcoming", this.upcomingAppointments);

          console.log("previous", this.previousAppointments);

          console.log("today", currentDate);

          console.log("List Of Appointments : ", this.appointmentsData);

          //alert(res.appointmentsData);
        }
        else {
          this.loading = false;
          alert(res.message);
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.loading = false;
          console.log("Client Side Error", err);

        } else {
          this.loading = false;
          console.log("Server Side", err)
        }
      }
    )
  }

  //Open Update Appointment Model
  openUpdateModel(content2, selectedAppointment) {
    this.dateToShow = selectedAppointment.appointmentDate
    let date = new Date(selectedAppointment.appointmentDate).toLocaleDateString().split("/", 3)
    let editedDate = {
      "year": parseInt(date[2]),
      "month": parseInt(date[1]),
      "day": parseInt(date[0])
    }
    this.patientAppointmentRejectForm.get('appointmentDate').setValue({
      "year": parseInt(date[2]),
      "month": parseInt(date[1]),
      "day": parseInt(date[0])
    })
    console.log("edited Date", editedDate);

    if (selectedAppointment.appointmentStatus == "Cancelled" || selectedAppointment.appointmentStatus == "Rejected") {
      this.isRejectedAppointment = true;
    } else {
      console.log("non of cancel/reject");
      this.isRejectedAppointment = false;
    }
    console.log(selectedAppointment);
    this.singleAppointment = selectedAppointment;
    this.patientAppointmentForm.patchValue({
      visitType: selectedAppointment.visitType,
      appointmentDate: selectedAppointment.appointmentDate,
      appointmentTime: selectedAppointment.appointmentTimeFrom + "~" + selectedAppointment.appointmentTimeTo,
      doctorName: selectedAppointment.doctorName,
      patientName: selectedAppointment.patientName,
      department: selectedAppointment.department,
      reasonForVisit: selectedAppointment.reasonForVisit,
      appointmentStatus: selectedAppointment.appointmentStatus,
      creatorName: selectedAppointment.creatorName
    });
    this.patientAppointmentRejectForm.patchValue({
      visitType: selectedAppointment.visitType,
      appointmentDate: selectedAppointment.appointmentDate,
      appointmentTimeFrom: selectedAppointment.appointmentTimeFrom,
      appointmentTimeTo: selectedAppointment.appointmentTimeTo,
      creatorName: selectedAppointment.creatorName,
      createrMedicalPersonnelID: selectedAppointment.createrMedicalPersonnelID,
      doctorName: selectedAppointment.doctorName,
      doctorMedicalPersonnelID: selectedAppointment.doctorMedicalPersonnelID,
      reasonForVisit: selectedAppointment.reasonForVisit
    });
    console.log("patientForm", this.patientAppointmentRejectForm.value);

    this.modalService.open(content2, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "lg", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  //Open Update Admin Model
  openCancelModel(content3) {
    this.modalService.open(content3, { ariaLabelledBy: 'modal-basic-title', centered: true, backdrop: false }).result.then((result) => {
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

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
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

  //Cancel Appointment
  cancelAppointment() {
    let reqDataForCancelAppointment = {
      "hospital_reg_num": this.signObj.hospitalInformation.hospital_reg_num,
      "appointmentID": this.singleAppointment.appointmentID,
      "cancelledByWhom": "Admin",
      "cancelledPersonID": this.userID,
      "cancelReason": this.cancelPatientAppointmentForm.value.cancelReason
    }
    console.log("Req for cancel appointment : ", reqDataForCancelAppointment);
    //Service for Cancel Appointment
    this.loginService.cancelAppointment(reqDataForCancelAppointment, this.signObj.access_token).subscribe(
      (resForCancelAppointment) => {
        if (resForCancelAppointment.response === 3) {
          this.modalService.dismissAll();
          this.ngOnInit();
          this.openSnackBar(resForCancelAppointment.message, "");
        }
        else {
          console.log(resForCancelAppointment.message);
          alert(resForCancelAppointment.message);
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.loading = false;
          console.log("Client Side Error", err);

        } else {
          this.loading = false;
          console.log("Server Side", err)
        }
      })
  }

  //Reschedule Appointment
  rescheduleAppointment(content) {
    //this.patientAppointmentRejectForm.value.appointmentTime.disabled();
    let ngbDate = this.patientAppointmentRejectForm.controls['appointmentDate'].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    this.patientAppointmentRejectForm.patchValue({ appointmentDate: myDate.toLocaleDateString() })
    console.log("sended date format : ", myDate.toLocaleDateString().split("/").reverse().join("/"));
    var dateAr = myDate.toLocaleDateString().split('/');
    var newDate = dateAr[2] + '/' + dateAr[0] + '/' + dateAr[1];
    console.log("new date yyyy/mm/dd", newDate);

    let reqForRescheduleAppointment = {
      "hospital_reg_num": this.signObj.hospitalInformation.hospital_reg_num,
      "appointmentDate": newDate,
      "appointmentTimeFrom": this.patientAppointmentRejectForm.value.appointmentTimeFrom,
      "appointmentTimeTo": this.patientAppointmentRejectForm.value.appointmentTimeTo,
      "appointmentID": this.singleAppointment.appointmentID,
      "visitType": this.patientAppointmentRejectForm.value.visitType,
      "creatorName": this.singleAppointment.creatorName,
      "createrMedicalPersonnelID": this.singleAppointment.createrMedicalPersonnelID
    }
    console.log("Req for Reject Appointment : ", reqForRescheduleAppointment);

    //Service For Reschedule Appointment
    this.loginService.rescheduleAppointment(reqForRescheduleAppointment, this.signObj.access_token).subscribe(
      (resForRescheduleAppointment) => {
        if (resForRescheduleAppointment.response === 3) {
          this.modalService.dismissAll();
          this.ngOnInit();
          this.openSnackBar(resForRescheduleAppointment.message, "");
        }
        else {
          console.log(resForRescheduleAppointment.message);
          alert(resForRescheduleAppointment.message);
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.loading = false;
          console.log("Client Side Error", err);

        } else {
          this.loading = false;
          console.log("Server Side", err)
        }
      }
    )
  }
}
