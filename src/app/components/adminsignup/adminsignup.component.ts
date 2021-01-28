import { Component, OnInit, ChangeDetectorRef, ElementRef, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';

import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { element } from 'protractor';

@Component({
  selector: 'app-adminsignup',
  templateUrl: './adminsignup.component.html',
  styleUrls: ['./adminsignup.component.css']
})
export class AdminsignupComponent implements OnInit {

  separateDialCode = true;
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.India, CountryISO.UnitedStates, CountryISO.UnitedKingdom, CountryISO.Taiwan, CountryISO.China, CountryISO.Malaysia];
  changePreferredCountries() {
    this.preferredCountries = [CountryISO.India, CountryISO.Canada];
  }

  closeResult: string;
  title: string = 'Administrator';
  isAdministrator: boolean = true;
  adminSignUpForm: FormGroup;
  previewImg: any;
  url: any;
  password: string = "password";
  password1: string = "password";
  isPassword: boolean = true;
  isPasswordOne: boolean = true;
  isLoading: boolean = false;
  isButton: boolean = false;

  gender = [
    { value: 'Male', viewValue: 'Male' },
    { value: 'Female', viewValue: 'Female' }
  ];

  departments = [
    { value: 'Administrative', viewValue: 'Administrative' },
    { value: 'Reception', viewValue: 'Reception' },
    { value: 'Pharmacy', viewValue: 'Pharmacy' },
    { value: 'Admissions', viewValue: 'Admissions' },
    { value: 'Cardiology', viewValue: 'Cardiology' }
  ];

  viewSuccessContent1: string = "Registration mail has been successfully sent.";
  viewFailureContent1: string = "Registration Failed!";
  viewSuccessContent2: string = " Please check your email.";
  viewFailureContent2: string = "Your password has not been changed.";
  @ViewChild('fileInput', { static: true }) el: ElementRef;
  @ViewChild('viewSuccessContent', { static: true }) modalSuccessExample: ElementRef<any>;
  @ViewChild('viewFailureContent', { static: true }) modalFailureExample: ElementRef<any>;
  // @ViewChild('phoneCode',{static:true}) phoneCodeElement:ElementRef;
  // @ViewChild('container-fluid',{static:true}) scrollElement:ElementRef;
  constructor(private router: Router, private fb: FormBuilder, private loginService: LoginService,
    private _snackBar: MatSnackBar,
    private modalService: NgbModal, private cd: ChangeDetectorRef, private http: HttpClient) { }

  ngOnInit() {
    this.adminSignUpForm = this.fb.group({
      hospitalInformation: this.fb.group({
        hospital_reg_num: ['', [Validators.required]],
        hospitalName: ['', [Validators.required]],
        emailID: ['', [Validators.required, Validators.email]],
        address: ['', [Validators.required]],
        city: ['', [Validators.required]],
        state: ['', [Validators.required]],
        country: ['', [Validators.required]],
        postCode: ['', [Validators.required]],
        latitude: ['0.0'],
        longitude: ['0.0'],
        phoneNumber: this.fb.group({
          countryCode: [''],
          phoneNumber: [''],
        }),
        checkPhone: ['', [Validators.required]],
        isChecked: ['']
      }),
      hospitalAdmin: this.fb.group({
        userID: ['', [Validators.required]],//,Validators.minLength(4),Validators.maxLength(8)
        gender: ['', Validators.required],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', [Validators.required]],
        firstName: ['', [Validators.required]],
        lastName: ['', [Validators.required]],
        phoneNumber: this.fb.group({
          countryCode: [''],
          phoneNumber: [''],
        }),
        checkPhone: ['', [Validators.required]],
        emailID: ['', [Validators.required, Validators.email]],
        preferLanguage: ['English'],
        department: ['', [Validators.required]],
        identity: ['', [Validators.required]]
      }, {
        validators: this.passwordConfirming
      }
      ),
      profilePic: [""],
    })
    this.previewImg = "../../../assets/images/ui/Icons/1x/profile-1.png";
    this.getCurrentLocation()
    this.setImg()
  }

  setImg() {
    this.url = "http://3.92.226.247:3000/Email-Template-Data/profile-1.png"
    this.http.get(this.url, { responseType: "blob" }).subscribe((file) => {
      let imgFile = new File([file], "userimg.jpg")
      this.adminSignUpForm.get('profilePic').setValue(imgFile)
    })
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

  showPasswordOne() {
    if (this.isPasswordOne === true) {
      this.password1 = "text";
      this.isPasswordOne = false;
    } else {
      this.password1 = "password"
      this.isPasswordOne = true;
    }
  }

  passwordConfirming(c: AbstractControl) { //: { invalid: boolean }
    if (c.get('password').value !== c.get('confirmPassword').value) {
      c.get('confirmPassword').setErrors({ NoPassswordMatch: true });
      //return { invalid: true };
    }
  }

  checkPasswords(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('confirmPassword').value) {
      return { invalid: true };
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
        this.adminSignUpForm.get('profilePic').setValue(file);
        this.previewImg = reader.result
      }
      // ChangeDetectorRef since file is loading outside the zone
      this.cd.markForCheck();
    }
  }

  removeUploadedFile() {
    let newFileList = Array.from(this.el.nativeElement.files);
    this.adminSignUpForm.get('profilePic').setValue(null)
  }
  //Img Upload complete here

  //For getting current location
  getCurrentLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        console.log("Position", position);

        this.adminSignUpForm.patchValue({
          hospitalInformation: {
            latitude: "" + position.coords.latitude.toFixed(4),
            longitude: "" + position.coords.longitude.toFixed(4),
          }
        })
      });
    } else {
      alert("Geolocation is not supported by this browser.");
    }
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

  hideButton() {
    this.isButton = true;
  }
  adminSignUp() {
    // this.hideButton();
    this.isLoading = true;
    let countryCode1 = this.adminSignUpForm.get(["hospitalInformation", "checkPhone"]).value;
    console.log("CountryDetails 1 :", countryCode1);
    var str1 = countryCode1.number;
    str1 = str1.replace(/ +/g, "");
    this.adminSignUpForm.patchValue({
      hospitalInformation: {
        phoneNumber: {
          countryCode: countryCode1.dialCode,
          phoneNumber: str1
        }
      }
    })
    let countryCode = this.adminSignUpForm.get(["hospitalAdmin", "checkPhone"]).value;
    console.log("CountryDetails : ", countryCode);
    var str = countryCode.number;
    str = str.replace(/ +/g, "");
    this.adminSignUpForm.patchValue({
      hospitalAdmin: {
        phoneNumber: {
          countryCode: countryCode.dialCode,
          phoneNumber: str
        }
      }
    })
    console.log(this.adminSignUpForm.value);
    let payLoad = this.adminSignUpForm.value
    delete payLoad.hospitalAdmin.checkPhone
    delete payLoad.hospitalInformation.checkPhone
    //delete payLoad.hospitalAdmin.gender;
    delete payLoad.profilePic;
    delete payLoad.hospitalAdmin.confirmPassword;
    delete payLoad.hospitalInformation.isChecked;
    console.log("Admin Signup Req Data After payload : ", payLoad)
    let formData = new FormData()
    formData.append("hospitalData", JSON.stringify(payLoad));
    formData.append("profilePic", this.adminSignUpForm.get('profilePic').value)
    console.log("Form Data : " + formData);
    this.loginService.adminRegister(formData).subscribe((posRes) => {
      console.log("Pos", posRes)
      if (posRes.response === 3) {
        this.isLoading = false;
        this.openSnackBar(posRes.message, "");
        this.modalService.open(this.modalSuccessExample)
        //openSuccessResponse(successResponse)
        //alert(posRes.message)
        this.router.navigateByUrl('/administrator')
      }
      else if (posRes.response === 5) {
        this.isLoading = false;
        this.openSnackBar1(posRes.message, "");
        this.modalService.open(this.modalFailureExample)
        //alert(posRes.message);
      }
      else {
        this.isLoading = false;
        this.openSnackBar1(posRes.message, "");
        this.modalService.open(this.modalFailureExample)
        //alert(posRes.message)
      }
    },
      (err: HttpErrorResponse) => {
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
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
    this.modalService.open(viewSuccessContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md" }).result.then((result) => {
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

  signUp() {
    this.router.navigateByUrl('/administrator')
  }
  termsandconditions() {
    this.router.navigateByUrl('/termsandconditions');
  }
  privacypolicy() {
    this.router.navigateByUrl('/privacypolicy');
  }
  callMedicalPersonnel() {
    this.isAdministrator = false;
    this.title = 'Medical Personnel'
  }
  callAdministrator() {
    this.isAdministrator = true;
    this.title = 'Administrator'
  }

  changeBtn() {
    this.isButton = true
  }
}