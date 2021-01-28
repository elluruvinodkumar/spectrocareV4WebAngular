import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';

import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-adminsignin',
  templateUrl: './adminsignin.component.html',
  styleUrls: ['./adminsignin.component.css']
})
export class AdminsigninComponent implements OnInit {
  title: string = 'Administrator';
  isAdministrator: boolean = true;
  adminSignINForm: FormGroup;
  medicalSignINForm: FormGroup;
  password: string = "password";
  isPassword: boolean = true;
  loading:boolean;

  constructor(private router: Router, private fb: FormBuilder, private loginService: LoginService) { }

  ngOnInit() {
    this.adminSignINForm = this.fb.group({
      "userID": ["", [Validators.required]],
      "password": ['', [Validators.required, Validators.minLength(8)]]
    })
    this.medicalSignINForm = this.fb.group({
      email: ["", Validators.required],
      password: ['', Validators.required]
    })
  }

  // validation error messages to display on web pages
  validationMessageErrors = {
    'userID': {
      'required': "Email / UserID is required",
      //'email': "Enter a valid email / UserID"
    },
    'password': {
      'required': "Password is required",
      'minlength': "Password should contain atleast 8 letters"
    },
  }

  //To store the Error Messages
  validationErrors = {
    'userID': "",
    'password': "",
  }
  validationForm(group: FormGroup = this.adminSignINForm) {
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
    console.log("Admin SignIn Req Data : ",this.adminSignINForm.value)
    this.loading = true;
    this.loginService.adminLogin(this.adminSignINForm.value).subscribe((res) => {
      console.log("SignIn Res", res)
      if (res.response === 3) {
        localStorage.setItem("userID", this.adminSignINForm.value.userID);
        localStorage.setItem("SignInRes", JSON.stringify(res));
        this.router.navigateByUrl('/admincenter/home');

        if(res.hospitalAdmin.identity === "Administrator System Manager"){
          localStorage.setItem("AdministratorSystemManager","3");
        }
        else{
          localStorage.setItem("AdministratorSystemManager","0");
        }

      } 
      else if(res.response === 0){
        this.loading = false;
        alert("No account associated with this user ID");
      }
      else {
        alert("Your Details didn't Match")
      }
    }, (err) => {
      console.log(err)
    })
  }

  medicalSubmit() {
    console.log(this.medicalSignINForm.value)
  }

  callMedicalPersonnel() {
    this.isAdministrator = false;
    this.title = 'Medical Personnel'
  }

  callAdministrator() {
    this.isAdministrator = true;
    this.title = 'Administrator';
  }

  signUp() {
    if (this.isAdministrator === true) {
      this.router.navigateByUrl('/adminsignup');
    } else {
      this.router.navigateByUrl('/medicalpersonnelsignup')
    }
  }

  forgot() {
    this.router.navigateByUrl('/forgot');
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

}
