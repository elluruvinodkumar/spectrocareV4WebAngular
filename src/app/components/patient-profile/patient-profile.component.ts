import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { LoginService } from 'src/app/services/login.service';
import { FormGroup, FormBuilder } from '@angular/forms';

@Component({
  selector: 'app-patient-profile',
  templateUrl: './patient-profile.component.html',
  styleUrls: ['./patient-profile.component.css']
})
export class PatientProfileComponent implements OnInit {
  baseURL: string = "http://34.231.177.197:3000";
  signInRes: any;
  signObj: any;
  userID: any;
  sub: any;
  id: string;
  isValue: any;
  patients: any = [];
  selectedPatient: any;
  SelectedPatient: any;
  fetchPatientAppointmentsObj: any;
  patientAppointmentsData: any;
  titleArray: any =
    {
      title: "Patient",
      subTitle: "",
      img: "assets/images/ui/Icons/patient-medical-module/Group 2494.png"
    };
  patientProfileForm: FormGroup;
  uploadedPatProfilePic: any;
  loading: boolean;

  isViewPatientGeneralInfo: boolean = true;
  isViewPatientMedicalRecords: boolean = true;
  isViewPatientAppointmentRecord: boolean = true;
  isViewPatientScreeningRecords: boolean = true;

  previewImg: any;
  @ViewChild('fileInput', { static: true }) el: ElementRef;
  constructor(private router: Router, private cd: ChangeDetectorRef, private loginService: LoginService,
    private fb: FormBuilder, private activatedRoute: ActivatedRoute,
    private http: HttpClient) { }

  ngOnInit() {
    this.loading = true;

    this.signInRes = localStorage.getItem("SignInRes");
    this.signObj = JSON.parse(this.signInRes);

    this.previewImg = "../../../assets/images/ui/Icons/1x/profile-1.png";
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      this.loginService.id = this.id;
      console.log("id from component : ", this.id);
      console.log("id from login service : ", this.loginService);


    })
    console.log("Selected Patient Data : ", this.selectedPatient);

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
    this.patientProfileForm = this.fb.group({
      profilePic: [""],
      gender: [""],
      dob: [""]
    });

    this.callPatientGeneralInfo();
    this.fetchPatientAppointments();
    this.uploadImg();
  }

  getPatientData(obj) {
    this.loginService.getPatientData(obj).subscribe(
      (res) => {
        console.log("res from rou", res)
        if (res.response === 3) {
          this.loading = false;

          this.patients = res.patients

          let index = -1
          index = this.patients.findIndex(val => {

            return val.patientID == this.id
          })
          if (index != -1) {
            this.selectedPatient = this.patients[index]
            this.SelectedPatient = this.selectedPatient;
            console.log("selected patient from patient medical module : ", this.selectedPatient);
            console.log("SelectedPatient : ", this.SelectedPatient);

            this.previewImg = this.baseURL + this.selectedPatient.profilePic;

            //this.theImg = "http://34.199.165.142:3000" + this.patProComponent.SelectedPatient.profilePic;
            this.http.get(this.previewImg, { responseType: "blob" }).subscribe((file) => {
              let imgFile = new File([file], "userimg.jpg");
              this.patientProfileForm.get('profilePic').setValue(imgFile)
            })

            let dob = this.selectedPatient.dob / 1000;//| this.selectedPatient.dob
            let unixDates = dob;
            var date1 = new Date(unixDates * 1000);
            let timeToShow = date1.getFullYear() + '/' + ('0' + (date1.getMonth() + 1)).slice(-2) + '/' + ('0' + date1.getDate()).slice(-2);
            //this.dateToShow = date1.getFullYear() + '-' + ('0' + (date1.getMonth() + 1)).slice(-2) + '-' + ('0' + date1.getDate()).slice(-2);
            //let timeToShow = date1.getHours() + ':' + date1.getMinutes() + ':' + date1.getSeconds();

            this.patientProfileForm.patchValue({
              gender: this.selectedPatient.gender,
              dob: timeToShow
            });
            // this.autoAddFields(this.selectedPatient)
          }

        }
        else if (res.response === 0) {
          this.loading = false;
          //alert(res.message)
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
      })
  }

  callBookAppointment(selectedPatient) {
    this.router.navigate(['/admincenter/bookappointment'], {
      queryParams: {
        firstName: selectedPatient.firstName,
        countryCode: selectedPatient.phoneNumber.countryCode,
        phoneNumber: selectedPatient.phoneNumber.phoneNumber,
        emailID: selectedPatient.emailID,
        patientID: selectedPatient.patientID,
        medical_record_id: selectedPatient.medical_record_id
      }
    })
  }

  //Fetch Patient APPOINTMENTS Records
  fetchPatientAppointments() {
    this.fetchPatientAppointmentsObj = {
      "patientID": this.id,
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num
    }
    console.log("Obj Data to fetch patient Appointments Records : ", this.fetchPatientAppointmentsObj);
    this.loginService.getPatientAppointmentsData(this.fetchPatientAppointmentsObj, this.signObj.access_token).
      subscribe(
        (res) => {
          console.log("res from fetch patient Appointmets records  : ", res)
          if (res.response === 3) {

            this.loading = false;
            this.patientAppointmentsData = res.appointments;
            let appointmentsArray: any[] = this.patientAppointmentsData;
            console.log("Number of appointment : ", appointmentsArray.length);

            console.log("Res from Patient Appointments Records Data : ", this.patientAppointmentsData);
            // for(let i = 0; i <= appointmentsArray.length; i++){
            //   if(appointmentsArray[i].appointmentDate !== ""){
            //     let allDates = appointmentsArray[i];
            //     console.log("appointment dates : ",allDates);              
            //   }
            //   else if(appointmentsArray[i].appointmentDate === "undefined"){
            //     console.log("Unvalid date : ");

            //   }
            // }
          }
          else if (res.response === 0) {
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
        })


  }

  //Image Upload
  fileProgress(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.patientProfileForm.get('profilePic').setValue(file);
        this.previewImg = reader.result
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }
  removeUploadedFile() {
    let newFileList = Array.from(this.el.nativeElement.files);
    this.patientProfileForm.get('profilePic').setValue(null)
  }
  //Img Upload complete here

  uploadImg() {
    this.uploadedPatProfilePic = this.patientProfileForm.get('profilePic').value
    console.log("uploaded img : ", this.uploadedPatProfilePic);

  }
  callPatientGeneralInfo() {
    // this.router.navigateByUrl('/admincenter/patientgeneralinfo');
    this.isValue = 1;
    this.isViewPatientGeneralInfo = false;
    this.isViewPatientMedicalRecords = true;
    this.isViewPatientAppointmentRecord = true;
    this.isViewPatientScreeningRecords = true;
  }

  callPatientMedicalReocrds() {
    //this.router.navigateByUrl('/admincenter/patientmedicalrecords');
    this.isValue = 2;
    this.isViewPatientGeneralInfo = true;
    this.isViewPatientMedicalRecords = false;
    this.isViewPatientAppointmentRecord = true;
    this.isViewPatientScreeningRecords = true;
  }

  callPatientAppointmentRecords() {
    //this.router.navigateByUrl('/admincenter/patientappointmentrecords');
    this.isValue = 3;
    this.isViewPatientGeneralInfo = true;
    this.isViewPatientMedicalRecords = true;
    this.isViewPatientAppointmentRecord = false;
    this.isViewPatientScreeningRecords = true;
  }

  callPatientScreeningRecord() {
    //this.router.navigateByUrl('/admincenter/patientscreeningrecord');
    this.isValue = 4;
    this.isViewPatientGeneralInfo = true;
    this.isViewPatientMedicalRecords = true;
    this.isViewPatientAppointmentRecord = true;
    this.isViewPatientScreeningRecords = false;
  }


}
