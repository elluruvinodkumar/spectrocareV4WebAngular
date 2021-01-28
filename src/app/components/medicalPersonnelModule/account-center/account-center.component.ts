import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { CountryISO, SearchCountryField, TooltipLabel } from 'projects/ngx-intl-tel-input/src/public_api';
import { MedicalPersonnelService } from 'src/app/services/medical-personnel.service';
import Swiper from 'swiper';

@Component({
  selector: 'app-account-center',
  templateUrl: './account-center.component.html',
  styleUrls: ['./account-center.component.css']
})
export class AccountCenterComponent implements OnInit {
  baseURL: string = "http://34.231.177.197:3000";
  titleArray: any =
    {
      title: "Account Center",
      subTitle: "",
      img: "assets/images/ui/Icons/patient-medical-module/Group 2494.png"
    };
  separateDialCode = true;
  country: any;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  //preferredCountries: CountryISO[]=[];
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.Taiwan, CountryISO.China, CountryISO.Malaysia];
  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }
  medicalPersonnelForm: FormGroup;
  changePasswordForm: FormGroup;
  editFamilyHistoryForm: FormGroup;
  openProfileScreen: boolean = false;
  openServiceScreen: boolean = false;
  openServiceTimeScreen: boolean = false;
  isValue: any;
  isActive: any;
  closeResult: string;
  signObj: any;
  userID: string;
  previewImg: any;
  pic: string;
  loading: boolean;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  isPasswordOne: boolean;
  medicalPersonnelData: any;
  listOfDays = [
    { value: 'Monday', viewValue: 'Monday' },
    { value: 'Tuesday', viewValue: 'Tuesday' },
    { value: 'Wednesday', viewValue: 'Wednesday' },
    { value: 'Thursday ', viewValue: 'Thursday ' },
    { value: 'Friday', viewValue: 'Friday' },
    { value: 'Saturday', viewValue: 'Saturday' },
    { value: 'Sunday', viewValue: 'Sunday' },
  ];

  listOfIdenties = [
    { value: 'Administrator System Manager', viewValue: 'Administrator System Manager' },
    { value: 'system manager', viewValue: 'system manager' },
    { value: 'Administrator General', viewValue: 'Administrator General' },
    { value: 'Pharmacy', viewValue: 'Pharmacy' },
    { value: 'Admissions', viewValue: 'Admissions' },
    { value: 'Cardiology', viewValue: 'Cardiology' },
    { value: 'Administrative', viewValue: 'Administrative' },
    { value: 'Medical', viewValue: 'Medical' },
    { value: 'Paramedical', viewValue: 'Paramedical' },
    { value: 'Reception', viewValue: 'Reception' },
    { value: 'Radiology', viewValue: 'Radiology' },
    { value: "Haematology", viewValue: "Haematology" },
    { value: "general", viewValue: "General" },
  ];

  listOfDepartments = [
    { value: 'Pharmacy', viewValue: 'Pharmacy' },
    { value: 'Admissions', viewValue: 'Admissions' },
    { value: 'Cardiology', viewValue: 'Cardiology' },
    { value: 'Administrative', viewValue: 'Administrative' },
    { value: 'Medical', viewValue: 'Medical' },
    { value: 'Paramedical', viewValue: 'Paramedical' },
    { value: 'Reception', viewValue: 'Reception' },
    { value: 'Radiology', viewValue: 'Radiology' },
    { value: "Haematology", viewValue: "Haematology" },
    { value: 'Critical Care', viewValue: 'Critical Care' }
  ];

  officeHours = [{
    "dayName": "Monday",
    "sessions": [{
      "sessionName": "Morning",
      "startTime": "10:00 AM",
      "endTime": "11:00 PM",
      "isOn": true
    },
    {
      "sessionName": "Afternoon",
      "startTime": "01:30 PM",
      "endTime": "04:10 PM",
      "isOn": true
    },
    {
      "sessionName": "Evening",
      "startTime": "06:40 PM",
      "endTime": "08:10 PM",
      "isOn": true
    }
    ]
  },
  {
    "dayName": "Tuesday",
    "sessions": [{
      "sessionName": "Morning",
      "startTime": "9:00 AM",
      "endTime": "12:00 PM",
      "isOn": true
    },
    {
      "sessionName": "Afternoon",
      "startTime": "01:00 PM",
      "endTime": "04:00 PM",
      "isOn": true
    },
    {
      "sessionName": "Evening",
      "startTime": "06:00 PM",
      "endTime": "08:00 PM",
      "isOn": true
    }
    ]
  },
  {
    "dayName": "Wednesday",
    "sessions": [{
      "sessionName": "Morning",
      "startTime": "9:00 AM",
      "endTime": "12:00 PM",
      "isOn": true
    },
    {
      "sessionName": "Afternoon",
      "startTime": "01:00 PM",
      "endTime": "04:00 PM",
      "isOn": true
    },
    {
      "sessionName": "Evening",
      "startTime": "06:00 PM",
      "endTime": "08:00 PM",
      "isOn": true
    }
    ]
  }, {
    "dayName": "Thursday",
    "sessions": [{
      "sessionName": "Morning",
      "startTime": "9:00 AM",
      "endTime": "12:00 PM",
      "isOn": true
    },
    {
      "sessionName": "Afternoon",
      "startTime": "01:00 PM",
      "endTime": "04:00 PM",
      "isOn": true
    },
    {
      "sessionName": "Evening",
      "startTime": "06:00 PM",
      "endTime": "08:00 PM",
      "isOn": true
    }
    ]
  },
  {
    "dayName": "Friday",
    "sessions": [{
      "sessionName": "Morning",
      "startTime": "9:00 AM",
      "endTime": "12:00 PM",
      "isOn": true
    },
    {
      "sessionName": "Afternoon",
      "startTime": "01:00 PM",
      "endTime": "04:00 PM",
      "isOn": true
    },
    {
      "sessionName": "Evening",
      "startTime": "06:00 PM",
      "endTime": "08:00 PM",
      "isOn": true
    }
    ]
  },
  {
    "dayName": "Saturday",
    "sessions": [{
      "sessionName": "Morning",
      "startTime": "9:10 AM",
      "endTime": "12:10 PM",
      "isOn": true
    },
    {
      "sessionName": "Afternoon",
      "startTime": "01:20 PM",
      "endTime": "04:20 PM",
      "isOn": false
    },
    {
      "sessionName": "Evening",
      "startTime": "06:30 PM",
      "endTime": "08:30 PM",
      "isOn": false
    }
    ]
  }, {
    "dayName": "Sunday",
    "sessions": [{
      "sessionName": "Morning",
      "startTime": "9:00 AM",
      "endTime": "12:00 PM",
      "isOn": false
    },
    {
      "sessionName": "Afternoon",
      "startTime": "01:00 PM",
      "endTime": "04:00 PM",
      "isOn": false
    },
    {
      "sessionName": "Evening",
      "startTime": "06:00 PM",
      "endTime": "08:00 PM",
      "isOn": false
    }
    ]
  }]
  appointmentHours = [
    {
      "date": "2020/09/23",
      "sessions": [{
        "sessionName": "Morning",
        "startTime": "09:00 AM",
        "endTime": "10:00 AM"
      },
      {
        "sessionName": "Morning",
        "startTime": "11:00 AM",
        "endTime": "12:00 PM"
      },
      {
        "sessionName": "Afternoon",
        "startTime": "01:00 PM",
        "endTime": "03:00 PM"
      },
      {
        "sessionName": "Afternoon",
        "startTime": "04:00 PM",
        "endTime": "05:00 PM"
      },
      {
        "sessionName": "Evening",
        "startTime": "06:00 PM",
        "endTime": "08:00 PM"
      },
      {
        "sessionName": "Evening",
        "startTime": "09:00 PM",
        "endTime": "10:00 PM"
      }]
    },
    {
      "date": "2020/09/24",
      "sessions": [{
        "sessionName": "Morning",
        "startTime": "09:00 AM",
        "endTime": "10:00 AM"
      },
      {
        "sessionName": "Morning",
        "startTime": "11:00 AM",
        "endTime": "12:00 PM"
      },
      {
        "sessionName": "Afternoon",
        "startTime": "01:00 PM",
        "endTime": "03:00 PM"
      },
      {
        "sessionName": "Afternoon",
        "startTime": "04:00 PM",
        "endTime": "05:00 PM"
      },
      {
        "sessionName": "Evening",
        "startTime": "06:00 PM",
        "endTime": "08:00 PM"
      },
      {
        "sessionName": "Evening",
        "startTime": "09:00 PM",
        "endTime": "10:00 PM"
      }]
    },
    {
      "date": "2020/09/25",
      "sessions": [{
        "sessionName": "Morning",
        "startTime": "09:00 AM",
        "endTime": "10:00 AM"
      },
      {
        "sessionName": "Morning",
        "startTime": "11:00 AM",
        "endTime": "12:00 PM"
      },
      {
        "sessionName": "Afternoon",
        "startTime": "01:00 PM",
        "endTime": "03:00 PM"
      },
      {
        "sessionName": "Afternoon",
        "startTime": "04:00 PM",
        "endTime": "05:00 PM"
      },
      {
        "sessionName": "Evening",
        "startTime": "06:00 PM",
        "endTime": "08:00 PM"
      },
      {
        "sessionName": "Evening",
        "startTime": "09:00 PM",
        "endTime": "10:00 PM"
      }]
    }, {
      "date": "2020/09/26",
      "sessions": []
    },
    {
      "date": "2020/09/27",
      "sessions": []
    }, {
      "date": "2020/09/28",
      "sessions": []
    },
    {
      "date": "2020/09/29",
      "sessions": []
    }, {
      "date": "2020/09/30",
      "sessions": []
    },
    {
      "date": "2020/09/31",
      "sessions": []
    },

    // {
    //   "date": "2020/09/24",
    //   "sessions": [{
    //     "sessionName": "Morning",
    //     "startTime": "09:00 AM",
    //     "endTime": "10:00 AM"
    //   },
    //   {
    //     "sessionName": "Morning",
    //     "startTime": "11:00 AM",
    //     "endTime": "12:00 PM"
    //   },
    //   {
    //     "sessionName": "Afternoon",
    //     "startTime": "01:00 PM",
    //     "endTime": "03:00 PM"
    //   },
    //   {
    //     "sessionName": "Afternoon",
    //     "startTime": "04:00 PM",
    //     "endTime": "05:00 PM"
    //   },
    //   {
    //     "sessionName": "Evening",
    //     "startTime": "06:00 PM",
    //     "endTime": "08:00 PM"
    //   },
    //   {
    //     "sessionName": "Evening",
    //     "startTime": "09:00 PM",
    //     "endTime": "10:00 PM"
    //   }]
    // },
    // {
    //   "date": "2020/09/25",
    //   "sessions": [{
    //     "sessionName": "Morning",
    //     "startTime": "09:00 AM",
    //     "endTime": "10:00 AM"
    //   },
    //   {
    //     "sessionName": "Morning",
    //     "startTime": "11:00 AM",
    //     "endTime": "12:00 PM"
    //   },
    //   {
    //     "sessionName": "Afternoon",
    //     "startTime": "01:00 PM",
    //     "endTime": "03:00 PM"
    //   },
    //   {
    //     "sessionName": "Afternoon",
    //     "startTime": "04:00 PM",
    //     "endTime": "05:00 PM"
    //   },
    //   {
    //     "sessionName": "Evening",
    //     "startTime": "06:00 PM",
    //     "endTime": "08:00 PM"
    //   },
    //   {
    //     "sessionName": "Evening",
    //     "startTime": "09:00 PM",
    //     "endTime": "10:00 PM"
    //   }]
    // },
    // {
    //   "date": "2020/09/26",
    //   "sessions": [{
    //     "sessionName": "Morning",
    //     "startTime": "09:00 AM",
    //     "endTime": "10:00 AM"
    //   },
    //   {
    //     "sessionName": "Morning",
    //     "startTime": "11:00 AM",
    //     "endTime": "12:00 PM"
    //   },
    //   {
    //     "sessionName": "Afternoon",
    //     "startTime": "01:00 PM",
    //     "endTime": "03:00 PM"
    //   },
    //   {
    //     "sessionName": "Afternoon",
    //     "startTime": "04:00 PM",
    //     "endTime": "05:00 PM"
    //   },
    //   {
    //     "sessionName": "Evening",
    //     "startTime": "06:00 PM",
    //     "endTime": "08:00 PM"
    //   },
    //   {
    //     "sessionName": "Evening",
    //     "startTime": "09:00 PM",
    //     "endTime": "10:00 PM"
    //   }]
    // }
  ]
  clinicalService = [{
    "serviceName": "Acne Cure",
    "serviceDescription": "Acne is a common condition and is almost universal in teenagers. It occurs when small openings on the surface of the skin (pores) become plugged, inflamed, and sometimes infected. The duration and severity of acne is unique to each individual and most common on the face, central chest and shoulders. \nTreatment Options: Acne has various treatment options depending on the severity and type of acne. Most common treatment options include topical creams, oral medications, chemical peels, extraction and even laser therapy. Preventable measures include washing the skin to remove oil and bacteria on a routine basis (two or three times daily), facial cream which is oil based can plug up pores and should be avoided and recommend products that are labeled as “ non-comedogenic” or “non-acnegnic, “oil free” be used."
  },
  {
    "serviceName": "Dry Skin",
    "serviceDescription": "Dry skin is a very common skin condition, usually characterized by irritated skin and itchiness. Dry skin often worsens in the winter, when the air is cold and dry. Treatment is important because extensively dry skin can lead to dermatitis which is inflammation of the skin. Dry skin can be caused by environmental factors, harsh soap/detergents which strip away fatty oils, leaving your skin unprotected. Less often the cause is internal. \n Treatment Options: Limiting bath/showers to 5-10 minutes and using lukewarm water, apply a heavy cream or ointments during winter months and lighter lotions in the summer."
  }
  ]
  mySwiper: any = null;
  selectedDayData: any;
  selectedDateHours: any;
  selectedAppointmentTimeData: any;
  listOfMorningTimings = [
    { value: '9:00 AM', viewValue: '9:00 AM' },
    { value: '10:00 AM', viewValue: '10:00 AM' },
    { value: '11:00 AM', viewValue: '11:00 AM' },
    { value: '12:00 PM', viewValue: '12:00 PM' }
  ];
  file: any;
  fileName: any;
  fileSize: any;
  fileValue: any;

  @ViewChild("fileInput", { static: true }) el: ElementRef;
  constructor(private fb: FormBuilder, private cd: ChangeDetectorRef,
    private modalService: NgbModal, private _snackBar: MatSnackBar,
    private medicalPersonnelService: MedicalPersonnelService) { }

  ngOnInit() {
    this.previewImg = "../../../assets/images/ui/Icons/1x/profile-1.png";
    var signInRes = localStorage.getItem("SignInRes");

    if (signInRes) {
      this.signObj = JSON.parse(signInRes);
      this.userID = localStorage.getItem('userID');
      console.log(this.signObj);
      this.medicalPersonnelData = this.signObj.medicalPersonnel.profile.userProfile;
      if (this.signObj.medicalPersonnel.profile.userProfile.profilePic === "") {
        this.pic = "../../../assets/images/ui/Icons/1x/profile-1.png"
      }
      else {
        let a = this.signObj.medicalPersonnel.profile.userProfile.profilePic;
        this.pic = this.baseURL + a
        console.log("picture url from sidebar (admincenter) of the Admin : ", a);
      }

    }

    this.openProfile();
    this.medicalPersonnelForm = this.fb.group({

      profilePic: [""],
      userID: ["", [Validators.required]],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      phoneNumber: this.fb.group({
        countryCode: ['', Validators.required],
        phoneNumber: ['', Validators.required],
      }),
      department: ["", Validators.required],
      userType: ["", Validators.required],
      preferLanguage: ["", Validators.required],
      medical_personnel_id: [""],
      gender: ["", Validators.required],
      age: ["", Validators.required],
      dob: ["", Validators.required],
      speciality: ["", Validators.required],
      experience: ["", Validators.required],
      spokenLanguages: ['', Validators.required],
      biography: ["", Validators.required],
      checkPhone: ['', [Validators.required]],
      emergencyPhoneNumber: ['', [Validators.required]],
      emergencyPhoneNumberCountryCode: ["", [Validators.required]],
      emergencyPhoneNumberExtension: ["", [Validators.required]],
      emailID: ['', [Validators.required]],
      password: ["", [Validators.required]]
    });

    console.log("Selected medicalPersonnelData To Edit Data : ", this.medicalPersonnelData);
    this.medicalPersonnelForm.patchValue({
      userID: this.medicalPersonnelData.userID,
      verificationStatus: this.medicalPersonnelData.verificationStatus,
      userType: this.medicalPersonnelData.userType,
      preferLanguage: this.medicalPersonnelData.preferLanguage,
      hospital_reg_num: this.medicalPersonnelData.hospital_reg_num,
      registerTime: this.medicalPersonnelData.registerTime,
      firstName: this.medicalPersonnelData.firstName,
      lastName: this.medicalPersonnelData.lastName,
      emailID: this.medicalPersonnelData.emailID,
      gender: this.medicalPersonnelData.gender,
      department: this.medicalPersonnelData.department,
      checkPhone: this.medicalPersonnelData.phoneNumber.phoneNumber,
      phoneNumber: {
        phoneNumber: this.medicalPersonnelData.phoneNumber.phoneNumber,
        countryCode: this.medicalPersonnelData.phoneNumber.countryCode
      },
      emergencyPhoneNumber: this.medicalPersonnelData.emergencyPhoneNumber.phoneNumber,
      emergencyPhoneNumberCountryCode: this.medicalPersonnelData.emergencyPhoneNumber.countryCode,
      emergencyPhoneNumberExtension: "0",
      password: this.medicalPersonnelData.password,
      medical_personnel_id: this.medicalPersonnelData.medical_personnel_id,
      age: this.medicalPersonnelData.age,
      dob: "dob",
      biography: this.signObj.medicalPersonnel.profile && this.signObj.medicalPersonnel.profile.biography || "",
      experience: this.signObj.medicalPersonnel.profile && this.signObj.medicalPersonnel.profile.generalInformation && this.signObj.medicalPersonnel.profile.generalInformation.experience || "",
      speciality: this.signObj.medicalPersonnel.profile && this.signObj.medicalPersonnel.profile.generalInformation && this.signObj.medicalPersonnel.profile.generalInformation.speciality || "",
      spokenLanguages: this.signObj.medicalPersonnel.profile && this.signObj.medicalPersonnel.profile.generalInformation && this.signObj.medicalPersonnel.profile.generalInformation.spokenLanguages || ""
    });
    if (this.medicalPersonnelData.profilePic === "") {
      this.previewImg = "../../../assets/images/ui/Icons/1x/profile-1.png";
    }
    else if (this.medicalPersonnelData.profilePic === "../../../assets/images/ui/Icons/1x/profile-1.png") {
      this.previewImg = this.medicalPersonnelData.profilePic;
    }
    else {
      this.previewImg = this.baseURL + this.medicalPersonnelData.profilePic;
    }

    this.editFamilyHistoryForm = this.fb.group({
      clinicalServices: this.fb.array([]),
    });

    setTimeout(() => {
      this.initiateSwiper();
    }, 100)


    this.changePasswordForm = this.fb.group({
      "userID": this.signObj.medicalPersonnel.profile.userProfile.userID,
      "oldPassword": ['', [Validators.required, Validators.minLength(8)]],
      "newPassword": ['', [Validators.required, Validators.minLength(8)]],
      "confirmpassword": ['', Validators.required],
    },
      {
        validators: this.checkPasswords
      });
    this.changePasswordForm.markAsTouched();

  }

  checkPasswords(c: AbstractControl): { invalid: boolean } {
    if (c.get('newPassword').value !== c.get('confirmpassword').value) {
      return { invalid: true };
    }
  }

  callAppointmentsByDateWise(index, data) {
    console.log("appointments based on data index numbers ... ", index);
    //let i = this.appointmentHours.findIndex(index);
    let index1 = -1;
    index1 = this.appointmentHours.findIndex((val) => {
      return val.date == data;
    });
    if (index1 != -1) {
      this.selectedDateHours = this.appointmentHours[index].sessions;
      console.log(
        "selected date hours : ",
        this.selectedDateHours
      );
      //this.autoPatchPatientProfileData(this.selectedPatient);
    }
  }

  callUpdateAppointment(day) {
    this.isActive = 1;
    console.log("updated day data : ", day);

    console.log(this.selectedDateHours, this.listOfMorningTimings);

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
        this.medicalPersonnelForm.get("profilePic").setValue(file);
        this.previewImg = reader.result;
      };
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }
  removeUploadedFile() {
    //alert("remove uploaded file");
    let newFileList = Array.from(this.el.nativeElement.files);
    this.medicalPersonnelForm.get("profilePic").setValue(null);
  }

  changeStatus(event, index) {
    console.log(event.target.value, index);
    console.log("Before cheking...", this.selectedDayData.sessions[index]);
    if (this.selectedDayData.sessions[index].isOn == true) {
      this.selectedDayData.sessions[index].isOn = false;

      console.log("if condi...", this.selectedDayData.sessions[index]);
    }
    else {
      this.selectedDayData.sessions[index].isOn = true;

      console.log("else if condi...", this.selectedDayData.sessions[index]);
    }
    console.log("After checking...", this.selectedDayData.sessions[index]);
  }

  //Swiper
  initiateSwiper() {
    this.mySwiper = new Swiper('.s1', {
      slidesPerView: 7,
      spaceBetween: 5,
      // init: false,

      loop: true,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      autoplay: {
        delay: 2500,
        disableOnInteraction: false,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 20,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 6,
          spaceBetween: 40,
        },
      }
      // And if we need scrollbar
    })
  }

  patchFamilyHistory(clinicalService) {
    for (let i: number = 0; i <= clinicalService.length - 1; i++) {
      this.clinicalServiceArray.push(
        this.fb.group({
          serviceName: clinicalService[i].serviceName,
          serviceDescription: clinicalService[i].serviceDescription,
        })
      );
    }
  }

  //get family history
  get clinicalServiceArray() {
    return <FormArray>this.editFamilyHistoryForm.get("clinicalServices");
  }
  //Add patient to the family history
  addServiceToArray() {
    this.clinicalServiceArray.push(
      this.fb.group({
        serviceName: [""],
        serviceDescription: [""],
      })
    );
  }
  //Remove patient from family history
  removeService(index) {
    this.clinicalServiceArray.removeAt(index);
  }

  //update Clinical Services Data
  updateMedicalPerssonelClinicalServiceSubmit() {
    this.isLoading = true;

    let payLoad = this.editFamilyHistoryForm.value;
    let sendedObjData = {
      "userID": this.signObj.medicalPersonnel.profile.userProfile.userID,
      "medical_personnel_id": this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id,
      "clinicalServices": payLoad.clinicalServices
    }
    console.log("medical person data before alter/update api call : ", sendedObjData);

    console.log("the medical personnel clinical services data to update : ", JSON.stringify(sendedObjData));
    this.medicalPersonnelService.updateMedicalPersonnelClinicalServiceApiCall(sendedObjData, this.signObj.access_token).subscribe(
      (updateRes) => {
        if (updateRes.response === 3) {
          console.log("res from update medical person clinical services data : ", updateRes);
          this.isLoading = false;
          this.openSnackBar(updateRes.message, "");
          this.loading = false;

          this.signObj.medicalPersonnel.clinicalServices = payLoad.clinicalServices;
          console.log("after updated the clinical services : ", this.signObj);
          this.modalService.dismissAll();
          //this.fetchAdminGenralData();
        }
        else {
          //alert(updateRes.message);
          console.log("res from update medicalPerson clinical services data : ", updateRes);
          this.isLoading = false;
          this.openSnackBar1(updateRes.message, "");
          //alert(updateAdminGenUserRes.message);
        }
      },
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.openSnackBar1("Please try after sometime...", "");
        if (err.error instanceof Error) {
          this.isLoading = false;
          this.loading = false;
          console.log("Client Side Error", err);

        } else {
          this.isLoading = false;
          this.loading = false;
          console.log("Server Side", err)
        }
      }
    );
  }

  //Update Service Timings Data
  updateServiceTimeSubmit(officeHours) {
    console.log("updated service timings by Day wise : ", officeHours);
    //updateOfficeHoursApiCall
    this.isLoading = true;

    let payLoad = officeHours;
    let sendedObjData = {
      "userID": this.signObj.medicalPersonnel.profile.userProfile.userID,
      "medical_personnel_id": this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id,
      "officeHours": payLoad
    }
    console.log("medical person office hoours data before alter/update api call : ", sendedObjData);

    console.log("the medical personnel office hours data to update : ", JSON.stringify(sendedObjData));
    this.medicalPersonnelService.updateOfficeHoursApiCall(sendedObjData, this.signObj.access_token).subscribe(
      (updateRes) => {
        if (updateRes.response === 3) {
          console.log("res from update medical person office hours data : ", updateRes);
          this.isLoading = false;
          this.openSnackBar(updateRes.message, "");
          this.loading = false;

          this.signObj.medicalPersonnel.serviceTime.officeHours = payLoad;
          console.log("after updated the office hours : ", this.signObj);

          //this.modalService.dismissAll();
          //this.fetchAdminGenralData();
        }
        else {
          //alert(updateRes.message);
          console.log("res from update medicalPerson office hours data : ", updateRes);
          this.isLoading = false;
          this.openSnackBar1(updateRes.message, "");
          //alert(updateAdminGenUserRes.message);
        }
      },
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.openSnackBar1("Please try after sometime...", "");
        if (err.error instanceof Error) {
          this.isLoading = false;
          this.loading = false;
          console.log("Client Side Error", err);

        } else {
          this.isLoading = false;
          this.loading = false;
          console.log("Server Side", err)
        }
      }
    );
  }

  //update Admin Gen Data
  updateMedicalPersonSubmit() {
    this.isLoading = true;
    let countryCode1 = this.medicalPersonnelForm.get(["checkPhone"]).value;
    var str1 = countryCode1.number;
    str1 = str1.replace(/ +/g, "");
    this.medicalPersonnelForm.patchValue({
      phoneNumber: {
        countryCode: countryCode1.dialCode,
        phoneNumber: str1
      }
    })
    let payLoad = this.medicalPersonnelForm.value;
    console.log("medical person data before alter/update api call : ", payLoad);

    delete payLoad.profilePic;
    delete payLoad.checkPhone;
    delete payLoad.verificationStatus;
    delete payLoad.password;
    delete payLoad.registerTime;
    delete payLoad.emailID;
    let formData = new FormData()
    //formData.append("adminData", JSON.stringify(payLoad));
    formData.append("profilePic", this.medicalPersonnelForm.get('profilePic').value);
    formData.append("userID", this.medicalPersonnelForm.value.userID);
    formData.append("firstName", this.medicalPersonnelForm.value.firstName);
    formData.append("lastName", this.medicalPersonnelForm.value.lastName);
    formData.append("phoneNumber", this.medicalPersonnelForm.value.phoneNumber.phoneNumber);
    formData.append("phoneNumberCountryCode", this.medicalPersonnelForm.value.phoneNumber.countryCode);
    formData.append("emergencyPhoneNumber", this.medicalPersonnelForm.value.emergencyPhoneNumber);
    formData.append("emergencyPhoneNumberCountryCode", this.medicalPersonnelForm.value.emergencyPhoneNumberCountryCode);
    formData.append("emergencyPhoneNumberExtension", this.medicalPersonnelForm.value.emergencyPhoneNumberExtension);
    formData.append("department", this.medicalPersonnelForm.value.department);
    formData.append("userType", this.medicalPersonnelForm.value.userType);
    formData.append("preferLanguage", this.medicalPersonnelForm.value.preferLanguage);
    formData.append("medical_personnel_id", this.medicalPersonnelForm.value.medical_personnel_id);
    formData.append("gender", this.medicalPersonnelForm.value.gender);
    formData.append("age", this.medicalPersonnelForm.value.age);
    formData.append("dob", this.medicalPersonnelForm.value.dob);
    formData.append("speciality", this.medicalPersonnelForm.value.speciality);
    formData.append("experience", this.medicalPersonnelForm.value.experience);
    formData.append("spokenLanguages", this.medicalPersonnelForm.value.spokenLanguages);
    formData.append("biography", this.medicalPersonnelForm.value.biography);

    //console.log("the medical personnel data to update : ", JSON.stringify(payLoad));
    this.medicalPersonnelService.updateMedicalPersonnelApiCall(formData, this.signObj.access_token).subscribe(
      (updateRes) => {
        if (updateRes.response === 3) {
          console.log("res from update medical person data : ", updateRes);
          this.isLoading = false;
          this.openSnackBar(updateRes.message, "");
          this.loading = false;
          console.log("before inserting data in to the Local Obj : ", this.signObj);

          this.signObj.medicalPersonnel.profile.userProfile.phoneNumber.countryCode = this.medicalPersonnelForm.value.phoneNumber.countryCode;
          this.signObj.medicalPersonnel.profile.userProfile.phoneNumber.phoneNumber = this.medicalPersonnelForm.value.phoneNumber.phoneNumber;
          this.signObj.medicalPersonnel.profile.userProfile.emergencyPhoneNumber.countryCode = this.medicalPersonnelForm.value.emergencyPhoneNumberCountryCode;
          this.signObj.medicalPersonnel.profile.userProfile.emergencyPhoneNumber.phoneNumber = this.medicalPersonnelForm.value.emergencyPhoneNumber;
          this.signObj.medicalPersonnel.profile.userProfile.verificationStatus = this.signObj.medicalPersonnel.profile.userProfile.verificationStatus;
          this.signObj.medicalPersonnel.profile.userProfile.preferLanguage = this.medicalPersonnelForm.value.preferLanguage;
          this.signObj.medicalPersonnel.profile.userProfile.hospitalApprove = this.signObj.medicalPersonnel.profile.userProfile.hospitalApprove;
          this.signObj.medicalPersonnel.profile.userProfile.loc = this.signObj.medicalPersonnel.profile.userProfile.loc;
          this.signObj.medicalPersonnel.profile.userProfile.hospital_reg_num = this.signObj.medicalPersonnel.profile.userProfile.hospital_reg_num;
          this.signObj.medicalPersonnel.profile.userProfile.userID = this.medicalPersonnelForm.value.userID;
          this.signObj.medicalPersonnel.profile.userProfile.password = this.signObj.medicalPersonnel.profile.userProfile.password;
          this.signObj.medicalPersonnel.profile.userProfile.lastName = this.medicalPersonnelForm.value.lastName;
          this.signObj.medicalPersonnel.profile.userProfile.firstName = this.medicalPersonnelForm.value.firstName;
          this.signObj.medicalPersonnel.profile.userProfile.gender = this.medicalPersonnelForm.value.gender;
          this.signObj.medicalPersonnel.profile.userProfile.age = this.medicalPersonnelForm.value.age;
          this.signObj.medicalPersonnel.profile.userProfile.emailID = this.signObj.medicalPersonnel.profile.userProfile.emailID;
          this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id = this.medicalPersonnelForm.value.medical_personnel_id;
          this.signObj.medicalPersonnel.profile.userProfile.profilePic = updateRes.profilePic;
          this.signObj.medicalPersonnel.profile.userProfile.userType = this.medicalPersonnelForm.value.userType;
          this.signObj.medicalPersonnel.profile.userProfile.department = this.medicalPersonnelForm.value.department;
          this.signObj.medicalPersonnel.profile.userProfile.registerTime = this.signObj.medicalPersonnel.profile.userProfile.registerTime;
          this.signObj.medicalPersonnel.profile.userProfile.dob = this.medicalPersonnelForm.value.dob;
          this.signObj.medicalPersonnel.profile.biography = this.medicalPersonnelForm.value.biography;
          this.signObj.medicalPersonnel.profile.generalInformation.experience = this.medicalPersonnelForm.value.experience;
          this.signObj.medicalPersonnel.profile.generalInformation.speciality = this.medicalPersonnelForm.value.speciality;
          this.signObj.medicalPersonnel.profile.generalInformation.spokenLanguages = this.medicalPersonnelForm.value.spokenLanguages;

          console.log("After inserting data in to the Local Obj : ", this.signObj);
          //this.modalService.dismissAll();
          //this.fetchAdminGenralData();
        }
        else {
          //alert(updateRes.message);
          console.log("res from update medicalPerson data : ", updateRes);
          this.isLoading = false;
          this.openSnackBar1(updateRes.message, "");
          //alert(updateAdminGenUserRes.message);
        }
      },
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.openSnackBar1("Please try after sometime...", "");
        if (err.error instanceof Error) {
          this.isLoading = false;
          this.loading = false;
          console.log("Client Side Error", err);

        } else {
          this.isLoading = false;
          this.loading = false;
          console.log("Server Side", err)
        }
      }
    );
  }

  changePwdSubmit() {
    this.isLoading1 = true;
    //console.log(this.signObj.access_token);
    console.log("Change Pwd Req : ", this.changePasswordForm.value);

    let payLoad = this.changePasswordForm.value
    delete payLoad.confirmpassword
    console.log("payload", payLoad)

    this.medicalPersonnelService.changePassword(this.changePasswordForm.value).subscribe(
      (changePwdRes) => {
        console.log("Change Pwd Response : ", changePwdRes);

        if (changePwdRes.response === 3) {
          //this.router.navigateByUrl('/adminprofile')
          //this.loading= false;
          this.isLoading1 = false;
          this.modalService.dismissAll();
          this.changePasswordForm.reset();
          //this.fetchAdminGenralData();
          this.openSnackBar(changePwdRes.message, "");
        }
        else {
          this.isLoading1 = false;
          this.openSnackBar1(changePwdRes.message, "");
          //alert(changePwdRes.message);
        }
      },
      (err: HttpErrorResponse) => {
        this.isLoading1 = false;
        this.openSnackBar1("Please try after sometime...", "");
        if (err.error instanceof Error) {
          this.loading = false;
          console.log("Client Side Error", err);

        } else {
          this.loading = false;
          console.log("Server Side", err)
        }
      }
    );
  }

  openProfile() {
    this.isValue = 1;
    this.openProfileScreen = true;
    this.openServiceScreen = false;
    this.openServiceTimeScreen = false;
  }
  openClinicalService() {
    this.isValue = 2;
    this.openProfileScreen = false;
    this.openServiceScreen = true;
    this.openServiceTimeScreen = false;
  }
  openServiceTime() {
    this.isValue = 3;
    this.openProfileScreen = false;
    this.openServiceScreen = false;
    this.openServiceTimeScreen = true;
  }
  //Mat Snack Bar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom', // 'top' | 'bottom'
      horizontalPosition: 'right', //'start' | 'center' | 'end' | 'left' | 'right'
    })
  }
  //Mat Snack Bar
  openSnackBar1(message: string, action: string) {
    this._snackBar.open(message, action, {
      duration: 5000,
      verticalPosition: 'bottom', // 'top' | 'bottom'
      horizontalPosition: 'right', //'start' | 'center' | 'end' | 'left' | 'right'
      panelClass: ['red-snackbar']
    })
  }

  editMedicalPersonnelProfileMethod(editMedicalPersonnelContent, clinicalService) {
    this.patchFamilyHistory(clinicalService);
    this.modalService
      .open(editMedicalPersonnelContent, {
        ariaLabelledBy: "modal-basic-title", centered: true, size: "lg", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          let size = this.clinicalServiceArray.length;
          console.log(size);
          for (let i = -1; i < size; i++) {
            console.log("the  I value is : ", i);

            this.removeService(i);
          }
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          let size = this.clinicalServiceArray.length;
          console.log(size);
          for (let i = -1; i < size; i++) {
            console.log("the  I value is : ", i);
            this.removeService(i);
          }
        }
      );
  }
  editOfficeHoursMethod(editOfficeHoursModel, selectedDay) {
    this.selectedDayData = selectedDay;
    this.modalService
      .open(editOfficeHoursModel, { ariaLabelledBy: "modal-basic-title", centered: true, size: "lg", backdrop: false })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  editAppointmentTimeMethod(editAppointmentTimeModel, selectedAppointmentTime) {
    this.selectedAppointmentTimeData = selectedAppointmentTime;
    //this.listOfMorningTimes = selectedAppointmentTime;
    this.modalService
      .open(editAppointmentTimeModel, { ariaLabelledBy: "modal-basic-title", centered: true, size: "lg", backdrop: false })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }
  openChangePasswordMethod(changePasswordModel) {
    this.modalService
      .open(changePasswordModel, { ariaLabelledBy: "modal-basic-title", centered: true, size: "lg", backdrop: false })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
          this.changePasswordForm.reset();
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
          this.changePasswordForm.reset();
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
}
