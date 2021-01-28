import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { LoginService } from 'src/app/services/login.service';

@Component({
  selector: 'app-changepassword',
  templateUrl: './changepassword.component.html',
  styleUrls: ['./changepassword.component.css']
})
export class ChangepasswordComponent implements OnInit {
  changePasswordForm:FormGroup;
  constructor(private router:Router, private fb:FormBuilder, private loginService:LoginService) { }

  ngOnInit() {
    this.changePasswordForm =this.fb.group({
      "userID":["",[Validators.required,Validators.email]],
      "oldPassword":['',[Validators.required,Validators.minLength(8)]],
      "newPassword":['',[Validators.required,Validators.minLength(8)]]
    })
    
  }
  submitForm(){
    console.log(this.changePasswordForm.value)
    this.loginService.changePassword(this.changePasswordForm.value).subscribe((res)=>{
      console.log(res)
      if(res.response === 3){
        this.router.navigateByUrl('/adminsignin')
      }
      else{
        alert(res.message);
        //alert("Your Details didn't Match")
      }
    },(err)=>{
      console.log(err)
    })
  }
  
}
