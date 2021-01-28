import { Component, OnInit, ElementRef, ViewChild, ChangeDetectorRef, TemplateRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { HttpErrorResponse } from '@angular/common/http';
import { MatSnackBar } from '@angular/material';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-patient-reset-password',
  templateUrl: './patient-reset-password.component.html',
  styleUrls: ['./patient-reset-password.component.css']
})
export class PatientResetPasswordComponent implements OnInit {
  sub: any;
  id: string;
  isPasswordOne: boolean = true;
  isPasswordTwo: boolean = true;
  password1: string = "password";
  password2: string = "password";
  signObj: any;
  closeResult: string;
  isLoading: boolean = false;
  changePatientPasswordForm: FormGroup;
  successResponse: string;
  failureResponse: string;
  viewSuccessContent1: string = "Password Reset Successful!";
  viewFailureContent1: string = "Password Reset Failed!";
  viewSuccessContent2: string = "Your password has been changes successfully.";
  viewFailureContent2: string = "Your password has not been changed.";
  @ViewChild('viewSuccessContent', { static: true }) modalSuccessExample: ElementRef<any>;
  @ViewChild('viewFailureContent', { static: true }) modalFailureExample: ElementRef<any>;
  constructor(private activatedRoute: ActivatedRoute, private fb: FormBuilder,
    private _snackBar: MatSnackBar, private loginService: LoginService,
    private modalService: NgbModal,) { }

  ngOnInit() {
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
      //this.loginService.id = this.id;
      console.log("id from url : ", this.id);
      //console.log("id from login service : ", this.loginService);
    })

    var signInRes = localStorage.getItem("SignInRes");
    if (signInRes) {
      this.signObj = JSON.parse(signInRes);
    }

    this.changePatientPasswordForm = this.fb.group({
      "userID": this.id,
      "password": ['', [Validators.required, Validators.minLength(8)]],
      "newPassword": ['', Validators.required],
    }
      , {
        validators: this.checkPasswords
      }
    )
  }

  checkPasswords(c: AbstractControl): { invalid: boolean } {
    if (c.get('password').value !== c.get('newPassword').value) {
      return { invalid: true };
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

  changePatientPwdSubmit() {
    this.isLoading = true;
    //console.log(this.signObj.access_token);
    console.log("Change Pwd Req Form Data: ", this.changePatientPasswordForm.value);

    let payLoad = this.changePatientPasswordForm.value;
    delete payLoad.newPassword;
    console.log("req data : ", payLoad);

    this.loginService.changePatientPassword(payLoad).subscribe(
      (changePwdRes) => {
        console.log("Change Pwd Response : ", changePwdRes);

        if (changePwdRes.response === 3) {
          //this.changePatientPasswordForm.reset();
          this.isLoading = false;
          this.successResponse = changePwdRes.message;
          this.modalService.open(this.modalSuccessExample)
          //this.openSnackBar(changePwdRes.message, "");
        }
        else {
          this.isLoading = false;
          this.failureResponse = changePwdRes.message;
          this.modalService.open(this.modalFailureExample)
          //this.openSnackBar(changePwdRes.message, "");
        }
      },
      (err: HttpErrorResponse) => {
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

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
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

}
