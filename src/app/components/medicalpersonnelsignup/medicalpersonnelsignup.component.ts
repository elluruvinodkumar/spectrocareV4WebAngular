import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar } from '@angular/material';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { MedicalPersonnelService } from 'src/app/services/medical-personnel.service';
import { HttpErrorResponse } from '@angular/common/http';
@Component({
  selector: 'app-medicalpersonnelsignup',
  templateUrl: './medicalpersonnelsignup.component.html',
  styleUrls: ['./medicalpersonnelsignup.component.css']
})
export class MedicalpersonnelsignupComponent implements OnInit {
  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.Taiwan, CountryISO.China, CountryISO.Malaysia];
  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }

  title: string = 'Administrator';
  isAdministrator: boolean = true;
  adminSignUpForm: FormGroup;
  medicalSignUpForm: FormGroup;
  previewImg: any;
  isButton: boolean = false;
  closeResult: string;
  identitys = [
    { value: 'Doctor', viewValue: 'Doctor' },
    { value: 'Nurse', viewValue: 'Nurse' },
    { value: 'Practitioner', viewValue: 'Practitioner' }
  ];

  genders = [
    { value: 'Male', viewValue: 'Male' },
    { value: 'Female', viewValue: 'Female' }
  ];

  departments = [
    { value: 'Pharmacy', viewValue: 'Pharmacy' },
    { value: 'Admissions', viewValue: 'Admissions' },
    { value: 'Cardiology', viewValue: 'Cardiology' }
  ];

  countryCodes = [
    { value: '+91', viewValue: '+91' },
    { value: '+886', viewValue: '+886' },
    { value: '+60', viewValue: '+60' }
  ];
  isLoading: boolean = false;
  viewSuccessContent1: string = "Registration mail has been successfully sent.";
  viewFailureContent1: string = "Registration Failed!";
  viewSuccessContent2: string = " Please check your email.";
  viewFailureContent2: string = "Your password has not been changed.";
  signObj: any;
  hospital_reg_num: any = "AP2317293903";
  @ViewChild('fileInput', { static: true }) el: ElementRef;
  @ViewChild('viewSuccessContent', { static: true }) modalSuccessExample: ElementRef<any>;
  @ViewChild('viewFailureContent', { static: true }) modalFailureExample: ElementRef<any>;

  constructor(private router: Router, private fb: FormBuilder, private loginService: LoginService,
    private medialPersonnelService: MedicalPersonnelService,
    private _snackBar: MatSnackBar, private cd: ChangeDetectorRef, private modalService: NgbModal,) { }

  ngOnInit() {
    var signInRes = localStorage.getItem("SignInRes");
    if (signInRes) {
      this.signObj = JSON.parse(signInRes);
      this.hospital_reg_num = "AP2317293903";
      //this.signObj.hospitalInformation.hospital_reg_num;
      console.log(this.signObj, this.hospital_reg_num);
    }

    this.previewImg = "../../../assets/images/ui/Icons/1x/profile-1.png";
    this.medicalSignUpForm = this.fb.group({
      userID: ['', Validators.required],
      password: ['', Validators.required],
      confirmPassword: ['', Validators.required],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      emailID: ['', [Validators.required, Validators.email]],
      department: ['', Validators.required],
      identity: ['', [Validators.required]],
      userType: ['Doctor'],
      preferLanguage: ['English'],
      hospital_reg_num: [this.hospital_reg_num],
      gender: ['', Validators.required],
      age: ['0'],
      latitude: ['0.0'],
      longitude: ['0.0'],
      checkBox: ['', Validators.required],
      phoneNumber: this.fb.group({
        countryCode: [''],
        phoneNumber: [''],
      }),
      checkPhone: ['', [Validators.required]],
      profilePic: [""]
    },
      {
        validators: this.passwordConfirming
      },
    )
  }
  passwordConfirming(c: AbstractControl) { //: { invalid: boolean }
    if (c.get('password').value !== c.get('confirmPassword').value) {
      c.get('confirmPassword').setErrors({ NoPassswordMatch: true });
      //return { invalid: true };
    }
  }
  //Image Upload
  fileProgress(event: any) {
    let reader = new FileReader(); // HTML5 FileReader API
    let file = event.target.files[0];
    if (event.target.files && event.target.files[0]) {
      reader.readAsDataURL(file);
      // When file uploads set it to file formcontrol
      reader.onload = () => {
        this.medicalSignUpForm.get('profilePic').setValue(file);
        this.previewImg = reader.result
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }
  removeUploadedFile() {
    let newFileList = Array.from(this.el.nativeElement.files);
    this.medicalSignUpForm.get('profilePic').setValue(null)
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
  openSnackBar1(message: string, action: string) {
    this._snackBar.open(message, action, {
      panelClass: ['red-snackbar'],
      duration: 5000,
      verticalPosition: 'bottom', // 'top' | 'bottom'
      horizontalPosition: 'right', //'start' | 'center' | 'end' | 'left' | 'right'
    })
  }

  medicalPersonnelSignUp() {
    this.isLoading = true;
    console.log(this.medicalSignUpForm.value);
    let countryCode = this.medicalSignUpForm.get(["checkPhone"]).value;
    console.log("CountryDetails : ", countryCode);
    var str = countryCode.number;
    str = str.replace(/ +/g, "");

    let formData = new FormData();
    formData.append("userID", this.medicalSignUpForm.value.userID);
    formData.append("password", this.medicalSignUpForm.value.password);
    formData.append("firstName", this.medicalSignUpForm.value.firstName);
    formData.append("lastName", this.medicalSignUpForm.value.lastName);
    formData.append("phoneNumber", str);
    formData.append("phoneNumberCountryCode", countryCode.dialCode);
    formData.append("emailID", this.medicalSignUpForm.value.emailID);
    formData.append("department", this.medicalSignUpForm.value.department);
    formData.append("userType", this.medicalSignUpForm.value.userType);
    formData.append("preferLanguage", this.medicalSignUpForm.value.preferLanguage);
    formData.append("hospital_reg_num", this.medicalSignUpForm.value.hospital_reg_num);
    formData.append("gender", this.medicalSignUpForm.value.gender);
    formData.append("age", this.medicalSignUpForm.value.age);
    formData.append("emergencyPhoneNumber", str);
    formData.append("emergencyPhoneNumberCountryCode", countryCode.dialCode);
    formData.append("emergencyPhoneNumberExtension", "0");
    formData.append("latitude", this.medicalSignUpForm.value.latitude);
    formData.append("longitude", this.medicalSignUpForm.value.longitude);
    formData.append("profilePic", this.medicalSignUpForm.get('profilePic').value);
    this.medialPersonnelService.medicalPersonnelRegister(formData).subscribe((posRes) => {
      console.log("Pos", posRes)
      if (posRes.response === 3) {
        this.isLoading = false;
        this.openSnackBar(posRes.message, "");
        this.modalService.open(this.modalSuccessExample);
        this.router.navigateByUrl('/medicalpersonnel');
      }
      else if (posRes.response === 5) {
        this.isLoading = false;
        this.openSnackBar1(posRes.message, "");
        this.modalService.open(this.modalFailureExample);
        //alert(posRes.message);
      }
      else {
        this.isLoading = false;
        this.openSnackBar1(posRes.message, "");
        this.modalService.open(this.modalFailureExample)
        //alert(posRes.message);
      }
    }, (err: HttpErrorResponse) => {
      if (err.error instanceof Error) {
        this.isLoading = false;
        this.openSnackBar1("Please try another time...", "");
        console.log("Client Side Error : ", err);
      } else {
        this.isLoading = false;
        this.openSnackBar1("Please try another time...", "");
        console.log(err)
      }
    }
    )
  }

  signUp() {
    this.router.navigateByUrl('/medicalpersonnel')
  }
  medicalSignUp() {
    console.log(this.medicalSignUpForm.value);
  }
  callMedicalPersonnel() {
    this.isAdministrator = false;
    this.title = 'Medical Personnel'
  }
  callAdministrator() {
    this.isAdministrator = true;
    this.title = 'Administrator'
  }
  openTerms(content) {
    this.isButton = false;
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'xl', backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openPrivacyPolicy(content1) {
    this.isButton = false;
    this.modalService.open(content1, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'xl', backdrop: false }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;
      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      });
  }
  viewSuccessMethod(viewSuccessContent) {
    this.modalService.open(viewSuccessContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "xl", backdrop: false }).result.then((result) => {
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