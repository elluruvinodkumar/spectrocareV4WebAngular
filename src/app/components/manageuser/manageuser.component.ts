import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { HttpErrorResponse } from '@angular/common/http';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { Router } from '@angular/router';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-manageuser',
  templateUrl: './manageuser.component.html',
  styleUrls: ['./manageuser.component.css']
})
export class ManageuserComponent implements OnInit {
  baseURL: string = "http://34.231.177.197:3000";
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.Taiwan, CountryISO.China, CountryISO.Malaysia];
  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }

  addAdminGenUserForm: FormGroup;
  adminGeneralUserProfileFormView: FormGroup;
  adminGeneralUserProfileForm: FormGroup;
  medicalUserProfileForm: FormGroup;
  changePasswordForm: FormGroup;
  closeResult: string;
  signInRes: any;
  signObj: any;
  userID: string;
  loading: boolean;
  isLoading: boolean = false;
  adminData: any = localStorage.getItem("SignInRes");
  adminData1: any = JSON.parse(this.adminData);

  adminTeam: any = [];
  adminTeamData: any = [];
  filteredAdminTeam: any = [];
  medicalPersonnels: any = [];
  filteredMedicalPersonnels: any = [];
  checkAdministrator: string;
  isAdminSystmMngr: boolean = false;
  isAdminAdd: boolean = true;
  isViewAdmin: boolean = true;
  disableUpdateBtn: boolean = false;
  isPassword: boolean = true;
  isAdminUser: boolean = true;
  isMedicalUser: boolean = false;
  password: string = "password";
  term: any;
  previewImg: any;
  previewImg1: any;
  previewImg2: any;
  previewImg3: any;
  previewImg4: any;
  isIdentity: string = "Administrator System Manager";

  titleArray: any =
    {
      title: "Admin Center",
      subTitle: "Manage User",
      img: "assets/images/ui/Icons/1x/admin center.png"
    };

  //show date
  n = new Date();
  y = this.n.getFullYear();
  m = this.n.getMonth() + 1;
  d = this.n.getDate();
  presentDate = this.m + "/" + this.d + "/" + this.y;

  departments = [
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

  listOfIdenties = [
    // { value: 'General' },
    { value: 'general' },
    // { value: 'System Manager' },
    { value: 'system manager' }
    // { value: 'General Manager' },
    // { value: 'Admin General Manager' },
    // { value: 'Admin System Manager' },
    // { value: 'Doctor' },
    // { value: 'Nurse' },
    // { value: 'Billing Manager'}
  ];

  identitys = [
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

  preferLanguages = [
    { value: 'English', viewValue: 'English' },
    { value: 'Chinese', viewValue: 'Chinese' },
    { value: 'French', viewValue: 'French' },
    { value: 'Spanish', viewValue: 'Spanish' },
    { value: 'Taipe', viewValue: 'Taipe' }
  ];

  @ViewChild('autoFocusTest', { static: false }) nativeEl: ElementRef;
  @ViewChild('fileInput', { static: true }) el: ElementRef;

  constructor(private router: Router, private loginService: LoginService, private modalService: NgbModal, private fb: FormBuilder,
    private _snackBar: MatSnackBar, private cd: ChangeDetectorRef, private patientService: PatientService) { }

  ngOnInit() {
    this.patientService.isEditable.next(true);
    this.previewImg = "../../../assets/images/ui/Icons/1x/profile-1.png";
    this.previewImg1 = "../../../assets/images/ui/Icons/1x/profile-1.png";
    this.previewImg2 = "../../../assets/images/ui/Icons/1x/profile-1.png";
    this.previewImg3 = "../../../assets/images/ui/Icons/1x/profile-1.png";
    this.previewImg4 = "../../../assets/images/ui/Icons/1x/profile-1.png";
    this.checkAdministrator = localStorage.getItem("AdministratorSystemManager");
    this.loading = true;
    this.signInRes = localStorage.getItem("SignInRes");
    if (this.signInRes) {
      this.signObj = JSON.parse(this.signInRes);
      this.userID = localStorage.getItem('userID');
      this.fetchAdminGenralData();
      this.fetchMedicalPersonnelsData();
    }

    //Add Admin General User
    this.addAdminGenUserForm = this.fb.group({
      adminManagerUserID: [""],
      userID: ["", [Validators.required]],
      hospital_reg_num: ["", Validators.required],
      password: ["", Validators.required],
      confirmpassword: ['', Validators.required],
      firstName: ["", Validators.required],
      lastName: ["", Validators.required],
      gender: ["", Validators.required],
      emailID: ["", Validators.required],
      preferLanguage: ["", Validators.required],
      department: ["", Validators.required],
      identity: ["", Validators.required],
      checkPhone: ['', [Validators.required]],
      phoneNumber: this.fb.group({
        countryCode: ['', Validators.required],
        phoneNumber: ['', Validators.required],
      }),
      profilePic: [""],
    },
      {
        validators: this.checkPasswords
      });
    this.autoAddAdminGenUserData(this.signObj);

    //Edit Admin Gen User Form
    this.adminGeneralUserProfileForm = this.fb.group({
      userID: ["", [Validators.required]],
      verificationStatus: [""],
      identity: ["", [Validators.required]],
      gender: ["", [Validators.required]],
      preferLanguage: ["", [Validators.required]],
      hospital_reg_num: ["", [Validators.required]],
      registerTime: [""],
      firstName: ["", [Validators.required]],
      lastName: ["", [Validators.required]],
      emailID: ["", [Validators.required]],
      department: ["", [Validators.required]],
      checkPhone: ['', [Validators.required]],
      phoneNumber: this.fb.group({
        countryCode: ['', [Validators.required]],
        phoneNumber: ['', [Validators.required]],
      }),
      profilePic: [""],
      password: ["", [Validators.required]]
    });

    this.adminGeneralUserProfileFormView = this.fb.group({
      userID: [""],
      verificationStatus: [""],
      identity: [""],
      gender: [""],
      preferLanguage: [""],
      hospital_reg_num: [""],
      registerTime: [""],
      firstName: [""],
      lastName: [""],
      emailID: [""],
      department: [""],
      checkPhone: ['', [Validators.required]],
      phoneNumber: this.fb.group({
        countryCode: [''],
        phoneNumber: [''],
      }),
      profilePic: [""],
      password: [""]
    });
    //View Medical Personnel Form
    this.medicalUserProfileForm = this.fb.group({
      userID: [""],
      specialization: [""],
      hospital_reg_num: [""],
      registerTime: [""],
      firstName: [""],
      lastName: [""],
      emailID: [""],
      department: [""],
      checkPhone: ['', [Validators.required]],
      phoneNumber: this.fb.group({
        countryCode: [''],
        phoneNumber: [''],
      }),
      profilePic: [""],
      userType: [""]
    });
    this.medicalUserProfileForm.disable();

    //Giving Access Controls to AdministratorSystemManager & AdministratorGeneral
    if (this.checkAdministrator === "3") {
      this.isAdminSystmMngr = true;
    }
    else {
      this.isAdminSystmMngr = false;
    }

    //Change Pwd
    this.changePasswordForm = this.fb.group({
      "userID": ["", [Validators.required, Validators.email]],
      "oldPassword": ['', [Validators.required, Validators.minLength(8)]],
      "newPassword": ['', [Validators.required, Validators.minLength(8)]]
    })
  }

  //Image Upload in Add Admin User
  fileProgress(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.addAdminGenUserForm.get('profilePic').setValue(file);
        this.previewImg = reader.result
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }
  removeUploadedFile() {
    //let newFileList = Array.from(this.el.nativeElement.files);
    this.addAdminGenUserForm.get('profilePic').setValue(null)
  }
  //Img Upload complete here

  //Image Upload Update Admin Gen User
  fileProgress1(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.adminGeneralUserProfileForm.get('profilePic').setValue(file);//adminGeneralUserProfileForm
        this.previewImg4 = reader.result
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }
  removeUploadedFile1() {
    //let newFileList = Array.from(this.el.nativeElement.files);
    this.adminGeneralUserProfileForm.get('profilePic').setValue(null)
  }
  //Img Upload complete here

  //Image Upload Update Admin Gen User
  fileProgress2(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.medicalUserProfileForm.get('profilePic').setValue(file);
        this.previewImg2 = reader.result
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }
  removeUploadedFile2() {
    let newFileList = Array.from(this.el.nativeElement.files);
    this.medicalUserProfileForm.get('profilePic').setValue(null)
  }
  //Img Upload complete here

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

  checkPasswords(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirmpassword').value) {
      return { invalid: true };
    }
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

  //Fetch Admin Gen Data
  fetchAdminGenralData() {
    let regAdminWithGenUserData = {
      "adminUserID": this.userID
    }
    //Get Admin-data & Admin-general-user-data
    this.loginService.getAdminWithGenUserData(regAdminWithGenUserData, this.signObj.access_token).subscribe(
      (resAdminWithGenUserData) => {
        if (resAdminWithGenUserData.response === 3) {
          this.isViewAdmin = true;
          this.loading = false;
          this.adminTeam = resAdminWithGenUserData.adminusers;
          this.adminTeamData = resAdminWithGenUserData.adminusers;
          this.filteredAdminTeam = resAdminWithGenUserData.adminusers;
          console.log("admin team data : ", this.adminTeam);
        }
        else {
          this.loading = false;
        }
      },
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.openSnackBar1("Please try after sometime...", "");
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

  //Fetch Medical Personnels Data
  fetchMedicalPersonnelsData() {
    let fetchMedPersonUserData = {
      "userID": this.userID,
      "category": "All",
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
    }
    //Get Medical Personnel Data
    this.loginService.getMedicalPersonnelData(fetchMedPersonUserData, this.signObj.access_token).subscribe(
      (resForFetchMedicalPersonnelData) => {
        if (resForFetchMedicalPersonnelData.response === 3) {
          this.loading = false;
          this.medicalPersonnels = resForFetchMedicalPersonnelData.medicalPersonnels;
          this.filteredMedicalPersonnels = resForFetchMedicalPersonnelData.medicalPersonnels;
          console.log("Resp from fetched medical personnels : ", resForFetchMedicalPersonnelData);

          console.log("Medical Personnels data : ", this.medicalPersonnels);
        }
        else {
          this.loading = false;
        }
      },
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        //this.openSnackBar1("Please try after sometime...", "");
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

  //Tab Change Event
  onTabChange(event) {
    console.log("event", event)
    this.isViewAdmin = true;
  }

  findText(term: string) {
    this.adminTeam;
    this.filteredAdminTeam;
    if (!term) {
      this.adminTeam = this.filteredAdminTeam;
    } else {
      this.adminTeam = this.filteredAdminTeam.filter(x =>
        x.firstName.trim().toLowerCase().startsWith(term.trim().toLowerCase())
      );
    }
  }

  findTextOnMedicalPersonnel(term: string) {
    this.medicalPersonnels;
    this.filteredAdminTeam;
    if (!term) {
      this.medicalPersonnels = this.filteredMedicalPersonnels;
    } else {
      this.medicalPersonnels = this.filteredMedicalPersonnels.filter(x =>
        x.profile.userProfile.firstName.trim().toLowerCase().startsWith(term.trim().toLowerCase())
      );
    }
  }

  //Add Admin Gen Data
  addAdminGenUserSubmit() {
    this.isLoading = true;
    let countryCode1 = this.addAdminGenUserForm.get(["checkPhone"]).value;
    var str1 = countryCode1.number;
    str1 = str1.replace(/ +/g, "");
    this.addAdminGenUserForm.patchValue({
      phoneNumber: {
        countryCode: countryCode1.dialCode,
        phoneNumber: str1
      }
    })
    let payLoad = this.addAdminGenUserForm.value;
    delete payLoad.checkPhone
    delete payLoad.confirmpassword;
    delete payLoad.profilePic;
    let formData = new FormData();
    formData.append("adminData", JSON.stringify(payLoad));
    formData.append("profilePic", this.addAdminGenUserForm.get('profilePic').value);
    console.log("Req to add new admin general Data : ", JSON.stringify(payLoad));

    this.loginService.addAdminGenUser(formData, this.signObj.access_token).subscribe(
      (addAdminGenUserRes) => {
        if (addAdminGenUserRes.response === 3) {
          console.log("Res Data Success : ", addAdminGenUserRes);
          this.isLoading = false;
          this.openSnackBar(addAdminGenUserRes.message, "");
          this.loading = false;
          this.modalService.dismissAll();
          this.addAdminGenUserForm.reset();
          this.fetchAdminGenralData();
        }
        else {
          alert(addAdminGenUserRes.message);
          console.log("Res Data Failure : ", addAdminGenUserRes);
          this.isLoading = false;
          this.openSnackBar1(addAdminGenUserRes.message, "");
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

  //Auto Add Admin General User Data
  autoAddAdminGenUserData(hospitalData) {
    this.addAdminGenUserForm.patchValue({
      hospital_reg_num: hospitalData.hospitalInformation.hospital_reg_num,
      adminManagerUserID: hospitalData.hospitalAdmin.userID
    })
  }

  open(content) {
    this.patientService.isEditable.next(false)
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg', backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.addAdminGenUserForm.reset();
      this.addAdminGenUserForm.patchValue({
        profilePic: [""]
      });
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.patientService.isEditable.next(true);
      this.addAdminGenUserForm.reset();
      this.addAdminGenUserForm.patchValue({
        profilePic: [""]
      });
    });
  }

  openViewOne(adminTeam) {
    console.log("Selected Admin User To View Data : ", adminTeam);
    this.adminGeneralUserProfileForm.patchValue({
      userID: adminTeam.userID,
      verificationStatus: adminTeam.verificationStatus,
      identity: adminTeam.identity,
      preferLanguage: adminTeam.preferLanguage,
      hospital_reg_num: adminTeam.hospital_reg_num,
      registerTime: adminTeam.registerTime,
      firstName: adminTeam.firstName,
      lastName: adminTeam.lastName,
      emailID: adminTeam.emailID,
      department: adminTeam.department,
      checkPhone: adminTeam.phoneNumber.phoneNumber,
      phoneNumber: {
        phoneNumber: adminTeam.phoneNumber.phoneNumber,
        countryCode: adminTeam.phoneNumber.countryCode
      }
    });
    if (adminTeam.profilePic === "") {
      this.previewImg1 = "../../../assets/images/ui/Icons/1x/profile-1.png";
    }
    else if (adminTeam.profilePic === "../../../assets/images/ui/Icons/1x/profile-1.png") {
      this.previewImg1 = this.signObj.hospitalAdmin.profilePic;
    }
    else {
      this.previewImg1 = this.baseURL + adminTeam.profilePic;
    }

  }

  openViewTwo(medicalTeam) {
    this.isViewAdmin = false;
    console.log("Selected Medical User To View Data : ", medicalTeam);//medicalUserProfileForm
    this.medicalUserProfileForm.patchValue({
      userID: medicalTeam.profile.userProfile.userID,
      specialization: medicalTeam.profile.userProfile.userType,
      userType: medicalTeam.profile.userProfile.userType,
      hospital_reg_num: medicalTeam.profile.userProfile.hospital_reg_num,
      registerTime: medicalTeam.profile.userProfile.registerTime,
      firstName: medicalTeam.profile.userProfile.firstName,
      lastName: medicalTeam.profile.userProfile.lastName,
      emailID: medicalTeam.profile.userProfile.emailID,
      department: medicalTeam.profile.userProfile.department,
      checkPhone: medicalTeam.profile.userProfile.phoneNumber.phoneNumber,
      phoneNumber: {
        phoneNumber: medicalTeam.profile.userProfile.phoneNumber.phoneNumber,
        countryCode: medicalTeam.profile.userProfile.phoneNumber.countryCode
      }
    });
    if (medicalTeam.profile.userProfile.profilePic === "") {
      this.previewImg2 = "../../../assets/images/ui/Icons/1x/profile-1.png";
    }
    else if (medicalTeam.profile.userProfile.profilePic === "../../../assets/images/ui/Icons/1x/profile-1.png") {
      this.previewImg2 = "../../../assets/images/ui/Icons/1x/profile-1.png";
    }
    else if (medicalTeam.profile.userProfile.profilePic !== "") {
      this.previewImg2 = this.baseURL + medicalTeam.profile.userProfile.profilePic;
    }
    else {
      this.previewImg2 = "../../../assets/images/ui/Icons/1x/profile-1.png";
    }
    //this.openView()
  }

  //update Admin Gen Data
  updateAdminGenUserSubmit() {
    this.isLoading = true;
    let countryCode1 = this.adminGeneralUserProfileForm.get(["checkPhone"]).value;
    var str1 = countryCode1.number;
    str1 = str1.replace(/ +/g, "");
    this.adminGeneralUserProfileForm.patchValue({
      phoneNumber: {
        countryCode: countryCode1.dialCode,
        phoneNumber: str1
      }
    })
    let payLoad = this.adminGeneralUserProfileForm.value;
    console.log("admin person data before alter : ", payLoad);

    delete payLoad.profilePic;
    delete payLoad.checkPhone;
    delete payLoad.verificationStatus;
    delete payLoad.password;
    delete payLoad.registerTime;
    delete payLoad.emailID;
    let formData = new FormData()
    formData.append("adminData", JSON.stringify(payLoad));
    formData.append("profilePic", this.adminGeneralUserProfileForm.get('profilePic').value);
    console.log("the admin general user data to update : ", JSON.stringify(payLoad));
    this.loginService.updateAdminGenUser(formData, this.signObj.access_token).subscribe(
      (updateAdminGenUserRes) => {
        if (updateAdminGenUserRes.response === 3) {
          console.log("res from update admin general user : ", updateAdminGenUserRes);
          this.isLoading = false;
          this.openSnackBar(updateAdminGenUserRes.message, "");
          this.loading = false;
          this.modalService.dismissAll();
          this.fetchAdminGenralData();
        }
        else {
          //alert(updateAdminGenUserRes.message);
          console.log("res from update admin general user : ", updateAdminGenUserRes);
          this.isLoading = false;
          this.openSnackBar1(updateAdminGenUserRes.message, "");
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

  openViewAdminUserMethod(viewAdminUserContent, adminTeam) {
    this.adminGeneralUserProfileFormView.disable();
    console.log("Selected Admin User To View Data : ", adminTeam);
    this.adminGeneralUserProfileFormView.patchValue({
      userID: adminTeam.userID,
      verificationStatus: adminTeam.verificationStatus,
      identity: adminTeam.identity,
      preferLanguage: adminTeam.preferLanguage,
      hospital_reg_num: adminTeam.hospital_reg_num,
      registerTime: adminTeam.registerTime,
      firstName: adminTeam.firstName,
      lastName: adminTeam.lastName,
      emailID: adminTeam.emailID,
      gender: adminTeam.gender,
      department: adminTeam.department,
      checkPhone: adminTeam.phoneNumber.phoneNumber,
      phoneNumber: {
        phoneNumber: adminTeam.phoneNumber.phoneNumber,
        countryCode: adminTeam.phoneNumber.countryCode
      },
      password: "********"
    });
    if (adminTeam.profilePic === "") {
      this.previewImg3 = "../../../assets/images/ui/Icons/1x/profile-1.png";
    }
    else if (adminTeam.profilePic === "../../../assets/images/ui/Icons/1x/profile-1.png") {
      this.previewImg3 = this.signObj.hospitalAdmin.profilePic;
    }
    else {
      this.previewImg3 = this.baseURL + adminTeam.profilePic;
    }


    this.modalService.open(viewAdminUserContent, { centered: true, size: "lg", backdrop: false })
  }
  openEditAdminUserMethod(editAdminUserContent, adminTeam) {

    console.log("Selected Admin User To Edit Data : ", adminTeam);
    this.adminGeneralUserProfileForm.patchValue({
      userID: adminTeam.userID,
      verificationStatus: adminTeam.verificationStatus,
      identity: adminTeam.identity,
      preferLanguage: adminTeam.preferLanguage,
      hospital_reg_num: adminTeam.hospital_reg_num,
      registerTime: adminTeam.registerTime,
      firstName: adminTeam.firstName,
      lastName: adminTeam.lastName,
      emailID: adminTeam.emailID,
      gender: adminTeam.gender,
      department: adminTeam.department,
      checkPhone: adminTeam.phoneNumber.phoneNumber,
      phoneNumber: {
        phoneNumber: adminTeam.phoneNumber.phoneNumber,
        countryCode: adminTeam.phoneNumber.countryCode
      }
    });
    if (adminTeam.profilePic === "") {
      this.previewImg4 = "../../../assets/images/ui/Icons/1x/profile-1.png";
    }
    else if (adminTeam.profilePic === "../../../assets/images/ui/Icons/1x/profile-1.png") {
      this.previewImg4 = this.signObj.hospitalAdmin.profilePic;
    }
    else {
      this.previewImg4 = this.baseURL + adminTeam.profilePic;
    }
    this.modalService.open(editAdminUserContent, { centered: true, size: "lg", backdrop: false })
  }
  //Delete Modal
  openDeleteModal(content1) {
    this.modalService.open(content1, { centered: true, size: "md", backdrop: false })
  }
  deleteProject(clientObj) {
    this.isLoading = true;
    console.log("Admin Gen User Data to delete : ", clientObj)
    let delObj = {
      "adminManagerUserID": this.signObj.hospitalAdmin.emailID,
      "adminUserIDToDelete": clientObj.userID
    }
    console.log("req to del admin gen user : ", delObj);
    this.loginService.deleteAdminGenUser(delObj, this.signObj.access_token).subscribe((deleteAdminGenres) => {
      console.log("delete admin gen data res : ", deleteAdminGenres);
      if (deleteAdminGenres.response === 3) {
        this.isLoading = false
        this.openSnackBar(deleteAdminGenres.message, "");
        this.modalService.dismissAll();
        this.fetchAdminGenralData();
      }
      else {
        this.isLoading = false;
        this.openSnackBar1(deleteAdminGenres.message, "");
        this.modalService.dismissAll();
        //alert(deleteAdminGenres.message);
      }
    }, (err: HttpErrorResponse) => {
      this.isLoading = false;
      this.openSnackBar1("Please try after sometime...", "");
      if (err.error instanceof Error) {
        this.isLoading = false;
        this.loading = false;
        console.log("Client Side Error")
      } else {
        this.isLoading = false
        this.loading = false;
        console.log(err)
      }
    }
    )
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

  open4(content4) {
    this.modalService.open(content4, { ariaLabelledBy: 'modal-basic-title', centered: true, backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.changePasswordForm.reset();
    });
  }
  //Add Change Pwd Data
  changePwdSubmit() {
    this.loginService.changePassword(this.changePasswordForm.value).subscribe(
      (changePwdRes) => {
        if (changePwdRes.response === 3) {
          this.router.navigateByUrl('/adminprofile')
          this.modalService.dismissAll();
          this.changePasswordForm.reset();
          this.openSnackBar(changePwdRes.message, "");
        }
        else {
          this.openSnackBar1(changePwdRes.message, "");
          //alert(changePwdRes.message);
        }
      },
      (err: HttpErrorResponse) => {
        this.isLoading = false;
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

  closeView() {
    this.isViewAdmin = true;
    this.disableUpdateBtn = false;
    this.patientService.isEditable.next(true);
  }

}
