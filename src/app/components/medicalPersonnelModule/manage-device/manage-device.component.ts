import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { MedicalPersonnelService } from 'src/app/services/medical-personnel.service';
interface SearchByValue {
  viewValue: string;
}
@Component({
  selector: 'app-manage-device',
  templateUrl: './manage-device.component.html',
  styleUrls: ['./manage-device.component.css']
})
export class ManageDeviceComponent implements OnInit {
  titleArray: any =
    {
      title: "Screening Center",
      subTitle: "",
      img: "/assets/images/ui/Icons/tube.png"
    };
  searchByValue: SearchByValue[] = [
    { viewValue: 'All' },
    { viewValue: 'UTSR' },
    { viewValue: 'UTRR' }
  ];
  listOfDevices: any = []
  filteredlistOfDevices: any = []
  baseURL: string = "http://34.231.177.197:3000";
  signInRes: any;
  signObj: any;
  userID: string;
  getDoctorTestRecordsDataObj: any;
  token: any;
  closeResult: string;

  @ViewChild('openUnableToConnectModelContent', { static: true }) modalSuccessExample: ElementRef<any>;
  constructor(private medicalPersonService: MedicalPersonnelService, private fb: FormBuilder,
    private _snackBar: MatSnackBar, private modalService: NgbModal,) { }

  ngOnInit() {
    this.signInRes = localStorage.getItem("SignInRes");
    //    if (this.signInRes) {
    this.signObj = JSON.parse(this.signInRes);
    this.userID = localStorage.getItem('userID');

    this.getDoctorTestRecordsDataObj = {
      "medical_personnel_id": this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id,
      "hospital_reg_num": this.signObj.medicalPersonnel.profile.userProfile.hospital_reg_num
    }
    this.token = this.signObj.access_token;
    this.getTestRecordsData(this.getDoctorTestRecordsDataObj, this.token);


  }

  getTestRecordsData(obj, token) {
    this.medicalPersonService.fetchMedicalPersonDevicesApiCall(obj, token).subscribe(
      (res) => {
        console.log("fetched doctor test-results...", res)
        if (res.response === 3) {
          // this.loading = false;
          this.listOfDevices = res.otherDevices;
          this.filteredlistOfDevices = res.otherDevices;
          console.log(this.listOfDevices.length);

          this.listOfDevices.forEach((val, index) => {
            this.listOfDevices[index].status = 'Connect'
            this.listOfDevices[index].manufacturer = 'SpectroChip Inc.'
            this.listOfDevices[index].location = 'Lab center'
            // let flag1 = [];
            // let flag2 = [];
            // let testFactorsLength = val.testFactors.length
            // flag1 = val.testFactors.filter(test => {
            //   return test.flag == true
            // })
            // flag2 = val.testFactors.filter(test1 => {
            //   return test1.flag == false
            // })
            // this.listOfDevices[index].flagTrue = testFactorsLength - flag1.length;
            // this.listOfDevices[index].flagFalse = testFactorsLength - flag2.length;
          })
          console.log("Test", this.listOfDevices);


        } else if (res.response === 0) {
          //this.loading = false;
        }
      }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          //this.loading = false;
          console.log("Client Side Error")
        } else {
          //this.loading = false;
          console.log(err)
        }
      })
  }

  connectDeviceMethod(selectedDevice) {
    console.log(selectedDevice);
    let index = -1;
    index = this.filteredlistOfDevices.findIndex((val) => {
      return (
        val.deviceID ===
        selectedDevice.deviceID
      );
    });
    if (index != -1) {
      let obj = this.filteredlistOfDevices[index];
      console.log("index val...", obj)
      this.filteredlistOfDevices[index].status = 'Connecting';
      setTimeout(() => {
        this.filteredlistOfDevices[index].status = 'Connected';
        this.modalService.open(this.modalSuccessExample)
      }, 5000);
      //this.selectedRow = this.filteredlistOfDevices[index].patientID;
      console.log("obj", obj);
      //this.modalService.dismissAll()

    }
  }


  openDisconnectMethod(openDisconnectModelContent, selectedDevice) {
    this.modalService.open(openDisconnectModelContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'md', backdrop: "static" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openRemoveMethod(openRemoveModelContent, selectedDevice) {
    this.modalService.open(openRemoveModelContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'md', backdrop: "static" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openUnableToConnectMethod(openUnableToConnectModelContent, selectedDevice) {
    this.modalService.open(openUnableToConnectModelContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'md', backdrop: "static" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  viewSuccessMethod(viewSuccessContent) {
    this.modalService.open(viewSuccessContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'md', backdrop: "static" }).result.then((result) => {
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

}
