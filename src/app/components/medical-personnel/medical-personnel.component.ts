import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { MedicalPersonnelService } from 'src/app/services/medical-personnel.service';

@Component({
  selector: 'app-medical-personnel',
  templateUrl: './medical-personnel.component.html',
  styleUrls: ['./medical-personnel.component.css']
})
export class MedicalPersonnelComponent implements OnInit {

  adminSignINForm: FormGroup;
  password: string = "password";
  isPassword: boolean = true;

  constructor(private router: Router, private fb: FormBuilder, private loginService: LoginService,
    private medicalPersonService: MedicalPersonnelService) { }

  ngOnInit() {
    this.adminSignINForm = this.fb.group({
      "userID": ["", [Validators.required]],
      "password": ['', [Validators.required, Validators.minLength(8)]]
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
    console.log("MedicalPErsonnel SignIn Req Data : ", this.adminSignINForm.value)

    this.medicalPersonService.medicalPersonnelLogin(this.adminSignINForm.value).subscribe((res) => {
      console.log("SignIn Res", res)
      if (res.response === 3) {
        localStorage.setItem("userID", this.adminSignINForm.value.userID);
        localStorage.setItem("medicalPersonnelID", res.medicalPersonnel.profile.userProfile.medical_personnel_id);
        localStorage.setItem("SignInRes", JSON.stringify(res));
        this.router.navigateByUrl('/medicalpersonnelmodule/dashboard');

        // if (res.hospitalAdmin.identity === "Administrator System Manager") {
        //   localStorage.setItem("AdministratorSystemManager", "3");
        // }
        // else {
        //   localStorage.setItem("AdministratorSystemManager", "0");
        // }

      }
      else if (res.response === 0) {

        alert("No account associated with this user ID");
      }
      else {
        alert("Your Details didn't Match")
      }
    }, (err) => {
      console.log(err)
    })
  }

  signUp() {

    this.router.navigateByUrl('/medicalpersonnelsignup');

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
