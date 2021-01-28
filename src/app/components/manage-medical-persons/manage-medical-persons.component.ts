import { Component, OnInit } from '@angular/core';
import { LoginService } from 'src/app/services/login.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-manage-medical-persons',
  templateUrl: './manage-medical-persons.component.html',
  styleUrls: ['./manage-medical-persons.component.css']
})
export class ManageMedicalPersonsComponent implements OnInit {
  signInRes: any;
  signObj: any;
  userID: string;
  medicalPersonnels: any = [];
  filteredData: any = [];
  loading:boolean;
  isAdminSystmMngr:boolean;

  constructor(private loginService: LoginService) { }

  ngOnInit() {

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
      this.loading = true;
    this.loginService.getMedicalPatientData(medicalObj).subscribe(
      (res) => {
        console.log(res)
        if (res.response === 3) {
          this.loading= false;
          this.isAdminSystmMngr = true;
          this.medicalPersonnels = res.medicalPersonnels
          this.filteredData = res.medicalPersonnels
          console.log("med pers data :", this.medicalPersonnels);
        }
        else{
          this.isAdminSystmMngr = false;
        }
      }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.loading= false;
          console.log("Client Side Error")
        } else {
          this.loading= false;
          console.log(err)
        }
      });
  }

}

search(term: string) {
  if(!term) {
    this.filteredData = this.medicalPersonnels;
  } else {
    this.filteredData = this.medicalPersonnels.filter(x => 
       x.firstName.trim().toLowerCase().includes(term.trim().toLowerCase())
    );
  }
}

}