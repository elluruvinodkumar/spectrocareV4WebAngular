import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog, MatDialogRef, MatSnackBar } from '@angular/material';
import { ModalDismissReasons, NgbDate, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { ChatService } from 'src/app/services/chat.service';
import { LoginService } from 'src/app/services/login.service';
import { MedicalPersonnelService } from 'src/app/services/medical-personnel.service';
import { ChatComponent } from '../chat/chat.component';

interface SearchByValue {
  viewValue: string;
}
@Component({
  selector: 'app-medical-personnel-appointments',
  templateUrl: './medical-personnel-appointments.component.html',
  styleUrls: ['./medical-personnel-appointments.component.css']
})
export class MedicalPersonnelAppointmentsComponent implements OnInit {
  baseURL: string = "http://34.231.177.197:3000";
  titleArray: any =
    {
      title: "Appointment",
      subTitle: "",
      img: "assets/images/ui/Icons/1x/calendar1.png"
    };
  signInRes: any;
  signObj: any;
  listOfAppointments: any = [];
  filteredListOfAppointments: any = [];
  allAppointments: any = [];
  loading: boolean;
  listSize: any = 0;
  selected = 'All';
  searchByValue: SearchByValue[] = [
    { viewValue: 'All' },
    { viewValue: 'Waiting for confirmation' },
    { viewValue: 'Cancelled' },
    { viewValue: 'Confirmed' },
    { viewValue: 'Online' },
    { viewValue: 'Onsite' }
  ];
  term: any;
  isValue: any;
  isValue1: any;
  closeResult: string;

  viewManualInputView: boolean = false;
  viewAttachmentView: boolean = false;
  viewPatientIllness: boolean = true;
  viewPatientDiagnostic: boolean = true;
  viewPatientMedications: boolean = true;
  viewPatientSurgical: boolean = true;
  color: string;
  color1: string;
  color2: string;
  textColor: string;
  textColor1: string;
  textColor2: string;
  selectedAppointmentData: any;
  isLoading: boolean = false;
  listOfIllnessConditions = [
    { value: 'Appointment Booked' },
    { value: 'In treatment' }
  ];
  addPatIllnessForm: FormGroup;
  addPatMedicalRecordIllnessObj: any;
  createdIllnessID: any;
  addPatIllnessDiagnosisForm: FormGroup;
  addPatIllMedicationManuallyForm: FormGroup;
  addPatientIllnessMedicationObj: any;
  illnessMedicationID: any;
  addPatIllnessDiagnosisDataObj: any; medicalPersonnelObj: any;
  addPatientMedHistoryFileForm: FormGroup;

  addPatIllnessSurgicalForm: FormGroup;

  cancelPatientAppointmentForm: FormGroup;
  isNoFile: boolean = false;
  file: any;
  fileName: any;
  fileSize: any;
  fileValue: any;
  fileName1: any;
  fileSize1: any;
  fileValue1: any;
  previewImg: any;

  filteredMedicalPersonnels: any = [];

  medicalPersonnels: any = [];
  reasonForCancel = [
    { value: 'Patient no-show', viewValue: 'Patient no-show' },
    { value: 'Cancelled by doctor', viewValue: 'Cancelled by doctor' },
    { value: 'Cancelled by patient', viewValue: 'Cancelled by patient' },
    { value: 'Others', viewValue: 'Others' }
  ];
  isViewBottom: boolean = false;
  dateToShow: any;
  bookAppointmentForm: FormGroup;
  dp: any;
  color3: string;
  color4: string;
  color5: string;
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
  patientsList: any = [];
  filteredPatients: any = [];
  options: Array<any>;
  onlineObj = {
    userID: '',
    userType: '',
    online: true
  };
  offlineObj: any;
  constructor(private medicalPersonService: MedicalPersonnelService, private modalService: NgbModal,
    private fb: FormBuilder, private _snackBar: MatSnackBar,
    private loginService: LoginService, private dialogRef: MatDialog,
    private chatService: ChatService,) {
    this.chatService.userConnectedObj.subscribe((val: any) => {
      if (val && val.userID) {
        console.log("userConnectedObj called in medical-personnel-appointments component...", val);
        this.onlineObj.userID = val.userID;
        this.onlineObj.userType = val.userType;
        this.onlineObj.online = true;
        //this.patient.patient.patientDetails.isOnline = true;
      }
    });
    this.chatService.userDisconnectedObj.subscribe((val: any) => {
      if (val && val.userID) {
        console.warn("userDisconnectedObj called in chat component...", val);
        this.onlineObj.userID = val.userID;
        this.onlineObj.userType = val.userType;
        this.onlineObj.online = false;
        //this.patient.patient.patientDetails.isOnline = false;
      }
    });
  }

  ngOnInit() {
    this.showData;
    this.signInRes = localStorage.getItem("SignInRes");
    if (this.signInRes) {
      this.signObj = JSON.parse(this.signInRes);

      let getAppointmentsDataObj = {
        "hospital_reg_num": this.signObj.medicalPersonnel.profile.userProfile.hospital_reg_num,
        "byWhom": "medical personnel",
        "byWhomID": this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id,
      }
      this.loading = true;
      this.getMedicalPersonAppointmentsData(getAppointmentsDataObj);

      let getPatientsDataObj = {
        "byWhom": "medical personnel",
        "byWhomID": this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id,
        "category": "all",
        "hospital_reg_num": this.signObj.medicalPersonnel.profile.userProfile.hospital_reg_num,
        "token": this.signObj.access_token
      }
      this.getPatientData(getPatientsDataObj);

    }

    this.getUpcomingAppointments();

    this.addPatIllnessForm = this.fb.group({
      illnessCondition: [""],
      symptoms: [""],
      currentStatus: [""],
      description: [""],
      isCurrentIllness: [""],
      startDate: [""],
      endDate: [""]
    })

    this.addPatIllMedicationManuallyForm = this.fb.group({
      addMedicationArray: this.fb.array([
      ]),
      doctorMedicalPersonnelID: this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id,
      doctorName: this.signObj.medicalPersonnel.profile.userProfile.firstName,
      illnessID: [""]
    });

    this.addPatIllnessDiagnosisForm = this.fb.group({
      diagnosisDate: [""],
      diagnosis: [""],
      prescription: [""],
      remark: [""],
      byWhom: "medical personnel",
      byWhomID: this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id,
      doctorMedicalPersonnelID: this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id,
      doctorName: this.signObj.medicalPersonnel.profile.userProfile.firstName
    })
    this.addPatientMedHistoryFileForm = this.fb.group({
      profilePic: [""],
      prescription1MoreDetails: [""]
    })
    this.addPatIllnessSurgicalForm = this.fb.group({
      surgeryDate: [""],
      surgeryProcedure: [""],
      surgeryInformation: [""],
      profilePic: [""],
      moreDetails: [""],
      doctorMedicalPersonnelID: this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id,
      doctorName: this.signObj.medicalPersonnel.profile.userProfile.firstName
    })
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
      byWhom: "medical personnel",
      byWhomID: this.signObj.medicalPersonnel.profile.userProfile.userID,
      emailID: [""],
      phoneNumber: [""],
      //creatorName: [""],
      //createrMedicalPersonnelID: [""],
    });
    this.cancelPatientAppointmentForm = this.fb.group({
      cancelReason: [""]
    });
  }


  getPatientData(obj) {
    console.info("fetching patients data : ", obj);
    this.loginService.getPatientData(obj).subscribe(
      (res) => {
        console.log(res)
        if (res.response === 3) {
          this.patientsList = res.patients;
          this.filteredPatients = res.patients;
          console.log("list of patients : ", this.patientsList);
          this.options = this.patientsList;
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

  //get medications
  get addmedicationsObj() {
    return <FormArray>this.addPatIllMedicationManuallyForm.get('addMedicationArray')
  }
  //Add medication to list
  addMedicationToList() {
    this.addmedicationsObj.push(this.fb.group({
      name: [""],
      dosage: [""],
      freq: [""]
    }))
  }
  //Remove medication from list
  removeAddMedication(index) {
    this.addmedicationsObj.removeAt(index)
  }
  //Patch Medication
  patchPatientEditMedication(editmedicationData) {
    for (let i: number = 0; i <= editmedicationData.length - 1; i++) {
      this.addmedicationsObj.push(
        this.fb.group({
          name: editmedicationData[i].name,
          dosage: editmedicationData[i].dosage,
          freq: editmedicationData[i].freq
        })
      )
    }
  }
  // addPatientMedHistoryFileForm File Upload
  fileProgress2(event: any) {
    this.isNoFile = true;
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    this.fileName = file.name;
    this.fileSize = file.size;
    this.fileSize = (this.fileSize / 1024).toFixed(2);
    this.fileValue = "kb";
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.addPatientMedHistoryFileForm.get('profilePic').setValue(file);
        this.previewImg = reader.result
      }
      // ChangeDetectorRef since file is loading outside the zone
      //this.cd.markForCheck();
    }
  }
  removeUploadedFile2() {
    // let newFileList = Array.from(this.el.nativeElement.files);
    this.addPatientMedHistoryFileForm.get('profilePic').setValue(null)
    this.fileName = null;
    this.fileSize = null;
    this.fileValue = null;
    this.isNoFile = false;
  }
  fileProgress3(event: any) {
    this.isNoFile = true;
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    this.fileName1 = file.name;
    this.fileSize1 = file.size;
    this.fileSize1 = (this.fileSize1 / 1024).toFixed(2);
    this.fileValue1 = "kb";
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.addPatIllnessSurgicalForm.get('profilePic').setValue(file);
        this.previewImg = reader.result
      }
      // ChangeDetectorRef since file is loading outside the zone
      //this.cd.markForCheck();
    }
  }
  removeUploadedFile3() {
    // let newFileList = Array.from(this.el.nativeElement.files);
    this.addPatIllnessSurgicalForm.get('profilePic').setValue(null)
    this.fileName = null;
    this.fileSize = null;
    this.fileValue = null;
    this.isNoFile = false;
  }

  openPatientIllness() {
    this.isValue1 = 1;
    this.viewPatientIllness = false;
    this.viewPatientDiagnostic = true;
    this.viewPatientMedications = true;
    this.viewPatientSurgical = true;
  }
  openPatientDiagnostic() {
    this.isValue1 = 2;
    this.viewPatientIllness = true;
    this.viewPatientDiagnostic = false;
    this.viewPatientMedications = true;
    this.viewPatientSurgical = true;
  }
  openPatientMedications() {
    this.isValue1 = 3;
    this.viewPatientIllness = true;
    this.viewPatientDiagnostic = true;
    this.viewPatientMedications = false;
    this.viewPatientSurgical = true;
  }
  openPatientSurgical() {
    this.isValue1 = 4;
    this.viewPatientIllness = true;
    this.viewPatientDiagnostic = true;
    this.viewPatientMedications = true;
    this.viewPatientSurgical = false;
  }
  viewManualInput() {
    this.textColor = 'white';
    this.textColor1 = 'black';
    this.color = '#53B9C6';
    this.color1 = 'white'
    this.viewManualInputView = true;
    this.viewAttachmentView = false;
  }

  viewAttachment() {
    this.textColor = 'black';
    this.textColor1 = 'white';
    this.color = 'white'
    this.color1 = '#53B9C6';
    this.viewAttachmentView = true;
    this.viewManualInputView = false;
  }

  getMedicalPersonAppointmentsData(obj) {
    this.medicalPersonService.getAppointmentsData(obj, this.signObj.access_token).subscribe(
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
          //this.onlineObj.userID
          for (let i = 0; i < this.listOfAppointments.length - 1; i++) {
            if (this.listOfAppointments[i].patientDetails.patientID === this.onlineObj.userID) {
              if (this.listOfAppointments[i].patientDetails.isOnline === this.onlineObj.online) {
                this.listOfAppointments[i].patientDetails.isOnline = this.onlineObj.online;
              }
              else {
                this.listOfAppointments[i].patientDetails.isOnline = this.onlineObj.online;
              }
            }
          }
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
  showData(letSearch: string) {
    console.log("Print Value", letSearch);
    if (letSearch == "All") {
      this.term = ""
    } else {
      this.term = letSearch
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
        x.patientDetails.firstName.trim().toLowerCase().startsWith(term.trim().toLowerCase())
      );
    }
  }

  getUpcomingAppointments() {
    this.isValue = 2;
    console.log("upcoming appointments called");
    var presentDate = Math.round(new Date().getTime())
    console.log("present data : ", presentDate);
    //this.showData("All");
    var timestamp = presentDate;
    var date = new Date(timestamp * 1000);
    var formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
    //console.log(formattedDate);

    this.listOfAppointments = this.allAppointments.filter(date => {
      var timestamp1 = date.appointmentDetails.appointmentDate;

      var date1: any = new Date(timestamp1 * 1000);
      var formattedDate1 = ('0' + date1.getDate()).slice(-2) + '/' + ('0' + (date1.getMonth() + 1)).slice(-2) + '/' + date1.getFullYear();
      //console.log(formattedDate1);
      return presentDate < timestamp1;
      //return formattedDate1 > formattedDate
      //return date.appointmentDetails.appointmentDate > presentDate
    })
  }
  getTodayAppointments() {
    this.isValue = 1;

    console.log("today appointments called : ", this.allAppointments);
    var presentDate = Math.round(new Date().getTime())
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
      return presentDate === timestamp1
      //return formattedDate1 === formattedDate
      //      return date.appointmentDetails.appointmentDate === presentDate
    })
  }
  getPastAppointments() {
    console.log("past appointments called");
    this.isValue = 3;
    var presentDate = Math.round(new Date().getTime())
    console.log("present data : ", presentDate);
    //this.showData("All");
    var timestamp = presentDate;
    var date = new Date(timestamp * 1000);
    var formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
    //console.log(formattedDate);

    this.listOfAppointments = this.allAppointments.filter(date => {
      var timestamp1 = date.appointmentDetails.appointmentDate;
      var date1: any = new Date(timestamp1 * 1000);
      var formattedDate1 = ('0' + date1.getDate()).slice(-2) + '/' + ('0' + (date1.getMonth() + 1)).slice(-2) + '/' + date1.getFullYear();
      //console.log(formattedDate1);
      return presentDate > timestamp1;
      //return formattedDate1 < formattedDate
      //return date.appointmentDetails.appointmentDate < presentDate
    })
  }

  //Add Pat Medical Illness Record
  addPatMedicalRecordIllnessSubmit() {
    this.isLoading = true;
    let ngbDate = this.addPatIllnessForm.controls['startDate'].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split('/');
    var newDate = dateAr[2] + '/' + dateAr[0] + '/' + dateAr[1];
    var unixTimeData = new Date(newDate).getTime() / 1000;

    console.log("start date : ", unixTimeData);

    let ngbDate1 = this.addPatIllnessForm.controls['endDate'].value;
    let myDate1 = new Date(ngbDate1.year, ngbDate1.month - 1, ngbDate1.day);
    var dateAr1 = myDate1.toLocaleDateString().split('/');
    var newDate1 = dateAr1[2] + '/' + dateAr1[0] + '/' + dateAr1[1];
    var unixTimeData1 = new Date(newDate1).getTime() / 1000;

    console.log("end date : ", unixTimeData1);

    this.addPatMedicalRecordIllnessObj = {
      "hospital_reg_num": this.selectedAppointmentData.hospital_reg_num,
      "patientID": this.selectedAppointmentData.patientID,
      "medical_record_id": this.selectedAppointmentData.patientDetails.medical_record_id,
      "illnessCondition": this.addPatIllnessForm.value.illnessCondition,
      "symptoms": this.addPatIllnessForm.value.symptoms,
      "currentStatus": this.addPatIllnessForm.value.currentStatus,
      "description": this.addPatIllnessForm.value.description,
      "isCurrentIllness": this.addPatIllnessForm.value.isCurrentIllness,
      "byWhom": "medical personnel",
      "byWhomID": this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id,
      "startDate": '' + unixTimeData,
      "endDate": '' + unixTimeData1
    }
    console.log("the sended obj data for pat immunization data add : ", this.addPatMedicalRecordIllnessObj);
    this.medicalPersonService.addPatientMedicalRecordIllnessData(this.addPatMedicalRecordIllnessObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.openSnackBar(res.message, "");
            //alert(res.message);
            this.openPatientDiagnostic();
            this.isLoading = false;
            this.createdIllnessID = res.illnessID;
            //this.loading = false;
            //this.modalService.dismissAll();
            this.ngOnInit();
            console.log("res from add patient medical record illness data from component Success : ", res.message, res.illnessID);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })
  }
  //Add Pat Medical Diagnosis Notes
  addPatMedicalRecordDiagnosisNotesSubmit() {
    this.isLoading = true;
    let ngbDate = this.addPatIllnessDiagnosisForm.controls['diagnosisDate'].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split('/');
    var newDate = dateAr[2] + '/' + dateAr[0] + '/' + dateAr[1];
    var unixTimeData = new Date(newDate).getTime() / 1000;
    console.log("add ill medication date mydate : ", unixTimeData);
    //console.log("Add PAt Immunization Form Data : ",this.addPatImmunizationForm);
    this.addPatIllnessDiagnosisDataObj = {
      "hospital_reg_num": this.selectedAppointmentData.hospital_reg_num,
      "byWhom": this.addPatIllnessDiagnosisForm.value.byWhom,
      "byWhomID": this.addPatIllnessDiagnosisForm.value.byWhomID,
      "patientID": this.selectedAppointmentData.patientID,
      "medical_record_id": this.selectedAppointmentData.patientDetails.medical_record_id,
      "illnessID": this.createdIllnessID,
      "doctorMedicalPersonnelID": this.addPatIllnessDiagnosisForm.value.byWhomID,
      "doctorName": this.addPatIllnessDiagnosisForm.value.doctorName,
      "diagnosisDate": '' + unixTimeData,
      "diagnosis": this.addPatIllnessDiagnosisForm.value.diagnosis,
      "prescription": this.addPatIllnessDiagnosisForm.value.prescription,
      "remark": this.addPatIllnessDiagnosisForm.value.remark,

    }
    console.log("the sended obj data for pat ill diAgnosis data add : ", this.addPatIllnessDiagnosisDataObj);
    this.medicalPersonService.addPatientIllnessDiagnosisData(this.addPatIllnessDiagnosisDataObj, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.medicalPersonnelObj = "";
            this.isLoading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            this.openPatientMedications();
            //this.loading = false;
            //this.modalService.dismissAll();
            console.log("res from add patient ill diagnosis data from component Success : ", res.message);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
        })

  }
  //Add Pat Illness Medication Manually
  addPatIllnessMedicationManuallySubmit() {
    this.isLoading = true;
    let payLoad = this.addPatIllMedicationManuallyForm.value.addMedicationArray;
    let addMedicationArray: any[] = [];
    for (let i: number = 0; i <= payLoad.length - 1; i++) {
      addMedicationArray.push(
        {
          "name": payLoad[i].name,
          "dosage": payLoad[i].dosage,
          "freq": payLoad[i].freq,
          "purpose": " ",
          "durationDays": 5,
          "moreDetails": " "
        }
      )
    }
    console.log("addMedicationArray data from form : ", addMedicationArray);
    this.addPatientIllnessMedicationObj = {
      "hospital_reg_num": this.addPatIllnessDiagnosisDataObj.hospital_reg_num,
      "byWhom": this.addPatIllnessDiagnosisDataObj.byWhom,
      "byWhomID": this.addPatIllnessDiagnosisDataObj.byWhomID,
      "patientID": this.addPatIllnessDiagnosisDataObj.patientID,
      "medical_record_id": this.addPatIllnessDiagnosisDataObj.medical_record_id,
      "illnessID": this.addPatIllnessDiagnosisDataObj.illnessID,
      "doctorMedicalPersonnelID": this.addPatIllMedicationManuallyForm.value.doctorMedicalPersonnelID,
      "doctorName": this.addPatIllMedicationManuallyForm.value.doctorName,
      "medications": addMedicationArray
    }
    console.log("the req for add pat illness medications obj : ", this.addPatientIllnessMedicationObj);
    this.medicalPersonService.addPatientIllnessMedicationManualData(this.addPatientIllnessMedicationObj, this.signObj.access_token).
      subscribe(
        (res) => {
          console.log("res from add patient illness medications  : ", res)
          if (res.response === 3) {
            this.isLoading = false;
            this.loading = false;
            this.illnessMedicationID = res.illnessMedicationID;
            this.viewAttachment();
            //alert(res.message);
            this.openSnackBar(res.message, "");
            //this.ngOnInit();
          }
          else if (res.response === 0) {
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log(err)
          }
        })
  }
  //Add Patient Medical Record Illness Medication Attachment
  addPatientMedicalHistoryIllnessMedicationAttachmentSubmit() {
    this.isLoading = true;
    let formData = new FormData()
    formData.append("illnessID", this.addPatientIllnessMedicationObj.illnessID);
    formData.append("prescription1", this.addPatientMedHistoryFileForm.get('profilePic').value);
    formData.append("prescription1MoreDetails", this.addPatientMedHistoryFileForm.value.prescription1MoreDetails);
    formData.append("illnessMedicationID", this.illnessMedicationID);
    formData.append("doctorMedicalPersonnelID", this.addPatientIllnessMedicationObj.doctorMedicalPersonnelID);
    formData.append("doctorName", this.addPatientIllnessMedicationObj.doctorName);
    formData.append("patientID", this.addPatientIllnessMedicationObj.patientID);
    formData.append("medical_record_id", this.addPatientIllnessMedicationObj.medical_record_id);
    formData.append("byWhom", this.addPatientIllnessMedicationObj.byWhom);
    formData.append("byWhomID", this.addPatientIllnessMedicationObj.byWhomID);
    formData.append("hospital_reg_num", this.addPatientIllnessMedicationObj.hospital_reg_num);

    this.medicalPersonService.addPatientMedicalHistoryIllnessMedicationAttachment(formData, this.signObj.access_token).subscribe(
      (updateAdminGenUserData) => {
        console.log("res from add patient Medial-Record Illness Attachment data : ", updateAdminGenUserData);
        if (updateAdminGenUserData.response === 3) {
          this.isLoading = false;
          this.removeUploadedFile2();
          //alert(updateAdminGenUserData.message);
          this.openSnackBar(updateAdminGenUserData.message, "");
          this.openPatientSurgical();
          //this.modalService.dismissAll();
          this.ngOnInit();
        }
        else {
          this.isLoading = false;
          //this.loading = false;
          //alert(updateAdminGenUserData.message);
          this.openSnackBar(updateAdminGenUserData.message, "");
          //this.modalService.dismissAll();
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.isLoading = false;
          //this.loading = false;
          console.log("Client Side Error", err);

        } else {
          this.isLoading = false;
          //this.loading = false;
          console.log("Server Side", err)
        }
      }
    );
  }
  //Add Pat Medical Diagnosis Notes
  addPatIllSurgicalFormSubmit() {
    this.isLoading = true;
    let ngbDate = this.addPatIllnessSurgicalForm.controls['surgeryDate'].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split('/');
    var newDate = dateAr[2] + '/' + dateAr[0] + '/' + dateAr[1];
    var unixTimeData = new Date(newDate).getTime() / 1000;
    console.log("add ill addPatIllnessSurgicalForm date mydate : ", unixTimeData);
    //console.log("Add PAt Immunization Form Data : ",this.addPatImmunizationForm);

    let payLoad = this.addPatIllnessSurgicalForm.value;
    let formData = new FormData()

    formData.append("patientID", this.addPatientIllnessMedicationObj.patientID);
    formData.append("medical_record_id", this.addPatientIllnessMedicationObj.medical_record_id);
    formData.append("hospital_reg_num", this.addPatientIllnessMedicationObj.hospital_reg_num);
    formData.append("illnessID", this.addPatientIllnessMedicationObj.illnessID);
    formData.append("byWhom", this.addPatientIllnessMedicationObj.byWhom);
    formData.append("byWhomID", this.addPatientIllnessMedicationObj.byWhomID);
    formData.append("surgicalRecord", this.addPatIllnessSurgicalForm.get('profilePic').value);
    formData.append("moreDetails", this.addPatIllnessSurgicalForm.value.moreDetails);
    formData.append("doctorMedicalPersonnelID", this.addPatIllnessSurgicalForm.value.doctorMedicalPersonnelID);
    formData.append("doctorName", this.addPatIllnessSurgicalForm.value.doctorName);
    formData.append("surgeryProcedure", this.addPatIllnessSurgicalForm.value.surgeryProcedure);
    formData.append("surgeryDate", '' + unixTimeData);
    //formData.append("surgeryInformtion", this.addPatIllnessSurgicalForm.value.surgeryInformation);

    console.log("the sended obj data for pat ill surgical record data add : ", formData);
    this.medicalPersonService.addPatIllSurgicalFormData(formData, this.signObj.access_token).
      subscribe(
        (res) => {
          if (res.response === 3) {
            this.isLoading = false;
            //this.removeUploadedFile3();
            //this.openPatientMedications();
            //this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
            console.log("res from add patient ill surgical data from component Success : ", res.message);
          }
          else if (res.response === 0) {
            this.isLoading = false;
            //this.loading = false;
            //alert(res.message);
            this.openSnackBar(res.message, "");
            console.log("failure case", res.message);
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          this.isLoading = false;
          if (err.error instanceof Error) {
            this.isLoading = false;
            //this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            //this.loading = false;
            console.log(err)
          }
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
      byWhom: "medical personnel",
      byWhomID: this.signObj.medicalPersonnel.profile.userProfile.userID,
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
  closeReschedule() {
    this.isViewBottom = false;
  }
  //Cancel Appointment
  cancelAppointment(patient) {
    this.isLoading = true;
    let reqDataForCancelAppointment = {
      "hospital_reg_num": patient.hospital_reg_num,
      "appointmentID": patient.appointmentDetails.appointmentID,
      "byWhom": "medical personnel",
      "byWhomID": this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id,
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
  rescheduleAppointment() {
    this.isLoading = true;
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
  //call open video model
  openVideoModel(patient) {
    let dataRequired = {
      patient: patient,
      signObj: this.signObj
    }
    let dialogRef = this.dialogRef.open(
      ChatComponent, {
      height: '80vh',
      // width: '70%',
      panelClass: 'col-md-9',
      hasBackdrop: true,
      disableClose: true,
      data: dataRequired
    }
    );
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
  openViewAppointmentMethod(viewAppointmentModelContent, patient) {
    this.selectedAppointmentData = patient;
    console.log("the Selected appointment data : ", this.selectedAppointmentData);

    this.openPatientIllness();
    this.viewManualInput();
    this.modalService.open(viewAppointmentModelContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openCancelAppointmentMethod(viewCancelAppointmentModelContent, patient) {
    this.selectedAppointmentData = patient;
    console.log("the Selected appointment data : ", this.selectedAppointmentData);
    this.modalService.open(viewCancelAppointmentModelContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

}
