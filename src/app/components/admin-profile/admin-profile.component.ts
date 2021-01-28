import { Component, OnInit, ViewChild, ElementRef, ChangeDetectorRef } from '@angular/core';
import { FormGroup, FormBuilder, Validators, AbstractControl, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { LoginService } from 'src/app/services/login.service';
import { HttpErrorResponse, HttpClient } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MatSnackBar, MatSnackBarConfig } from '@angular/material';
import { SearchCountryField, TooltipLabel, CountryISO } from 'ngx-intl-tel-input';
import { PatientService } from 'src/app/services/patient.service';

@Component({
  selector: 'app-admin-profile',
  templateUrl: './admin-profile.component.html',
  styleUrls: ['./admin-profile.component.css']
})
export class AdminProfileComponent implements OnInit {

  baseURL: string = "http://34.231.177.197:3000";
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

  checkCountryData: any;
  adminProfileForm: FormGroup;
  changePasswordForm: FormGroup;
  signObj: any;
  loading: boolean;
  checkAdministrator: string;
  isAdminSystmMngr: boolean;
  closeResult: string;
  userID: string;
  isPassword: boolean = true;
  isPasswordOne: boolean = true;
  isPasswordTwo: boolean = true;
  isPasswordThree: boolean = true;
  password: string = "password";
  password1: string = "password";
  password2: string = "password";
  password3: string = "password";
  disableUpdateBtn: boolean = false;
  previewImg: any;
  isLoading: boolean = false;
  isLoading1: boolean = false;
  titleArray: any =
    {
      title: "Dashboard",
      subTitle: "Profile",
      img: "assets/images/ui/Icons/1x/dashboard.png"
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
    { value: 'Administrative', viewValue: 'Administrative' }
  ];
  blackColor: any = "black";
  isValue: any;
  changeColor: boolean = false;
  @ViewChild('autoFocusTest', { static: false }) nativeEl: ElementRef;

  @ViewChild('fileInput', { static: true }) el: ElementRef;
  @ViewChild('myInput', { static: true }) countryInput: ElementRef;

  // @ViewChild( NgxIntlTelInputComponent , {static: false }) telInput

  constructor(private router: Router, private fb: FormBuilder, private loginService: LoginService,
    private modalService: NgbModal, private _snackBar: MatSnackBar,
    private cd: ChangeDetectorRef, private http: HttpClient, private patientService: PatientService) {

  }

  ngOnInit() {
    console.log("My input", this.countryInput);
    this.patientService.isEditable.next(true)

    this.previewImg = "../../../assets/images/ui/Icons/1x/profile-1.png";
    this.checkAdministrator = localStorage.getItem("AdministratorSystemManager");

    var signInRes = localStorage.getItem("SignInRes");
    if (signInRes) {
      this.signObj = JSON.parse(signInRes);
      this.userID = localStorage.getItem('userID');
      console.log(this.signObj);
    }

    this.adminProfileForm = this.fb.group({
      userID: [""],
      verificationStatus: [""],
      identity: [""],
      preferLanguage: [""],
      hospital_reg_num: [""],
      password: [""],
      firstName: [""],
      lastName: [""],
      emailID: [""],
      gender: [""],
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

    //Giving Access Controls to AdministratorSystemManager & AdministratorGeneral
    if (this.checkAdministrator === "3") {
      this.isAdminSystmMngr = true;

    }
    else {
      this.isAdminSystmMngr = false;
      this.adminProfileForm.disable()
    }

    //Change Pwd
    this.changePasswordForm = this.fb.group({
      "userID": this.signObj.hospitalAdmin.userID,
      "oldPassword": ['', [Validators.required, Validators.minLength(8)]],
      "newPassword": ['', [Validators.required, Validators.minLength(8)]],
      "confirmpassword": ['', Validators.required],
    },
      {
        validators: this.checkPasswords
      });
    this.changePasswordForm.markAsTouched();

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
    let newFileList = Array.from(this.el.nativeElement.files);
    this.adminProfileForm.get('profilePic').setValue(null)
  }
  //Img Upload complete here

  checkPasswords(c: AbstractControl): { invalid: boolean } {
    if (c.get('newPassword').value !== c.get('confirmpassword').value) {
      return { invalid: true };
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
      userID: this.signObj.hospitalAdmin.userID,
      verificationStatus: this.signObj.hospitalAdmin.verificationStatus,
      identity: this.signObj.hospitalAdmin.identity,
      preferLanguage: this.signObj.hospitalAdmin.preferLanguage || 'English',
      hospital_reg_num: this.signObj.hospitalAdmin.hospital_reg_num,
      password: this.signObj.hospitalAdmin.password,
      firstName: this.signObj.hospitalAdmin.firstName,
      lastName: this.signObj.hospitalAdmin.lastName,
      gender: this.signObj.hospitalAdmin.gender,
      emailID: this.signObj.hospitalAdmin.emailID,
      department: this.signObj.hospitalAdmin.department,
      checkPhone: this.signObj.hospitalAdmin.phoneNumber.phoneNumber,
    })

    if (this.signObj.hospitalAdmin.profilePic === "") {
      //http://3.92.226.247:3000/Email-Template-Data/profile-1.png
      this.previewImg = "../../../assets/images/ui/Icons/1x/profile-1.png";
    }
    else if (this.signObj.hospitalAdmin.profilePic === "../../../assets/images/ui/Icons/1x/profile-1.png") {
      this.previewImg = this.signObj.hospitalAdmin.profilePic;
    }
    else {
      this.previewImg = this.baseURL + this.signObj.hospitalAdmin.profilePic;//"http://3.92.226.247:3000"+
      this.http.get(this.previewImg, { responseType: "blob" }).subscribe((file) => {
        let imgFile = new File([file], "userimg.jpg");
        this.adminProfileForm.get('profilePic').setValue(imgFile)
      })
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
    //delete payLoad.identity;
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
          this.signObj.hospitalAdmin.preferLanguage = payLoad.preferLanguage;
          this.signObj.hospitalAdmin.department = payLoad.department;
          this.loginService.isProfileUpdated.next(this.baseURL + updateAdminGenUserData.profilePic)
          this.signObj.hospitalAdmin.profilePic = updateAdminGenUserData.profilePic;//"http://3.92.226.247:3000"+

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
          this.openSnackBar1(updateAdminGenUserData.message, "");
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  open(content) {
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', centered: true, backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.changePasswordForm.reset();
    });
  }

  //Add Change Pwd Data
  changePwdSubmit() {
    this.isLoading1 = true;
    //console.log(this.signObj.access_token);
    console.log("Change Pwd Req : ", this.changePasswordForm.value);

    let payLoad = this.changePasswordForm.value
    delete payLoad.confirmpassword
    console.log("payload", payLoad)

    this.loginService.changePassword(this.changePasswordForm.value).subscribe(
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

  showPassword() {
    if (this.isPassword === true) {
      this.password = "text";
      this.isPassword = false;
    } else {
      this.password = "password"
      this.isPassword = true;
    }
  }
  showPassword1() {
    if (this.isPasswordOne === true) {
      this.password1 = "text";
      this.isPasswordOne = false;
    } else {
      this.password1 = "password"
      this.isPasswordOne = true;
    }
  }
  showPassword2() {
    if (this.isPasswordTwo === true) {
      this.password2 = "text";
      this.isPasswordTwo = false;
    } else {
      this.password2 = "password"
      this.isPasswordTwo = true;
    }
  }
  showPassword3() {
    if (this.isPasswordThree === true) {
      this.password3 = "text";
      this.isPasswordThree = false;
    } else {
      this.password3 = "password"
      this.isPasswordThree = true;
    }
  }


  openUpdate() {

    if (this.disableUpdateBtn === false) {
      this.changeColor = true;
      this.disableUpdateBtn = true;
      this.adminProfileForm.enable();
      this.patientService.isEditable.next(false)
      this.nativeEl.nativeElement.focus()
    }
    else {
      this.changeColor = false;
      this.disableUpdateBtn = false;
      this.adminProfileForm.disable();
      this.patientService.isEditable.next(true)
    }
  }

  //Signout Modal
  openSignOut(content1) {
    this.modalService.open(content1, { centered: true, size: "sm", backdrop: false })
  }
  SignOut() {
    console.log("SignOut Called")
    localStorage.clear()
    this.router.navigateByUrl('/administrator')
    this.modalService.dismissAll()
    //this.openSnackBar(resForCancelAppointment.message,"");
  }
}
