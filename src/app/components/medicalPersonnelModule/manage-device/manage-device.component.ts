import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { setTime } from 'ngx-bootstrap/chronos/utils/date-setters';
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
  viewDeviceInfo: boolean = false;
  selectedDeviceInfo: any;
  wifiOn: boolean;
  term: any;
  filteravailableDevices: any;
  availableDevices = [{
    "id": "1",
    "name": "device1",
    "password": "device1"
  }, {
    "id": "2",
    "name": "device2",
    "password": "device2"
  },
  {
    "id": "3",
    "name": "device3",
    "password": "device3"
  }]
  selectedRow: any;
  selectedRowList: any = []
  isPassword: boolean = true;
  password: string = "text";
  lastCheckForUpdate: any = new Date().getTime();
  lastSuccessfullUpdate: any = new Date().getTime();
  available: any = "72";
  isRefreshing: boolean = true;
  selectDevice: boolean = false;
  selectedDeviceInformation: any;
  @ViewChild('openUnableToConnectModelContent', { static: true }) modalSuccessExample: ElementRef<any>;
  @ViewChild('openFetchedDevicesModelContent', { static: true }) modalFetchedDevicesSuccessExample: ElementRef<any>;
  @ViewChild('openDeviceInfoModelContent', { static: true }) modalOpenDeviceInfo: ElementRef<any>;

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
  scanDeviceMethod() {
    this.selectDevice = true;
    setTimeout(() => {
      this.selectDevice = false;
    }, 10000)
  }
  showPassword() {
    if (this.isPassword === true) {
      this.password = "password";
      this.isPassword = false;
    } else {
      this.password = "text"
      this.isPassword = true;
    }
  }
  search(term: string) {
    console.log("search...", term)
    if (!term) {
      this.filteravailableDevices = this.availableDevices;
    } else {
      this.filteravailableDevices = this.availableDevices.filter(x =>
        x.name.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
    }
  }

  showData(letSearch: string) {
    console.log("Print Value", letSearch);
    if (letSearch == "All") {
      this.term = ""
    } else {
      this.term = letSearch
    }
  }
  onOffWifi(event) {
    console.log("event val...", event);

    this.wifiOn = event.checked;
    this.filteravailableDevices = this.availableDevices;

    // if (event.checked === true) {
    //   this.availableDevices;
    //   console.log("true...", this.availableDevices)
    // } else if (event.checked === false) {
    //   this.availableDevices = []
    //   console.log("false...", this.availableDevices)
    // }
    //this.availableDevices = this.filteravailableDevices;

  }
  selectWifiDeviceFromList(value: any) {
    console.log(value);
    let index = -1;
    index = this.filteravailableDevices.findIndex((val) => {
      return (
        val.id ===
        value.id
      );
    });
    if (index != -1) {
      let obj = this.filteravailableDevices[index];
      console.log("index val...", obj)
      this.selectedRow = this.filteravailableDevices[index].id;
      console.log("obj", obj);
      //this.modalService.dismissAll()
    }
  }
  selectPatientFromList(value: any) {
    console.log("selected list...", value);
    // let index = -1;
    // index = this.filteredlistOfDevices.findIndex((val) => {
    //   return (
    //     val.deviceID ===
    //     value.deviceID
    //   );
    // });
    // if (index != -1) {
    //   let obj = this.filteredlistOfDevices[index];
    //   console.log("index val...", obj)
    //   this.selectedRow = this.filteredlistOfDevices[index].deviceID;
    //   console.log("obj", obj);
    // }
    // let index = -1;
    // index = this.filteredlistOfDevices.findIndex((val) => {
    //   return (
    //     val.deviceID ===
    //     value.deviceID
    //   );
    // });
    // if (index != -1) {
    //   let obj = this.filteredlistOfDevices[index];
    //   console.log("index val...", obj)
    //   this.selectedRow = this.filteredlistOfDevices[index].deviceID;
    //   console.log("obj", obj);
    // }

    //const selectedRows = this.filteredlistOfDevices.map(dataFound => dataFound.isSeleted = true)
    //console.log("selected rows...", selectedRows);
    this.listOfDevices.forEach((val, i) => {
      this.listOfDevices[i].isSelected = true
    })
    console.log("selected rows...", this.listOfDevices);

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
            this.listOfDevices[index].testMethod = 'Test Strip'
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

  recallTheAvailableDevices() {
    this.getDoctorTestRecordsDataObj = {
      "medical_personnel_id": this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id,
      "hospital_reg_num": this.signObj.medicalPersonnel.profile.userProfile.hospital_reg_num
    }
    this.token = this.signObj.access_token;
    this.getTestRecordsData(this.getDoctorTestRecordsDataObj, this.token);
    this.modalService.open(this.modalFetchedDevicesSuccessExample)

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


  openViewDeviceInfoMethod(selectedDevice) {
    this.viewDeviceInfo = true;
    this.selectedDeviceInfo = selectedDevice;
    console.log("selectedDevice info...", selectedDevice);
  }
  closeViewDeviceInfo() {
    this.viewDeviceInfo = false;
  }

  openDisconnectMethod(openDisconnectModelContent, selectedDevice) {
    this.modalService.open(openDisconnectModelContent, { ariaLabelledBy: 'modal-basic-title', size: 'md', backdrop: "static" }).result.then((result) => {
      //centered: true,
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openRemoveMethod(openRemoveModelContent, selectedDevice) {
    this.modalService.open(openRemoveModelContent, { ariaLabelledBy: 'modal-basic-title', size: 'md', backdrop: "static" }).result.then((result) => {
      //centered: true,
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openUnableToConnectMethod(openUnableToConnectModelContent, selectedDevice) {
    this.modalService.open(openUnableToConnectModelContent, { ariaLabelledBy: 'modal-basic-title', size: 'md', backdrop: "static" }).result.then((result) => {
      // centered: true,
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openEnterPwdModelMethod(openEnterPwdModelContent, value: any) {
    console.log(value);
    let index = -1;
    index = this.filteravailableDevices.findIndex((val) => {
      return (
        val.id ===
        value.id
      );
    });
    if (index != -1) {
      let obj = this.filteravailableDevices[index];
      console.log("index val...", obj)
      this.selectedRow = this.filteravailableDevices[index].id;
      console.log("obj", obj);
      //this.modalService.dismissAll()
    }

    this.modalService.open(openEnterPwdModelContent, { ariaLabelledBy: 'modal-basic-title', size: 'md', backdrop: "static" }).result.then((result) => {
      //centered: true,
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  viewSuccessMethod(viewSuccessContent) {
    this.modalService.open(viewSuccessContent, { ariaLabelledBy: 'modal-basic-title', size: 'md', backdrop: "static" }).result.then((result) => {
      //centered: true,
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openCheckForUpdateMethod(openCheckForUpdateModelContent) {

    this.modalService.open(openCheckForUpdateModelContent, { ariaLabelledBy: 'modal-basic-title', size: 'md', backdrop: "static" }).result.then((result) => {
      //centered: true,
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openUnableToCheckForUpdateMethod(openUnableToCheckForUpdateModelContent) {

    this.modalService.open(openUnableToCheckForUpdateModelContent, { ariaLabelledBy: 'modal-basic-title', size: 'md', backdrop: "static" }).result.then((result) => {
      //centered: true,
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openYourSystemIsuptoDateMethod(openYourSystemIsuptoDateModelContent) {

    this.modalService.open(openYourSystemIsuptoDateModelContent, { ariaLabelledBy: 'modal-basic-title', size: 'md', backdrop: "static" }).result.then((result) => {
      //centered: true,
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  openDownloadCheckForUpdateMethod(openDownloadCheckForUpdateModelContent) {

    this.modalService.open(openDownloadCheckForUpdateModelContent, { ariaLabelledBy: 'modal-basic-title', size: 'md', backdrop: "static" }).result.then((result) => {
      //centered: true,
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openUpdatingNewFirmwareMethod(openUpdatingNewFirmwareModelContent) {

    this.modalService.open(openUpdatingNewFirmwareModelContent, { ariaLabelledBy: 'modal-basic-title', size: 'md', backdrop: "static" }).result.then((result) => {
      //centered: true,
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  openFetchedDevicesMethod(openFetchedDevicesModelContent) {

    this.modalService.open(openFetchedDevicesModelContent, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdrop: "static", windowClass: 'modal-xl1' }).result.then((result) => {
      //centered: true,
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openDeviceInformationModel(selectedDEviceInformation) {
    this.selectedDeviceInformation = selectedDEviceInformation;
    console.log("the selected device data...", selectedDEviceInformation)

    this.modalService.open(this.modalOpenDeviceInfo)
  }
  openDeviceInfoMethod(openDeviceInfoModelContent, selectedDEviceInformation) {
    // this.selectedDeviceInformation = selectedDEviceInformation;
    // console.log("the selected device data...", selectedDEviceInformation)
    this.modalService.open(openDeviceInfoModelContent, { ariaLabelledBy: 'modal-basic-title', size: 'lg', windowClass: 'modal-lg', backdrop: "static", }).result.then((result) => {
      //centered: true, 
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  openScanDevicesMethod(openScanDevicesModelContent) {
    setTimeout(() => {
      this.isRefreshing = false;
    }, 10000)
    this.modalService.open(openScanDevicesModelContent, { ariaLabelledBy: 'modal-basic-title', size: 'lg', backdrop: "static", windowClass: 'modal-xl' }).result.then((result) => {
      //centered: true,
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
