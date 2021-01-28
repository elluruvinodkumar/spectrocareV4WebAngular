import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal, ModalDismissReasons, NgbDate } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { time } from 'console';

interface SearchByValue {
  viewValue: string;
}

@Component({
  selector: 'app-appointment-list',
  templateUrl: './appointment-list.component.html',
  styleUrls: ['./appointment-list.component.css']
})
export class AppointmentListComponent implements OnInit {
  baseURL: string = "http://34.231.177.197:3000";
  isViewBottom: boolean = false;
  bookAppointmentForm: FormGroup;
  cancelPatientAppointmentForm: FormGroup;
  term: any;
  selected = 'All';
  titleArray: any =
    {
      title: "Appointment",
      subTitle: "",
      img: "assets/images/ui/Icons/1x/calendar1.png"
    };

  closeResult: string;
  signInRes: any;
  signObj: any;
  userID: string;
  previewImg: any;
  loading: boolean;
  isValue: any;
  listOfAppointments: any = [];
  filteredListOfAppointments: any = [];
  allAppointments: any = [];
  currentDate: any;
  pastAppointments: any = [];
  upcomingAppointments: any = [];
  todayAppointments: any = [];
  patientsList: any = [];
  filteredPatients: any = [];
  medicalPersonnels: any = [];
  filteredMedicalPersonnels: any = [];
  listSize: any = 0;
  searchByValue: SearchByValue[] = [
    { viewValue: 'All' },
    { viewValue: 'Waiting for confirmation' },
    { viewValue: 'Cancelled' },
    { viewValue: 'Accepted' },
    { viewValue: 'Online' },
    { viewValue: 'Onsite' }
  ];

  isLoading: boolean = false;
  reasonForCancel = [
    { value: 'Patient no-show', viewValue: 'Patient no-show' },
    { value: 'Cancelled by doctor', viewValue: 'Cancelled by doctor' },
    { value: 'Cancelled by patient', viewValue: 'Cancelled by patient' },
    { value: 'Others', viewValue: 'Others' }
  ];

  invoicesData: any = [
    { "Invoice": "AB-1001", "Client": "abc babu", "Items": "Urine test", "Amount": "10", "Issuedate": "2020-03-13", "Status": "Draft" },
    { "Invoice": "AB-1002", "Client": "def rani", "Items": "Urine test", "Amount": "20", "Issuedate": "2020-03-14", "Status": "Paid" },
    { "Invoice": "AB-1003", "Client": "ghijil khan rao", "Items": "Urine test", "Amount": "50", "Issuedate": "2020-03-23", "Status": "Unpaid" },
    { "Invoice": "AB-1004", "Client": "jkl vasundhar", "Items": "Urine test", "Amount": "10", "Issuedate": "2020-04-13", "Status": "Overdue" },
    { "Invoice": "AB-1005", "Client": "mno flintoff", "Items": "Urine test", "Amount": "20", "Issuedate": "2020-02-23", "Status": "Paid" },
    { "Invoice": "AB-1006", "Client": "pqr prasuna", "Items": "Urine test", "Amount": "60", "Issuedate": "2020-04-31", "Status": "Draft" },
  ]

  color: string;
  color1: string;
  color2: string;
  color3: string;
  color4: string;
  color5: string;
  textColor: string;
  textColor1: string;
  textColor2: string;
  textColor3: string;
  textColor4: string;
  textColor5: string;
  border: string;
  border1: string;
  border2: string;
  border3: string;
  border4: string;
  border5: string;
  visitType: string;
  dp: any;
  dateToShow: any;
  constructor(private loginService: LoginService, private modalService: NgbModal, private fb: FormBuilder,
    private _snackBar: MatSnackBar) { }

  ngOnInit() {

    this.showData;
    console.log("Invoices Data : ", this.invoicesData);

    this.signInRes = localStorage.getItem("SignInRes");
    this.previewImg = "/assets/images/smile.jpg";
    if (this.signInRes) {
      this.signObj = JSON.parse(this.signInRes);
      this.userID = localStorage.getItem('userID');

      let getHospitalAppointmentsDataObj = {
        "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
        "adminUserID": this.signObj.hospitalAdmin.userID
      }
      this.loading = true;
      this.getHospitalAppointmentsData(getHospitalAppointmentsDataObj);

    }

    this.bookAppointmentForm = this.fb.group({
      hospital_reg_num: [""],
      appointmentID: [""],
      appointmentDate: [""],
      appointmentTime: [""],
      appointmentDuration: [""],
      visitType: [""],
      doctorName: [""],
      doctorMedicalPersonnelID: [""],
      patientName: [""],
      patientID: [""],
      department: [""],
      reasonForVisit: [""],
      medicalRecordID: [""],
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
      emailID: [""],
      phoneNumber: [""],
      //creatorName: [""],
      //createrMedicalPersonnelID: [""],
    });
    this.cancelPatientAppointmentForm = this.fb.group({
      cancelReason: [""]
    });

    //this.viewOnline();
    //this.autoAddAppointmentData(this.signObj);
    //this.book1();
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
    let medicalObj = {
      "userID": this.userID,
      "category": "All",
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
      "token": this.signObj.access_token
    }
    this.getDoctorData(medicalObj);
    this.getUpcomingAppointments();
  }
  openReschedule(patient) {
    this.isViewBottom = true;
    console.log("Selected Patient Details : " + patient.appointmentDetails, patient.doctorDetails, patient.hospital_reg_num, patient.patientDetails);
    let time2 = patient.appointmentDetails.appointmentDuration.split(" ");
    console.log("time2 : " + time2[0]);
    console.log("Appointment Date : ", patient.appointmentDetails.appointmentDate);
    this.dateToShow = patient.appointmentDetails.appointmentDate;
    this.dp = new Date(patient.appointmentDetails.appointmentDate);
    var date1 = new Date(patient.appointmentDetails.appointmentDate * 1000);
    this.dateToShow = (date1.getFullYear()) + '-' + ('0' + (date1.getMonth() + 1)).slice(-2) + '-' + date1.getDate();

    //let ngbDate = this.bookAppointmentForm.controls['appointmentDate'].value;
    let ngbDate = patient.appointmentDetails.appointmentDate;
    var dateAr = ngbDate.split('/');
    var newDate = dateAr[2] + '/' + dateAr[0] + '/' + dateAr[1];

    console.log("start date : ", this.dateToShow, (date1.getFullYear()), (date1.getMonth() + 1), date1.getDate());

    this.bookAppointmentForm.patchValue({
      hospital_reg_num: patient.hospital_reg_num,
      appointmentID: patient.appointmentDetails.appointmentID,
      appointmentDate: new NgbDate((date1.getFullYear()), (date1.getMonth() + 1), date1.getDate()),
      //patient.appointmentDetails.appointmentDate,
      //|| newDate
      appointmentTime: patient.appointmentDetails.appointmentTime || [""],
      appointmentDuration: patient.appointmentDetails.appointmentDuration,
      visitType: patient.appointmentDetails.visitType,
      doctorName: patient.doctorDetails.profile.userProfile.firstName,
      doctorMedicalPersonnelID: patient.doctorDetails.profile.userProfile.medical_personnel_id,
      patientName: patient.patientDetails.firstName || [""],
      patientID: patient.patientDetails.patientID || [""],
      department: patient.doctorDetails.profile.userProfile.department,
      reasonForVisit: patient.appointmentDetails.reasonForVisit,
      medicalRecordID: patient.patientDetails.medical_record_id || [""],
      byWhom: "admin",
      byWhomID: this.signObj.hospitalAdmin.userID,
      emailID: patient.patientDetails.emailID || [""],
      phoneNumber: patient.patientDetails.phoneNumber.phoneNumber || [""],
    })

    //patient.appointmentDetails.visitType;
    if (patient.appointmentDetails.visitType === "onsite") {
      this.viewOnsite();
    }
    else {
      this.viewOnline();
    }
    //patient.appointmentDetails.appointmentTime
    let time1 = patient.appointmentDetails.appointmentTime.split(" ");
    console.log("time : " + time1[0]);
    if (time1[0] === "9:00") {
      this.book1();
    }
    else if (time1[0] === "9:30") {
      this.book2();
    }
    else if (time1[0] === "10:30") {
      this.book3();
    }
    else {
      this.book4();
    }

    //patient.appointmentDetails.appointmentDuration
    this.selectPatientFromList(patient.patientDetails)
    //this.selectDoctorFromList(patient.doctorDetails);
  }

  rescheduleAppointment() {
    console.log(this.bookAppointmentForm.value);
    let ngbDate = this.bookAppointmentForm.controls['appointmentDate'].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day + 1);
    var dateAr = myDate.toLocaleDateString().split('/');
    var newDate = dateAr[0] + '/' + dateAr[1] + '/' + dateAr[2];
    console.log("date : ", new Date(newDate).getTime());

    let rescheduleAppointmentObj = {
      "hospital_reg_num": this.bookAppointmentForm.value.hospital_reg_num,
      "appointmentDate": "" + new Date(newDate).getTime(),
      "appointmentTime": this.bookAppointmentForm.value.appointmentTime,
      "appointmentDuration": this.bookAppointmentForm.value.appointmentDuration,
      "appointmentID": this.bookAppointmentForm.value.appointmentID,
      "visitType": this.bookAppointmentForm.value.visitType,
      "byWhom": this.bookAppointmentForm.value.doctorName,
      "byWhomID": this.bookAppointmentForm.value.doctorMedicalPersonnelID
    }

    console.log("The Sended Data to Reschedule Appointment : " + rescheduleAppointmentObj);

    this.loginService.rescheduleAppointment(rescheduleAppointmentObj, this.signObj.access_token).subscribe(
      (resForRescheduleAppointment) => {
        if (resForRescheduleAppointment.response === 3) {
          this.isLoading = false;
          this.loading = false;
          this.ngOnInit();
          this.openSnackBar(resForRescheduleAppointment.message, "");
          this.isViewBottom = false;
        }
        else {
          this.isLoading = false;
          this.loading = false;
          console.log(resForRescheduleAppointment.message);
          this.openSnackBar(resForRescheduleAppointment.message, "");
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

  closeReschedule() {
    this.isViewBottom = false;
  }

  clearForm() {
    this.bookAppointmentForm.reset();
  }

  showData(letSearch: string) {
    console.log("Print Value", letSearch);
    if (letSearch == "All") {
      this.term = ""
    } else {
      this.term = letSearch
    }
  }
  getPatientData(obj) {
    this.loginService.getPatientData(obj).subscribe(
      (res) => {
        console.log(res)
        if (res.response === 3) {

          this.patientsList = res.patients;
          this.filteredPatients = res.patients;
          console.log("list of patients : ", this.patientsList);

        } else {
          console.log(res.message);
        }
      }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {

          console.log("Client Side Error")
        } else {

          console.log(err)
        }
      })
  }

  getDoctorData(medicalObj) {
    this.loginService.getMedicalPatientData(medicalObj).subscribe(
      (res) => {
        console.log(res)
        if (res.response === 3) {
          this.medicalPersonnels = res.medicalPersonnels;
          this.filteredMedicalPersonnels = res.medicalPersonnels;
          console.log("list of doctors : ", this.medicalPersonnels);
        }
        else {
          console.log(res.message);
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client Side Error")
        } else {
          console.log(err)
        }
      })
  }

  selectPatientFromList(value: any) {
    console.log(value);
    let index = -1
    index = this.patientsList.findIndex(val => {
      return val.patientID === value.patientID
    })
    if (index != -1) {
      let obj = this.patientsList[index]
      console.log("obj", obj)
      this.bookAppointmentForm.patchValue({
        patientID: obj.patientID,
        patientName: obj.firstName + " " + obj.lastName,
        medicalRecordID: obj.medical_record_id,
        emailID: obj.emailID,
        phoneNumber: obj.phoneNumber.countryCode + " " + obj.phoneNumber.phoneNumber
      })
      this.modalService.dismissAll()
    }
  }

  search(term: string) {
    console.log("term", term)
    if (!term) {
      this.filteredPatients = this.patientsList;
    } else {
      this.filteredPatients = this.patientsList.filter(x =>
        x.firstName.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
    }
  }

  findText(term: string) {
    this.listOfAppointments;
    this.filteredListOfAppointments;
    if (!term) {
      this.listOfAppointments = this.filteredListOfAppointments;
    } else {
      this.listOfAppointments = this.filteredListOfAppointments.filter(x =>
        x.patientDetails.patientName.trim().toLowerCase().startsWith(term.trim().toLowerCase())
      );
    }
  }

  selectDoctorFromList(value: any) {
    console.log(value);
    let index = -1
    index = this.medicalPersonnels.findIndex(val => {
      return val.profile.userProfile.medical_personnel_id === value.profile.userProfile.medical_personnel_id
    })
    console.log("index value : ", index);
    if (index != -1) {
      let obj = this.medicalPersonnels[index]
      console.log("obj", obj)
      this.bookAppointmentForm.patchValue({
        doctorName: obj.profile.userProfile.firstName + " " + obj.profile.userProfile.lastName,
        doctorMedicalPersonnelID: obj.profile.userProfile.medical_personnel_id,
        department: obj.profile.userProfile.department
      })
      this.modalService.dismissAll()
    }
  }

  searchDoctor(term: string) {
    console.log("term", term)
    if (!term) {
      this.filteredMedicalPersonnels = this.medicalPersonnels;
    } else {
      this.filteredMedicalPersonnels = this.medicalPersonnels.filter(x =>
        x.firstName.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
    }
  }

  getHospitalAppointmentsData(obj) {
    this.loginService.getHospitalAppointmentsData(obj, this.signObj.access_token).subscribe(
      (res) => {
        console.log(res)
        if (res.response === 3) {
          this.loading = false;
          this.listOfAppointments = res.appointments;
          this.filteredListOfAppointments = res.appointments;
          this.allAppointments = res.appointments;
          let count: any[] = this.listOfAppointments;
          this.listSize = count.length;
          this.getUpcomingAppointments();
          console.log("Hospital/Admin having num of Appointments size is : ", this.listSize);
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

  getPastAppointments() {
    console.log("past appointments called");
    this.isValue = 3;
    var presentDate = Math.round(new Date().getTime() / 1000)
    console.log("present data : ", presentDate);

    var timestamp = presentDate;
    var date = new Date(timestamp * 1000);
    var formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
    //console.log(formattedDate);

    this.listOfAppointments = this.allAppointments.filter(date => {
      var timestamp1 = date.appointmentDetails.appointmentDate;
      var date1: any = new Date(timestamp1 * 1000);
      var formattedDate1 = ('0' + date1.getDate()).slice(-2) + '/' + ('0' + (date1.getMonth() + 1)).slice(-2) + '/' + date1.getFullYear();
      //console.log(formattedDate1);

      return formattedDate1 < formattedDate
      //return date.appointmentDetails.appointmentDate < presentDate
    })
  }

  getUpcomingAppointments() {
    this.isValue = 2;
    console.log("upcoming appointments called");
    var presentDate = Math.round(new Date().getTime() / 1000)
    console.log("present data : ", presentDate);

    var timestamp = presentDate;
    var date = new Date(timestamp * 1000);
    var formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
    //console.log(formattedDate);

    this.listOfAppointments = this.allAppointments.filter(date => {
      var timestamp1 = date.appointmentDetails.appointmentDate;
      var date1: any = new Date(timestamp1 * 1000);
      var formattedDate1 = ('0' + date1.getDate()).slice(-2) + '/' + ('0' + (date1.getMonth() + 1)).slice(-2) + '/' + date1.getFullYear();
      //console.log(formattedDate1);
      return formattedDate1 > formattedDate
      //return date.appointmentDetails.appointmentDate > presentDate
    })
  }

  getTodayAppointments() {
    this.isValue = 1;

    console.log("today appointments called : ", this.allAppointments);
    var presentDate = Math.round(new Date().getTime() / 1000)
    console.log("present data : ", presentDate);

    var timestamp = presentDate;
    var date = new Date(timestamp * 1000);
    var formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
    //console.log(formattedDate);

    this.listOfAppointments = this.allAppointments.filter(date => {

      var timestamp1 = date.appointmentDetails.appointmentDate;
      var date1: any = new Date(timestamp1 * 1000);
      var formattedDate1 = ('0' + date1.getDate()).slice(-2) + '/' + ('0' + (date1.getMonth() + 1)).slice(-2) + '/' + date1.getFullYear();
      //console.log(formattedDate1);
      return formattedDate1 === formattedDate
      //      return date.appointmentDetails.appointmentDate === presentDate
    })
  }
  viewOnline() {
    this.textColor = 'white';
    this.textColor1 = 'black';
    this.color = '#53B9C6';
    this.color1 = 'white';
    this.visitType = "online";
    this.border = "none"
    this.border1 = "1px solid #707070"
    this.bookAppointmentForm.value.visitType = "online"
  }

  viewOnsite() {
    this.textColor = 'black';
    this.textColor1 = 'white';
    this.color = 'white'
    this.color1 = '#53B9C6';
    this.visitType = "onsite";
    this.border1 = "none"
    this.border = "1px solid #707070"
    this.bookAppointmentForm.value.visitType = "onsite"
  }
  book1() {
    this.textColor2 = 'white';
    this.color2 = '#53B9C6';
    this.textColor3 = 'black';
    this.textColor4 = 'black';
    this.textColor5 = 'black';
    this.color3 = 'white'
    this.color4 = 'white'
    this.color5 = 'white'
    this.border2 = "none",
      this.border3 = "1px solid #707070",
      this.border4 = "1px solid #707070",
      this.border5 = "1px solid #707070",
      this.bookAppointmentForm.patchValue({
        appointmentTime: "9:00 AM"
      })
  }
  book2() {
    this.textColor3 = 'white';
    this.color3 = '#53B9C6';
    this.textColor2 = 'black';
    this.textColor4 = 'black';
    this.textColor5 = 'black';
    this.color2 = 'white'
    this.color4 = 'white'
    this.color5 = 'white'
    this.border3 = "none",
      this.border2 = "1px solid #707070",
      this.border4 = "1px solid #707070",
      this.border5 = "1px solid #707070",
      this.bookAppointmentForm.patchValue({
        appointmentTime: "9:30 AM"
      })
  }
  book3() {
    this.textColor4 = 'white';
    this.color4 = '#53B9C6';
    this.textColor2 = 'black';
    this.textColor3 = 'black';
    this.textColor5 = 'black';
    this.color3 = 'white'
    this.color2 = 'white'
    this.color5 = 'white'
    this.border4 = "none",
      this.border3 = "1px solid #707070",
      this.border2 = "1px solid #707070",
      this.border5 = "1px solid #707070",
      this.bookAppointmentForm.patchValue({
        appointmentTime: "10:00 AM"
      })
  }
  book4() {
    this.textColor5 = 'white';
    this.color5 = '#53B9C6';
    this.textColor2 = 'black';
    this.textColor3 = 'black';
    this.textColor4 = 'black';
    this.color3 = 'white'
    this.color4 = 'white'
    this.color2 = 'white'
    this.border5 = "none",
      this.border3 = "1px solid #707070",
      this.border4 = "1px solid #707070",
      this.border2 = "1px solid #707070",
      this.bookAppointmentForm.patchValue({
        appointmentTime: "11:00 AM"
      })
  }

  //Cancel Appointment
  cancelAppointment(patient) {
    this.isLoading = true;
    let reqDataForCancelAppointment = {
      "hospital_reg_num": this.signObj.hospitalInformation.hospital_reg_num,
      "appointmentID": patient.appointmentDetails.appointmentID,
      "byWhom": "Admin",
      "byWhomID": this.userID,
      "reason": this.cancelPatientAppointmentForm.value.cancelReason
    }
    console.log("Req for cancel appointment : ", reqDataForCancelAppointment);
    //Service for Cancel Appointment
    this.loginService.cancelAppointment(reqDataForCancelAppointment, this.signObj.access_token).subscribe(
      (resForCancelAppointment) => {
        if (resForCancelAppointment.response === 3) {
          this.isLoading = false;
          this.loading = false;
          this.modalService.dismissAll();
          this.ngOnInit();
          this.openSnackBar(resForCancelAppointment.message, "");
        }
        else {
          this.isLoading = false;
          this.loading = false;
          this.openSnackBar1(resForCancelAppointment.message, "");
          console.log(resForCancelAppointment.message);
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  openViewAppointmentMethod(viewAppointmentModelContent, patient) {
    this.modalService.open(viewAppointmentModelContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openCancelAppointmentMethod(viewCancelAppointmentModelContent, patient) {
    this.modalService.open(viewCancelAppointmentModelContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
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
  //Open PatientList Model
  openPatientModel(content1, patientsList) {
    this.modalService.open(content1, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  //Open DoctorsList Model
  openDoctorModel(content2) {
    this.modalService.open(content2, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


}
