import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-admin-verify-account',
  templateUrl: './admin-verify-account.component.html',
  styleUrls: ['./admin-verify-account.component.css']
})
export class AdminVerifyAccountComponent implements OnInit {
  sub: any;
  id: string;
  isPasswordOne: boolean = true;
  isPasswordTwo: boolean = true;
  password1: string = "password";
  password2: string = "password";
  signObj: any;
  closeResult: string;
  isLoading: boolean = false;
  success: boolean = false;
  failure: boolean = false;
  adminAccountVerificationForm: FormGroup;
  successResponse: string;
  failureResponse: string;
  queryObj: any = {};
  urlLink: string;
  viewSuccessContent1: string = "Account Verification Done!";
  viewFailureContent1: string = "Account Verification Failed!";
  viewSuccessContent2: string = "Your password has been changes successfully.";
  viewFailureContent2: string = "Your password has not been changed.";
  @ViewChild('viewSuccessContent', { static: true }) modalSuccessExample: ElementRef<any>;
  @ViewChild('viewFailureContent', { static: true }) modalFailureExample: ElementRef<any>;

  constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder,
    private _snackBar: MatSnackBar, private loginService: LoginService,
    private modalService: NgbModal, private router: Router,) { }

  ngOnInit() {
    this.sub = this.activatedRoute.queryParamMap.subscribe(params => {
      this.queryObj = { ...params.keys, ...params }
    })
    var signInRes = localStorage.getItem("SignInRes");
    if (signInRes) {
      this.signObj = JSON.parse(signInRes);
    }
    this.id = this.queryObj.params && this.queryObj.params.userID ? this.queryObj.params.userID : "";
    console.log("value of userID : ", this.id);
    this.urlLink = "http://spectrocare.vedaslabs.com/#/admin/verifyaccount?userID=" + this.id;
    this.adminAccountVerificationForm = this.fb.group({
      "userID": [""],
    }
    );

    this.submit();
  }
  submit() {
    if (this.id != "") {
      //this.isLoading = true;
      this.adminAccountVerificationForm.get('userID').setValue(this.id)
      let payLoad = this.adminAccountVerificationForm.value;
      delete payLoad.newPassword;
      console.log("admin account verify Req Data: ", this.adminAccountVerificationForm.value);

      this.loginService.adminAccoutVerification(payLoad).subscribe(
        (ResetPwdRes) => {
          console.log("admin verify Response : ", ResetPwdRes);

          if (ResetPwdRes.response === 3) {
            this.isLoading = true;
            this.success = true;
            this.successResponse = ResetPwdRes.message;
          }
          else {
            this.isLoading = true;
            this.failure = true;
            this.failureResponse = ResetPwdRes.message;
          }
        },
        (err: HttpErrorResponse) => {

          this.openSnackBar1("Please try after sometime...", "");
          if (err.error instanceof Error) {
            //this.loading = false;
            this.isLoading = false;
            console.log("Client Side Error", err);

          } else {
            //this.loading = false;
            this.isLoading = false;
            console.log("Server Side", err)
          }
        }
      );
    } else {
      alert("User ID not given")
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

}

