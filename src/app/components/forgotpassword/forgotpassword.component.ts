import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar } from '@angular/material';
import { HttpErrorResponse } from '@angular/common/http';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.css']
})
export class ForgotpasswordComponent implements OnInit {

  isLoading: boolean = false;
  closeResult: string;
  title: string = 'Administrator';
  isAdministrator: boolean = true;
  adminForgotForm: FormGroup;
  medicalForgotForm: FormGroup;
  successResponse: string = "Success";
  failureResponse: string = "Failure";
  viewSuccessContent1: string = "Password reset link has been successfully sent.";
  viewFailureContent1: string = "Password Reset Failed!";
  viewSuccessContent2: string = " Please check your email.";
  viewFailureContent2: string = "Your password has not been changed.";
  @ViewChild('viewSuccessContent', { static: true }) modalSuccessExample: ElementRef<any>;
  @ViewChild('viewFailureContent', { static: true }) modalFailureExample: ElementRef<any>;

  constructor(private router: Router, private fb: FormBuilder, private loginService: LoginService,
    private modalService: NgbModal, private _snackBar: MatSnackBar) { }

  ngOnInit() {
    this.adminForgotForm = this.fb.group({
      "userID": ["", [Validators.required]]
    })
    this.adminForgotForm.markAsTouched();
    this.medicalForgotForm = this.fb.group({
      email: ["", Validators.required]
    })

  }

  //Mat Snack Bar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      panelClass: ['theme-snackbar'],
      duration: 5000,
      verticalPosition: "bottom", // 'top' | 'bottom'
      horizontalPosition: "right", //'start' | 'center' | 'end' | 'left' | 'right'
    });
  }

  //Mat Snack Bar
  openSnackBar1(message: string, action: string) {
    this._snackBar.open(message, action, {
      panelClass: ['red-snackbar'],
      duration: 5000,
      verticalPosition: "bottom", // 'top' | 'bottom'
      horizontalPosition: "right", //'start' | 'center' | 'end' | 'left' | 'right'
    });
  }

  // validation error messages to display on web pages
  validationMessageErrors = {
    'userID': {
      'required': "Email / UserID is required",
    }
  }
  //To store the Error Messages
  validationErrors = {
    'userID': ""
  }

  validationForm(group: FormGroup = this.adminForgotForm) {
    Object.keys(group.controls).forEach((key: string) => {
      const abstractControl = group.get(key);
      this.validationErrors[key] = '';
      if (abstractControl && !abstractControl.valid &&
        (abstractControl.touched || abstractControl.dirty)) {
        const message = this.validationMessageErrors[key];
        for (const errorKey in abstractControl.errors) {
          this.validationErrors[key] += message[errorKey] + '';
        }
      }
      if (abstractControl instanceof FormGroup) {
        this.validationForm(abstractControl);
      }
    })
  }

  submitForm() {
    this.isLoading = true;
    let userID = this.adminForgotForm.value.userID.trim();
    let obj = {
      userID
    }
    console.log(" sended data to forgot pwd : ", obj)
    this.loginService.forgotPassword(obj).subscribe((res) => {
      console.log(res)
      if (res.response === 3) {
        this.isLoading = false;
        this.modalService.open(this.modalSuccessExample)
        //alert("Password reset link has been sent to your registered email ID");
        this.openSnackBar(res.message, "");
        this.router.navigateByUrl('/administrator')
      } else {
        this.isLoading = false;
        this.modalService.open(this.modalFailureExample)
        this.openSnackBar1(res.message, "");
        //alert("Your Details didn't Match")
      }
    },
      (err: HttpErrorResponse) => {
        this.isLoading = false;
        this.openSnackBar1("Please try after sometime...", "");
        if (err.error instanceof Error) {
          console.log("Client Side Error")
        } else {
          console.log(err)
        }
      }
    )
  }
  medicalSubmit() {
    console.log(this.medicalForgotForm.value)
  }
  callMedicalPersonnel() {
    this.isAdministrator = false;
    this.title = 'Medical Personnel'
  }
  callAdministrator() {
    this.isAdministrator = true;
    this.title = 'Administrator'
  }
  signUp() {
    if (this.isAdministrator === true) {
      this.router.navigateByUrl('/adminsignup');
    } else {
      this.router.navigateByUrl('/medicalpersonnelsignup')
    }
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
}
