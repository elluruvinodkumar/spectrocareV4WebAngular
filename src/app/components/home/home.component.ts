import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormArray } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  baseURL: string = "http://34.231.177.197:3000";
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.Taiwan, CountryISO.China, CountryISO.Malaysia];
  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }
  wedsiteData: any = [];
  //addWebSiteObj : any;
  checkCountryData: any;
  changePasswordForm: FormGroup;
  adminProfileForm: FormGroup;
  webSiteDataForm: FormGroup;
  homeForm: FormGroup;
  previewImg: any;
  previewImg1: any;
  signObj: any;
  userID: string;
  isPassword: boolean = true;
  isPasswordOne: boolean = true;
  isPasswordFour: boolean = true;
  isPasswordFive: boolean = true;
  password: string = "password";
  password1: string = "password";
  password4: string = "password";
  password5: string = "password";
  checkAdministrator: string;
  isAdminSystmMngr: boolean;
  disableUpdateBtn: boolean = false;
  disableUpdateBtn1: boolean = false;
  disableUpdateBtn2: boolean = false;
  disableUpdateBtn3: boolean = false;
  closeResult: string;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  isLoading2: boolean = false;
  titleArray: any =
    {
      title: "Admin Center",
      subTitle: "Profile",
      img: "assets/images/ui/Icons/1x/admin center.png"
    };
  // signInRes:any = localStorage.getItem("SignInRes");
  loading: boolean;

  //show date
  n = new Date();
  y = this.n.getFullYear();
  m = this.n.getMonth() + 1;
  d = this.n.getDate();
  presentDate = this.m + "/" + this.d + "/" + this.y;
  fethedWebSitesDataArray: any = [];
  countryCodes = [
    { value: '+91', viewValue: '+91' },
    { value: '+886', viewValue: '+886' },
    { value: '+60', viewValue: '+60' }
  ];

  departments = [
    { value: 'Pharmacy', viewValue: 'Pharmacy' },
    { value: 'Admissions', viewValue: 'Admissions' },
    { value: 'Cardiology', viewValue: 'Cardiology' },
    { value: 'Administrative', viewValue: 'Administrative' }
  ];
  webTypes = [
    { value: 'Official Website', viewValue: 'Official Website' },
    { value: 'Facebook', viewValue: 'Facebook' },
    { value: 'Twitter', viewValue: 'Twitter' },
    { value: 'Pinterest', viewValue: 'Pinterest' },
    { value: 'Blog', viewValue: 'Blog' },
    { value: 'WhatsApp', viewValue: 'WhatsApp' },
    { value: 'WeChat', viewValue: 'WeChat' },
    { value: 'Tumblr', viewValue: 'Tumblr' },
    { value: 'Instagram', viewValue: 'Instagram' },
    { value: 'Baidu Tieba', viewValue: 'Baidu Tieba' },
    { value: 'Skype', viewValue: 'Skype' },
    { value: 'Viber', viewValue: 'Viber' },
    { value: 'Sina Weibo', viewValue: 'Sina Weibo' },
    { value: 'Line', viewValue: 'Line' },
    { value: 'Snapchat', viewValue: 'Snapchat' },
    { value: 'YY', viewValue: 'YY' },
    { value: 'VKontakte', viewValue: 'VKontakte' },
    { value: 'LinkedIn', viewValue: 'LinkedIn' },
    { value: 'Telegram', viewValue: 'Telegram' },
    { value: 'Reddit', viewValue: 'Reddit' }
  ];
  webSiteDataArray: any[] = [];
  successResponse: string;
  failureResponse: string;
  @ViewChild('fileInput', { static: true }) el: ElementRef;
  @ViewChild('fileInput1', { static: true }) el1: ElementRef;
  @ViewChild('autoFocusTest', { static: false }) nativeEl: ElementRef;
  @ViewChild('autoFocusTest1', { static: false }) nativeEl1: ElementRef;

  @ViewChild('viewSuccessContent', { static: true }) modalSuccessExample: ElementRef<any>;
  @ViewChild('viewFailureContent', { static: true }) modalFailureExample: ElementRef<any>;
  constructor(private router: Router, private fb: FormBuilder, private cd: ChangeDetectorRef, private modalService: NgbModal,
    private loginService: LoginService, private _snackBar: MatSnackBar, private patientService: PatientService,
    private http: HttpClient) { }

  ngOnInit() {
    this.fethedWebSitesDataArray.length = 0;
    //console.log("array length & data : ", this.fethedWebSitesDataArray);

    this.patientService.isEditable.next(true)
    this.checkAdministrator = localStorage.getItem("AdministratorSystemManager");
    console.log("admin stm mgr : ", this.checkAdministrator);

    var signInRes = localStorage.getItem("SignInRes");
    if (signInRes) {
      this.signObj = JSON.parse(signInRes);
      this.userID = localStorage.getItem('userID');
      //this.fethedWebSitesDataArray.length = 0;
      this.fethedWebSitesDataArray = this.signObj.hospitalInformation.websites;
      console.log(" Available List of Web Sites are : ", this.fethedWebSitesDataArray);


      //console.log(this.signObj);
    }
    //  console.log("Admin Data : ",JSON.parse(this.adminData));
    this.previewImg = "assets/images/The-Health-Clinic.png";
    this.previewImg1 = "../../../assets/images/ui/Icons/1x/profile-1.png";
    this.homeForm = this.fb.group({
      userID: [''],
      hospitalName: ['', Validators.required],
      hospital_reg_num: ['', Validators.required],
      emailID: ['', Validators.required],
      address: ['', Validators.required],
      password: ['', Validators.required],
      city: [""],
      state: [""],
      country: [""],
      postCode: [""],
      latitude: [''],
      longitude: [''],
      checkPhone: ['', [Validators.required]],
      phoneNumber: this.fb.group({
        countryCode: [''],
        phoneNumber: [''],
      }),
      profilePic: [""]
    })

    this.homeForm.disable();
    //this.webSiteDataForm.disable();
    this.getCurrentLocation()
    this.loading = true;
    this.autoAddAdminData(this.signObj);
    this.loading = false;

    //Giving Access Controls to AdministratorSystemManager & AdministratorGeneral
    if (this.checkAdministrator === "3") {
      this.isAdminSystmMngr = true;
      //this.homeForm.enable()
    }
    else {
      this.isAdminSystmMngr = false;
      this.homeForm.disable();
      //this.webSiteDataForm.disable();
    }

    this.adminProfileForm = this.fb.group({
      userID: [""],
      verificationStatus: [""],
      identity: [""],
      gender: [""],
      preferLanguage: [""],
      hospital_reg_num: [""],
      password: [""],
      firstName: [""],
      lastName: [""],
      emailID: [""],
      department: [""],
      phoneNumber: this.fb.group({
        countryCode: [''],
        phoneNumber: [''],
      }),
      checkPhone: ['', [Validators.required]],
      profilePic: [""]
    });

    this.adminProfileForm.disable()
    this.loading = true;
    this.autoAddAdminProfileData(this.signObj);
    this.loading = false;

    //Change Pwd
    this.changePasswordForm = this.fb.group({
      "userID": this.signObj.hospitalAdmin.userID,
      "oldPassword": ['', [Validators.required, Validators.minLength(8)]],
      "newPassword": ['', [Validators.required, Validators.minLength(8)]],
      "confirmPassword": ['', Validators.required],
    }
      , {
        validators: this.passwordConfirming
      }
    )

    this.webSiteDataForm = this.fb.group({
      webSiteDataArray: this.fb.array([

      ])
    })

    this.webSiteDataForm.disable();
    //this.addWebDataToList();
    this.patchWebSiteData1(this.fethedWebSitesDataArray);
  }

  patchWebSiteData1(fethedWebSitesDataArray) {
    console.log("the array of web sites ... ", fethedWebSitesDataArray);

    for (let i: number = 0; i <= fethedWebSitesDataArray.length - 1; i++) {
      this.addWebsiteObj.push(
        this.fb.group({
          webType: fethedWebSitesDataArray[i].webType,
          webLink: fethedWebSitesDataArray[i].webLink
        })
      )
    }
  };

  //get medications
  get addWebsiteObj() {
    return <FormArray>this.webSiteDataForm.get('webSiteDataArray')
  }
  //Add medication to list
  addWebDataToList() {
    this.addWebsiteObj.push(this.fb.group({
      webType: [""],
      webLink: [""]
    }))
  }
  //Remove medication from list
  removeWebData(index) {
    this.addWebsiteObj.removeAt(index)
  }
  //Patch Medication
  patchWebSiteData(wedsiteData) {
    for (let i: number = 0; i <= wedsiteData.length - 1; i++) {
      this.addWebsiteObj.push(
        this.fb.group({
          webType: wedsiteData[i].webType,
          webLink: wedsiteData[i].webLink
        })
      )
    }
  }

  //Show Admin Data
  autoAddAdminProfileData(hospitalData) {
    let obj = {
      number: "789789789",
      internationalNumber: "+92 789789789",
      nationalNumber: "789789789",
      countryCode: "PAK",
      dialCode: "+92"
    }

    // console.log("Admin Data : ",JSON.parse(adminData));
    this.adminProfileForm.patchValue({
      userID: hospitalData.hospitalAdmin.userID,
      verificationStatus: hospitalData.hospitalAdmin.verificationStatus,
      identity: hospitalData.hospitalAdmin.identity,
      gender: hospitalData.hospitalAdmin.gender,
      preferLanguage: hospitalData.hospitalAdmin.preferLanguage,
      hospital_reg_num: hospitalData.hospitalAdmin.hospital_reg_num,
      password: hospitalData.hospitalAdmin.password,
      firstName: hospitalData.hospitalAdmin.firstName,
      lastName: hospitalData.hospitalAdmin.lastName,
      emailID: hospitalData.hospitalAdmin.emailID,
      department: hospitalData.hospitalAdmin.department,
      checkPhone: hospitalData.hospitalAdmin.phoneNumber.phoneNumber,
    })

    if (hospitalData.hospitalAdmin.profilePic === "") {
      this.previewImg = "../../../assets/images/ui/Icons/1x/profile-1.png";
      this.previewImg1 = "../../../assets/images/ui/Icons/1x/profile-1.png";
    }
    else if (hospitalData.hospitalAdmin.profilePic === "../../../assets/images/ui/Icons/1x/profile-1.png") {
      this.previewImg = hospitalData.hospitalAdmin.profilePic;
    }
    else {
      this.previewImg = this.baseURL + hospitalData.hospitalAdmin.profilePic;
      this.http.get(this.previewImg, { responseType: "blob" }).subscribe((file) => {
        let imgFile = new File([file], "userimg.jpg");
        this.adminProfileForm.get('profilePic').setValue(imgFile)
      })
    }
  }

  //Tab Change Event
  onTabChange(event) {
    console.log("event", event)
  }

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

  home() {
    console.log(this.homeForm.value);
  }

  //Image Upload
  fileProgress(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.adminProfileForm.get('profilePic').setValue(file);
        this.previewImg = reader.result
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }
  removeUploadedFile() {
    let newFileList = Array.from(this.el1.nativeElement.files);
    this.adminProfileForm.get('profilePic').setValue(null)
  }
  //Img Upload complete here

  //Image Upload
  fileProgress1(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.homeForm.get('profilePic').setValue(file);
        this.previewImg1 = reader.result
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }
  removeUploadedFile1() {
    let newFileList = Array.from(this.el.nativeElement.files);
    this.homeForm.get('profilePic').setValue(null)
  }
  //Img Upload complete here

  //Show Admin Data
  autoAddAdminData(hospitalData) {

    // console.log("Admin Data : ",JSON.parse(adminData));
    this.homeForm.patchValue({
      userID: hospitalData.hospitalAdmin.userID,
      hospitalName: hospitalData.hospitalInformation.hospitalName,
      checkPhone: this.signObj.hospitalInformation.phoneNumber.phoneNumber,
      phoneNumber: {
        phoneNumber: hospitalData.hospitalInformation.phoneNumber.phoneNumber,
        countryCode: hospitalData.hospitalInformation.phoneNumber.countryCode
      },
      hospital_reg_num: hospitalData.hospitalInformation.hospital_reg_num,
      emailID: hospitalData.hospitalInformation.emailID,
      address: hospitalData.hospitalInformation.address,
      password: hospitalData.hospitalAdmin.password,
      city: hospitalData.hospitalInformation.city,
      state: hospitalData.hospitalInformation.state,
      country: hospitalData.hospitalInformation.country,
      postCode: hospitalData.hospitalInformation.postCode,
      latitude: "" + hospitalData.hospitalInformation.loc[0],
      longitude: "" + hospitalData.hospitalInformation.loc[1]
    })
    if (hospitalData.hospitalInformation.hospitalPics.length !== 0) {
      //this.previewImg1 = "../../../assets/images/ui/Icons/1x/profile-1.png";
      this.previewImg1 = this.baseURL + hospitalData.hospitalInformation.hospitalPics[0].imagePath;
      this.http.get(this.previewImg1, { responseType: "blob" }).subscribe((file) => {
        let imgFile = new File([file], "userimg.jpg");
        this.homeForm.get('profilePic').setValue(imgFile)
      })
    }
    // else if (hospitalData.hospitalInformation.hospitalPics[0].imagePath = "") {
    else if (hospitalData.hospitalInformation.hospitalPics[0] = []) {
      this.previewImg1 = "../../../assets/images/ui/Icons/1x/profile-1.png";
    }
    else if (hospitalData.hospitalInformation.hospitalPics[0].imagePath = "../../../assets/images/ui/Icons/1x/profile-1.png") {
      this.previewImg1 = hospitalData.hospitalInformation.hospitalPics[0].imagePath;
    }
    else {
      this.previewImg1 = this.baseURL + hospitalData.hospitalInformation.hospitalPics[0].imagePath;
      this.http.get(this.previewImg1, { responseType: "blob" }).subscribe((file) => {
        let imgFile = new File([file], "userimg.jpg");
        this.homeForm.get('profilePic').setValue(imgFile)
      })
    }

    //this.patchWebSiteData(hospitalData.hospitalInformation.websites);
  }

  //For getting current location
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("Position", position);
        this.homeForm.patchValue({
          latitude: "" + position.coords.latitude.toFixed(4),
          longitude: "" + position.coords.longitude.toFixed(4)

        })
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
  }

  addWebSiteDataSubmit() {
    // for (let i = 0; i <= this.signObj.hospitalInformation.websites.length; i++) {
    //   this.removeWebData(this.signObj.hospitalInformation.websites[i]);
    //   console.log("removed web site num : ", this.signObj.hospitalInformation.websites[i]);
    // }
    this.isLoading2 = true;
    let payLoad = this.webSiteDataForm.value.webSiteDataArray;
    this.webSiteDataArray = [];
    for (let i: number = 0; i <= payLoad.length - 1; i++) {
      this.webSiteDataArray.push(
        {
          "webType": payLoad[i].webType,
          "webLink": payLoad[i].webLink
        }
      )
    }
    console.log("Add Websited data from form : ", this.webSiteDataArray);
    let addWebSiteObjData = {
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
      "userID": this.signObj.hospitalAdmin.userID,
      "websites": this.webSiteDataArray
    }
    console.log("the req for add wed sites obj : ", addWebSiteObjData);
    this.loginService.addHospitalWebSitesData(addWebSiteObjData, this.signObj.access_token).
      subscribe(
        (res) => {
          console.log("res from add wesites  : ", res)
          if (res.response === 3) {
            for (let i = 0; i <= this.webSiteDataArray.length - 1; i++) {
              this.removeWebData(this.webSiteDataArray[i]);
              console.log("removed web site num : ", this.webSiteDataArray[i]);
            }
            this.isLoading2 = false;
            console.log("updated array data ", this.webSiteDataArray);
            this.signObj.hospitalInformation.websites = [];
            this.signObj.hospitalInformation.websites = this.webSiteDataArray;
            console.log("the web sites after update : ", this.signObj.hospitalInformation.websites);

            //let emptyMedicinesData = this.signObj.hospitalInformation.websites.length;

            this.patchWebSiteData1(this.signObj.hospitalInformation.websites);
            //this.ngOnInit();
            //this.fethedWebSitesDataArray.length = 0;
            //this.signObj.hospitalInformation.websites = updateReq.hospitalPics[0].imagePath;
            //this.patchWebSiteData(webSiteDataArray);
            this.isLoading2 = false;
            this.loading = false;
            //this.illnessMedicationID = res.illnessMedicationID;

            //alert(res.message);
            this.openSnackBar(res.message, "");
            //this.ngOnInit();
          }
          else if (res.response === 0) {
            this.isLoading2 = false;
            this.loading = false;
            this.openSnackBar(res.message, "");
            //this.modalService.dismissAll();
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading2 = false;
            this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log(err)
          }
        })
  }

  //Update Admin / Hospital Info
  updateAdminInfo() {
    this.isLoading = true;

    let countryCode1 = this.homeForm.get(["checkPhone"]).value;
    console.log("CountryDetails 1 :", countryCode1);
    var str1 = countryCode1.number;
    str1 = str1.replace(/ +/g, "");
    this.homeForm.patchValue({

      phoneNumber: {
        countryCode: countryCode1.dialCode,
        phoneNumber: str1
      }

    })
    let payLoad = this.homeForm.value
    // let formData = new FormData();
    delete payLoad.checkPhone;
    delete payLoad.password;
    delete payLoad.profilePic;
    console.log("req for hospital update data  : ", payLoad);
    let formData = new FormData();
    formData.append("hospitalData", JSON.stringify(payLoad));
    formData.append("hospitalPic", this.homeForm.get('profilePic').value)

    this.loginService.updateAdmin(formData, this.signObj.access_token).subscribe((updateReq) => {
      console.log("req for update admin data : ", updateReq);
      if (updateReq.response === 3) {

        this.openSnackBar(updateReq.message, "");
        this.isLoading = false;

        this.signObj.hospitalAdmin.userID = this.homeForm.value.userID;
        this.signObj.hospitalInformation.hospitalName = this.homeForm.value.hospitalName;
        this.signObj.hospitalInformation.hospital_reg_num = this.homeForm.value.hospital_reg_num;
        this.signObj.hospitalInformation.emailID = this.homeForm.value.emailID;
        this.signObj.hospitalInformation.address = this.homeForm.value.address;
        this.signObj.hospitalInformation.city = this.homeForm.value.city;
        this.signObj.hospitalInformation.state = this.homeForm.value.state;
        this.signObj.hospitalInformation.country = this.homeForm.value.country;
        this.signObj.hospitalInformation.postCode = this.homeForm.value.postCode;
        this.signObj.hospitalInformation.loc[0] = this.homeForm.value.latitude;
        this.signObj.hospitalInformation.loc[1] = this.homeForm.value.longitude;
        this.signObj.hospitalInformation.phoneNumber.phoneNumber = str1;
        this.signObj.hospitalInformation.phoneNumber.countryCode = countryCode1.dialCode;
        if (updateReq.hospitalPics[0].imagePath === "") {
          this.signObj.hospitalInformation.hospitalPics[0].imagePath = "../../../assets/images/ui/Icons/1x/profile-1.png";
        }
        this.signObj.hospitalInformation.hospitalPics[0].imagePath = updateReq.hospitalPics[0].imagePath
        console.log("After update the hospital signObj data is : ", this.signObj);

        localStorage.setItem("SignInRes", JSON.stringify(this.signObj));
        //this.autoAddAdminData(this.signObj);

        //this.ngOnInit()

        //alert(updateReq.message)
      }
      else {
        this.isLoading = false;
        this.openSnackBar1(updateReq.message, "");
        //alert(updateReq.message)
      }
    },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {

          this.openSnackBar1("", "check your network");
          this.isLoading = false;
          console.log("Client Side Error", err);

        } else {

          this.openSnackBar1("", "check your network");
          this.isLoading = false;
          console.log("Server Side", err)
        }
      }
    );
  }

  //Update Admin General User Data
  updateAdminGeneralUser() {
    this.isLoading = true;
    let countryCode1 = this.adminProfileForm.get(["checkPhone"]).value;
    this.checkCountryData = countryCode1;
    console.log("Check Country code data : ", this.checkCountryData);
    console.log("CountryDetails 1 :", countryCode1);
    var str1 = countryCode1.number;
    str1 = str1.replace(/ +/g, "");
    this.adminProfileForm.patchValue({

      phoneNumber: {
        countryCode: countryCode1.dialCode,
        phoneNumber: str1
      }

    })

    console.log("admin data : ", this.adminProfileForm.value);
    let payLoad = this.adminProfileForm.value
    let formData = new FormData()
    delete payLoad.profilePic;
    delete payLoad.verificationStatus;
    delete payLoad.password;
    delete payLoad.emailID;
    delete payLoad.checkPhone
    console.log("payload from admin profile : ", payLoad);

    formData.append("adminData", JSON.stringify(payLoad));
    formData.append("profilePic", this.adminProfileForm.get('profilePic').value)
    this.loginService.updateAdminGenUser(formData, this.signObj.access_token).subscribe(
      (updateAdminGenUserData) => {
        console.log("res from update admin profile data : ", updateAdminGenUserData);
        if (updateAdminGenUserData.response === 3 && updateAdminGenUserData.profilePic !== "") {
          this.isLoading = false;
          //updating local storage
          this.signObj.hospitalAdmin.phoneNumber.phoneNumber = payLoad.phoneNumber.phoneNumber;
          this.signObj.hospitalAdmin.phoneNumber.countryCode = payLoad.phoneNumber.countryCode;
          this.signObj.hospitalAdmin.firstName = payLoad.firstName;
          this.signObj.hospitalAdmin.lastName = payLoad.lastName;
          this.signObj.hospitalAdmin.gender = payLoad.gender;
          this.signObj.hospitalAdmin.preferLanguage = payLoad.preferLanguage;
          this.signObj.hospitalAdmin.department = payLoad.department;
          this.loginService.isProfileUpdated.next(this.baseURL + updateAdminGenUserData.profilePic)
          this.signObj.hospitalAdmin.profilePic = updateAdminGenUserData.profilePic;

          console.log("After update the hospital signObj data is : ", this.signObj);
          console.log("updated phone num : " + this.signObj.hospitalInformation.phoneNumber.phoneNumber);
          console.log("ph num from payload : ", payLoad.phoneNumber.phoneNumber);
          localStorage.setItem("SignInRes", JSON.stringify(this.signObj));

          this.openSnackBar(updateAdminGenUserData.message, "");
          this.ngOnInit();
          //alert(updateAdminGenUserData.message);
        }
        else if (updateAdminGenUserData.response === 3 && updateAdminGenUserData.profilePic === "") {
          this.isLoading = false;
          this.signObj.hospitalAdmin.phoneNumber.phoneNumber = payLoad.phoneNumber.phoneNumber;
          this.signObj.hospitalAdmin.phoneNumber.countryCode = payLoad.phoneNumber.countryCode;
          this.signObj.hospitalAdmin.firstName = payLoad.firstName;
          this.signObj.hospitalAdmin.lastName = payLoad.lastName;
          this.signObj.hospitalAdmin.preferLanguage = payLoad.preferLanguage;
          this.signObj.hospitalAdmin.department = payLoad.department;
          this.signObj.hospitalAdmin.profilePic = "../../../assets/images/ui/Icons/1x/profile-1.png";
          localStorage.setItem("SignInRes", JSON.stringify(this.signObj));
          console.log("local storage data without img path : ", this.signObj);
          this.openSnackBar(updateAdminGenUserData.message, "");
          this.previewImg = "../../../assets/images/ui/Icons/1x/profile-1.png";

        }
        else {
          this.isLoading = false;
          this.openSnackBar(updateAdminGenUserData.message, "");
          //alert(updateAdminGenUserData.message);
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.isLoading = false;
          console.log("Client Side Error", err);

        } else {
          this.isLoading = false;
          console.log("Server Side", err)
        }
      }
    );
  }

  //Add Change Pwd Data
  changePwdSubmit() {
    this.isLoading1 = true;
    //console.log(this.signObj.access_token);
    console.log("Change Pwd Req : ", this.changePasswordForm.value);

    let payLoad = this.changePasswordForm.value
    delete payLoad.confirmPassword
    console.log("payload", payLoad)

    this.loginService.changePassword(this.changePasswordForm.value).subscribe(
      (changePwdRes) => {
        console.log("Change Pwd Response : ", changePwdRes);

        if (changePwdRes.response === 3) {
          this.isLoading1 = false;
          this.successResponse = changePwdRes.message;
          this.modalService.open(this.modalSuccessExample);
          this.changePasswordForm.reset();
          this.openSnackBar(changePwdRes.message, "");
          this.changePasswordForm.value.oldPassword = "";
          this.changePasswordForm.value.newPassword = "";
          this.changePasswordForm.value.confirmPassword = "";
        }
        else {
          this.isLoading1 = false;
          this.failureResponse = changePwdRes.message;
          this.modalService.open(this.modalFailureExample)
          this.openSnackBar(changePwdRes.message, "");
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.loading = false;
          this.isLoading1 = false;
          console.log("Client Side Error", err);

        } else {
          this.loading = false;
          this.isLoading1 = false;
          console.log("Server Side", err)
        }
      }
    );
  }

  showPassword() {
    if (this.isPassword === true) {
      this.password = "text";
      this.isPassword = false;
    } else {
      this.password = "password"
      this.isPassword = true;
    }
  }

  showPassword4() {
    if (this.isPasswordFour === true) {
      this.password4 = "text";
      this.isPasswordFour = false;
    } else {
      this.password4 = "password"
      this.isPasswordFour = true;
    }
  }
  showPassword5() {
    if (this.isPasswordFive === true) {
      this.password5 = "text";
      this.isPasswordFive = false;
    } else {
      this.password5 = "password"
      this.isPasswordFive = true;
    }
  }

  showPassword6() {
    if (this.isPasswordOne === true) {
      this.password1 = "text";
      this.isPasswordOne = false;
    } else {
      this.password1 = "password"
      this.isPasswordOne = true;
    }
  }

  passwordConfirming(c: AbstractControl) { //: { invalid: boolean }
    if (c.get('newPassword').value !== c.get('confirmPassword').value) {
      c.get('confirmPassword').setErrors({ NoPassswordMatch: true });
      //return { invalid: true };
    }
  }

  openUpdate() {
    if (this.disableUpdateBtn === false) {
      this.disableUpdateBtn = true;
      this.adminProfileForm.enable();
      this.patientService.isEditable.next(false)
      this.nativeEl.nativeElement.focus()
    }
    else {
      this.disableUpdateBtn = false;
      this.adminProfileForm.disable();
      this.patientService.isEditable.next(true)
    }
  }

  openUpdateGeneralInfo() {
    if (this.disableUpdateBtn2 === false) {
      this.disableUpdateBtn2 = true;
      this.homeForm.enable();
      this.patientService.isEditable.next(false)
      this.nativeEl1.nativeElement.focus()
    }
    else {
      this.disableUpdateBtn2 = false;
      this.homeForm.disable();
      this.patientService.isEditable.next(true)
    }
  }

  openUpdateWebData() {

    if (this.disableUpdateBtn3 === false) {
      this.disableUpdateBtn3 = true;
      this.webSiteDataForm.enable();
      //this.patientService.isEditable.next(false)
      //this.nativeEl1.nativeElement.focus()
    }
    else {
      this.disableUpdateBtn3 = false;
      this.webSiteDataForm.disable();
      //this.patientService.isEditable.next(true)
    }
  }

  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      //this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      //this.changePasswordForm.reset();
    });
  }
  //Signout Modal
  openSignOut(content1) {
    this.modalService.open(content1, { centered: true, size: "sm", backdrop: false })
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
  viewSuccessMethod(viewSuccessContent) {
    this.modalService.open(viewSuccessContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "sm" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  viewFailureMethod(viewFailureContent) {
    this.modalService.open(viewFailureContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "sm" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  // openVerticallyCentered(content) {
  //   this.modalService.open(content, { centered: true });
  // }
  SignOut() {
    console.log("SignOut Called")
    localStorage.clear()
    this.router.navigateByUrl('/administrator')
    this.modalService.dismissAll()
    //this.openSnackBar(resForCancelAppointment.message,"");
  }

}
