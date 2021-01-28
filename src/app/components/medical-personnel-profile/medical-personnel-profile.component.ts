import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormArray } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';
import { ActivatedRoute } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-medical-personnel-profile',
  templateUrl: './medical-personnel-profile.component.html',
  styleUrls: ['./medical-personnel-profile.component.css']
})
export class MedicalPersonnelProfileComponent implements OnInit {
  baseURL: string = "http://34.231.177.197:3000";
  medicalPersonProfileForm: FormGroup;
  signInRes: any;
  signObj: any;
  userID: any;
  loading: boolean;
  medicalPersons: any = [];
  sub: any;
  id: string;
  selectedMedicalPerson: any;
  previewImg: string;
  regTime: string;

  constructor(private fb: FormBuilder, private loginService: LoginService, private activatedRoute: ActivatedRoute) { }

  ngOnInit() {

    this.previewImg = "/assets/images/smile.jpg";
    this.sub = this.activatedRoute.params.subscribe(params => {
      this.id = params['id'];
    })
    this.medicalPersonProfileForm = this.fb.group({
      medical_personnel_id: [""],
      hospital_reg_num: [""],
      emailID: [""],
      department: [""],
      firstName: [""],
      lastName: [""],
      age: [""],
      gender: [""],
      phoneNumber: [""],
      hospitalApprove: [""],
      id_by_govt: [""],
      preferLanguage: [""],
      qualification: [""],
      registerTime: [""],
      specialization: [""],
      userID: [""],
      userType: [""],
      verificationStatus: [""]


    })

    //get All Patients
    this.signInRes = localStorage.getItem("SignInRes");
    if (this.signInRes) {
      this.signObj = JSON.parse(this.signInRes);
      this.userID = localStorage.getItem('userID');

      let medicalObj = {
        "userID": this.userID,
        "category": "All",
        "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
        "token": this.signObj.access_token
      }
      this.getMedicalPatientData(medicalObj)
    }

  }

  get locArray() {
    return <FormArray>this.medicalPersonProfileForm.get('loc')
  }
  getMedicalPatientData(obj) {
    this.loginService.getMedicalPatientData(obj).subscribe(
      (res) => {
        console.log(res)
        if (res.response === 3) {
          this.medicalPersons = res.medicalPersonnels
          console.log("MedicalPersonnels : ", this.medicalPersons);
          let index = -1
          index = this.medicalPersons.findIndex(val => {
            console.log("med_id value : ", val.medical_personnel_id);
            console.log("id value : ", this.id);

            var regTime = new Date(Math.floor((val.registerTime) / 1000) * 1000).toISOString().slice(0, 19).replace('T', ' ');
            console.log(regTime);

            return val.medical_personnel_id == this.id;


          })
          if (index != -1) {
            this.selectedMedicalPerson = this.medicalPersons[index]
          }
          this.autoAddFields(this.selectedMedicalPerson)
        }
        else if (res.response === 0) {
          this.loading = false;
          alert(res.message)
        }
      },
      (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          console.log("Client Side Error")
        } else {
          console.log(err)
        }
      })
  }

  autoAddFields(medicalPersons) {
    var regTime = new Date(Math.floor((medicalPersons.registerTime) / 1000) * 1000).toISOString().slice(0, 19).replace('T', ' ');
    console.log("reg time in patch : ", regTime);
    this.medicalPersonProfileForm.patchValue({

      medical_personnel_id: medicalPersons.medical_personnel_id,
      firstName: medicalPersons.firstName,
      lastName: medicalPersons.lastName,
      department: medicalPersons.department,
      userID: medicalPersons.userID,
      gender: medicalPersons.gender,
      phoneNumber: medicalPersons.phoneNumber.phoneNumber,
      address: medicalPersons.address,
      hospital_reg_num: medicalPersons.hospital_reg_num,
      state: medicalPersons.state,
      emailID: medicalPersons.emailID,
      age: medicalPersons.age,
      postalCode: medicalPersons.postalCode,
      country: medicalPersons.country,
      hospitalApprove: medicalPersons.hospitalApprove,
      id_by_govt: medicalPersons.id_by_govt,
      preferLanguage: medicalPersons.preferLanguage,
      qualification: medicalPersons.qualification,
      registerTime: regTime,
      specialization: medicalPersons.specialization,
      userType: medicalPersons.userType,
      verificationStatus: medicalPersons.verificationStatus,
      loc: medicalPersons.loc
    })
    this.previewImg = this.baseURL + medicalPersons.profilePic
    // for(let i:number = 0; i>=medicalPersons.loc.length; i++){
    //   this.locArray.push(medicalPersons.loc[0])
    // }
    console.log("MedicalPerson Full Details", this.medicalPersonProfileForm.value)
  }

  updateMedicalPerson() {

  }



}
