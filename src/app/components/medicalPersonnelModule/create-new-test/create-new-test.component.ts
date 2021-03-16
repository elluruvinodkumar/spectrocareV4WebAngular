import { HttpErrorResponse } from '@angular/common/http';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { ModalDismissReasons, NgbCalendar, NgbDate, NgbDatepickerConfig, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { LoginService } from 'src/app/services/login.service';
import { MedicalPersonnelService } from 'src/app/services/medical-personnel.service';
import Swiper from 'swiper';
interface SearchByValue {
  viewValue: string;
}
@Component({
  selector: 'app-create-new-test',
  templateUrl: './create-new-test.component.html',
  styleUrls: ['./create-new-test.component.css']
})
export class CreateNewTestComponent implements OnInit {
  mySwiper: any = null;
  titleArray: any =
    {
      title: "Screening Center",
      subTitle: "",
      img: "/assets/images/ui/Icons/tube.png"
    };
  searchByValue: SearchByValue[] = [
    { viewValue: 'All' },
    { viewValue: 'Test Strip' },
    { viewValue: 'Reagent' }
  ];
  term: any;
  term1: any;
  filteredlistOfTestRecords: any = [];
  listOfTestRecords: any = [];
  closeResult: string;
  addTestDateDetails: FormGroup;
  firstFormGroup: FormGroup;
  secondFormGroup: FormGroup;
  viewTestInfoForm: FormGroup;
  patientProfileForm: FormGroup;
  patients: any = [];
  patientsList: any = [];
  filteredPatients: any = [];
  options: Array<any>;
  signInRes: any;
  signObj: any;
  byWhom: string;
  byWhomID: string;
  hospitalRegNum: string;
  selectedRow: any;
  selectedDevice: any;
  token: any;
  imgURL: any = "http://34.231.177.197:3000"
  baseURL: string = "http://34.231.177.197:3000";
  getDoctorTestRecordsDataObj: any;
  generatedJsonData = [];
  fetchedDevicesData: any = [];
  filteredFetchedDevicesData: any = [];
  generatedTest: boolean = false;
  pHReferenceRange: any;
  pHFlag: boolean;
  specificGravityReferenceRange: any;
  specificGravityFlag: boolean;
  nitrideReferenceRange: any;
  nitrideFlag: boolean;
  ketoneBodyReferenceRange: any;
  ketoneBodyFlag: boolean;
  leukocyteReferenceRange: any;
  leukocyteFlag: boolean;
  glucoseReferenceRange: any;
  glucoseFlag: boolean;
  protienReferenceRange: any;
  protienFlag: boolean;
  occultBolldReferenceRange: any;
  occultBolldFlag: boolean;
  urobilinogenReferenceRange: any;
  urobilinogenFlag: boolean;
  ebrilirubinReferenceRange: any;
  ebrilirubinFlag: boolean;
  brilirubinReferenceRange: any;
  brilirubinFlag: boolean;
  localTime: any;
  patientName: any;
  selectedTestInfo: any;
  content: any;
  constructor(private modalService: NgbModal, private _formBuilder: FormBuilder,
    private loginService: LoginService, private cd: ChangeDetectorRef,
    private medicalPersonService: MedicalPersonnelService,
    private _snackBar: MatSnackBar, config: NgbDatepickerConfig, calendar: NgbCalendar) {
    let date = new Date();
    config.minDate = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
    console.log("Date", config.minDate)
    //config.maxDate = { year: 2021, month: 12, day: 31 };
    config.maxDate = { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() + 14 };
    // weekends are disabled
    config.markDisabled = (date: NgbDate) => calendar.getWeekday(date) >= 7;

  }

  ngOnInit() {
    this.signInRes = localStorage.getItem("SignInRes");
    this.signObj = JSON.parse(this.signInRes);
    this.byWhom = "medical personnel";
    this.byWhomID = this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id;
    this.hospitalRegNum = this.signObj.medicalPersonnel.profile.userProfile.hospital_reg_num;
    this.token = this.signObj.access_token;

    let objForFetchPatients = {
      "byWhom": this.byWhom,
      "byWhomID": this.byWhomID,
      "category": "all",
      "hospital_reg_num": this.hospitalRegNum,
      "token": this.signObj.access_token
    }
    this.getPatientData(objForFetchPatients);

    this.getDoctorTestRecordsDataObj = {
      //"medical_personnel_id": this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id,
      "hospital_reg_num": this.signObj.medicalPersonnel.profile.userProfile.hospital_reg_num,
      "byWhom": "medical personnel",
      "byWhomID": this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id
    }
    this.getTestRecordsData(this.getDoctorTestRecordsDataObj, this.token);

    var objToFetchDevices = {
      "hospital_reg_num": this.signObj.medicalPersonnel.profile.userProfile.hospital_reg_num,
      "medical_personnel_id": this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id
    }
    this.getMedicalPersonDevicesData(objToFetchDevices, this.token)

    this.firstFormGroup = this._formBuilder.group({
      firstCtrl: ['', Validators.required]
    });
    this.secondFormGroup = this._formBuilder.group({
      secondCtrl: ['', Validators.required]
    });

    this.addTestDateDetails = this._formBuilder.group({
      sampleType: [""],
      startDate: [""],
      colletedTime: [""],
      endDate: [""],
      testedTime: [""],
      isFasting: ["true"]
    })
    this.viewTestInfoForm = this._formBuilder.group({
      testName: [""],
      testDevice: [""],
      testMethod: [""],
      testItems: [""]
    })
    this.patientProfileForm = this._formBuilder.group({
      doctorName: [""],
      department: [""],
      medical_personnel_id: [""],
      firstName: [""],
      lastName: [""],
      gender: [""],
      dob: [""],
      phoneNumberCountryCode: [""],
      phoneNumber: [""],
      age: [""],
      emailID: [""],
      address: [""],
      city: [""],
      state: [""],
      country: [""],
      postalCode: [""],
      profilePic: [""],
    });


    this.onLoad();
  }

  getTestRecordsData(obj, token) {
    this.medicalPersonService.fetchTestItemsAPICall(obj, token).subscribe(
      (res) => {
        console.log("fetched test items...", res)
        if (res.response === 3) {
          // this.loading = false;
          this.listOfTestRecords = res.records[0].testItems;
          this.filteredlistOfTestRecords = res.records[0].testItems;
          console.log("Test", this.listOfTestRecords[0]);

          this.listOfTestRecords.forEach((val, i) => {
            this.listOfTestRecords[i].parameters2 = val.parameters.map(items => {
              return items.name;
            })
          })
          console.log("Test Items", this.listOfTestRecords);


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

  getMedicalPersonDevicesData(obj, token) {
    this.medicalPersonService.fetchMedicalPersonDevicesApiCall(obj, token).subscribe(
      (res) => {
        console.log("fetched devices data is ...", res)
        if (res.response === 3) {
          // this.loading = false;
          this.fetchedDevicesData = res.otherDevices;
          this.filteredFetchedDevicesData = res.otherDevices;
          console.log("ListOffetchedDevicesData...", this.fetchedDevicesData);

          this.fetchedDevicesData.forEach((val, i) => {
            val.status = "Connect";
          }
          )
          console.log("After add status param to fetchedDevicesData...", this.fetchedDevicesData);


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
  search(term: string) {
    console.log("search...", term)
    if (!term) {
      this.filteredlistOfTestRecords = this.listOfTestRecords;
    } else {
      this.filteredlistOfTestRecords = this.listOfTestRecords.filter(x =>
        x.categoryName.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
    }
  }
  findText(term: string) { }
  startTest() {
    setTimeout(() => {
      this.generatedTest = true;
    }, 10000);

    this.localTime = new Date().getDate() + "/"
      + (new Date().getMonth() + 1) + "/"
      + new Date().getFullYear() + " @ "
      + new Date().getHours() + ":"
      + new Date().getMinutes() + ":"
      + new Date().getSeconds() +
      ((new Date().getHours() > 12) ? ('PM') : 'AM');;
    this.patientName = this.patientProfileForm.value.firstName + " " + this.patientProfileForm.value.lastName;

    let pHReferenceRange = "5.0~7.5";
    this.generatepH()
    if (this.pHReferenceRange > 7.5) {
      this.pHFlag = true;
    }
    else {
      this.pHFlag = false;
    }

    this.generatespecificGravityReferenceRange()
    if (this.specificGravityReferenceRange > 1.025) {
      this.specificGravityFlag = true
    }
    else {
      this.specificGravityFlag = false
    }

    this.generatenitrideReferenceRange()
    if (this.nitrideReferenceRange > 0.004) {
      this.nitrideFlag = true
    }
    else {
      this.nitrideFlag = false
    }
    this.generateketoneBodyReferenceRange()
    if (this.ketoneBodyReferenceRange > 4) {
      this.ketoneBodyFlag = true
    }
    else {
      this.ketoneBodyFlag = false
    }
    this.generateleukocyteReferenceRange()
    if (this.leukocyteReferenceRange > 17) {
      this.leukocyteFlag = true
    }
    else {
      this.leukocyteFlag = false
    }
    this.generateglucoseReferenceRange()
    if (this.glucoseReferenceRange > 30) {
      this.glucoseFlag = true
    }
    else {
      this.glucoseFlag = false
    }

    this.generateprotienReferenceRange()
    if (this.protienReferenceRange > 10) {
      this.protienFlag = true
    }
    else {
      this.protienFlag = false
    }

    this.generateoccultBolldReferenceRange()
    if (this.occultBolldReferenceRange > 0.03) {
      this.occultBolldFlag = true
    }
    else {
      this.occultBolldFlag = false
    }

    this.generateurobilinogenReferenceRange()
    if (this.urobilinogenReferenceRange > 1.5) {
      this.urobilinogenFlag = true
    }
    else {
      this.urobilinogenFlag = false
    }

    this.generatebrilirubinReferenceRange()
    if (this.brilirubinReferenceRange <= 0.5) {
      this.brilirubinFlag = true
    }
    else {
      this.brilirubinFlag = false
    }

    let glucoseReferenceRange = "<30";
    let protienReferenceRange = "<10";
    let occultBolldReferenceRange = "<0.03";
    let specificGravityReferenceRange = "1.005~1.025";
    let urobilinogenReferenceRange = "≤1.5";
    let brilirubinReferenceRange = "<0.5";
    let nitrideReferenceRange = "0~0.04";
    let ketoneBodyReferenceRange = "0~4";
    let leukocyteReferenceRange = "0~17";

    this.generatedJsonData = [
      {
        "name": "Occult Blood",
        "unit": " RCB\/uL",
        "value": '' + this.occultBolldReferenceRange,
        "result": " +++",
        "referenceRange": "≤3",
        "flag": this.occultBolldFlag
      },
      {
        "name": "Bilirubin",
        "unit": " mg\/dL",
        "value": '' + this.brilirubinReferenceRange,
        "result": " +++",
        "referenceRange": "≤0.1",
        "flag": this.brilirubinFlag
      },
      {
        "name": "Urobilinogen",
        "unit": " mg\/dL",
        "value": '' + this.urobilinogenReferenceRange,
        "result": " +",
        "referenceRange": "0.1~1.0",
        "flag": this.urobilinogenFlag
      },
      {
        "name": "Ketone",
        "unit": " mg\/dL",
        "value": '' + this.ketoneBodyReferenceRange,
        "result": " ++",
        "referenceRange": "≤5",
        "flag": this.ketoneBodyFlag
      },
      {
        "name": "Glucose",
        "unit": " mg\/dL",
        "value": '' + this.glucoseReferenceRange,
        "result": " +++",
        "referenceRange": "<100",
        "flag": this.glucoseFlag
      },
      {
        "name": "Protein",
        "unit": " mg\/dL",
        "value": '' + this.protienReferenceRange,
        "result": " +++",
        "referenceRange": "≤15",
        "flag": this.protienFlag
      },
      {
        "name": "Nitrite",
        "unit": " mg\/dL",
        "value": '' + this.nitrideReferenceRange,
        "result": " +",
        "referenceRange": "<0.1",
        "flag": this.nitrideFlag
      },
      {
        "name": "Leukocytes",
        "unit": " WBC\/uL",
        "value": '' + this.leukocyteReferenceRange,
        "result": " ++",
        "referenceRange": "<15",
        "flag": this.leukocyteFlag
      },
      {
        "name": "PH",
        "unit": " ",
        "value": '' + this.pHReferenceRange,
        "result": " ",
        "referenceRange": "<30",
        "flag": this.pHFlag
      },
      {
        "name": "Specific Gravity",
        "unit": " ",
        "value": '' + this.specificGravityReferenceRange,
        "result": " ",
        "referenceRange": "1.005~1.030 ",
        "flag": this.specificGravityFlag
      },
      // {
      //   "name": "Ascorbic Acid",
      //   "unit": " mg\/dL",
      //   "value": "0",
      //   "result": " Negative",
      //   "referenceRange": "0~40",
      //   "flag": true
      // }
    ]
  }


  //Start Generating JSON data values
  generatepH() {
    console.log("specific Gravity val...", this.pHReferenceRange = (Math.random() * (7.5 - 5.0) + 5.0).toFixed(1));
  }
  generatespecificGravityReferenceRange() {
    console.log("specific Gravity val...", this.specificGravityReferenceRange = (Math.random() * (1.025 - 1.005) + 1.005).toFixed(3));
  }
  generatenitrideReferenceRange() {
    console.log("generatenitrideReferenceRange val...two", this.nitrideReferenceRange = (Math.random() * (0.004 - 0) + 0).toFixed(3));
  }

  generateketoneBodyReferenceRange() {
    console.log("generateketoneBodyReferenceRange val...", this.ketoneBodyReferenceRange = (Math.random() * (4 - 0) + 0).toFixed(0));
  }
  generateleukocyteReferenceRange() {
    console.log("generateleukocyteReferenceRange val...", this.leukocyteReferenceRange = (Math.random() * (17 - 0) + 0).toFixed(0));
  }
  generateglucoseReferenceRange() {
    console.log("generateglucoseReferenceRange val...", this.glucoseReferenceRange = (Math.random() * (30 - 0) + 0).toFixed(0));
  }
  generateprotienReferenceRange() {
    console.log("generateprotienReferenceRange val...", this.protienReferenceRange = (Math.random() * (10 - 0) + 0).toFixed(0));
  }
  generateoccultBolldReferenceRange() {
    console.log("generateoccultBolldReferenceRange val...", this.occultBolldReferenceRange = (Math.random() * (0.03 - 0) + 0).toFixed(2));
  }
  generateurobilinogenReferenceRange() {
    console.log("generateurobilinogenReferenceRange val...", this.urobilinogenReferenceRange = (Math.random() * (1.5 - 0) + 0).toFixed(1));

  }
  generatebrilirubinReferenceRange() {
    console.log("generatebrilirubinReferenceRange val...", this.brilirubinReferenceRange = (Math.random() * (0.5 - 0) + 0).toFixed(1));

  }
  //End Generating JSON data values


  onLoad() {
    // this.fetchedDevicesData = [{
    //   "id": 11,
    //   "img": "../../../../assets/images/ui/Icons/Capture.png",
    //   "name": "UTSR1",
    //   "status": "Connected"
    // }, {
    //   "id": 2,
    //   "img": "../../../../assets/images/ui/Icons/Capture.png",
    //   "name": "UTSR2",
    //   "status": "Connected"
    // }, {
    //   "id": 3,
    //   "img": "../../../../assets/images/ui/Icons/Capture.png",
    //   "name": "UTSR3",
    //   "status": "Connected"
    // },
    // {
    //   "id": 4,
    //   "img": "../../../../assets/images/ui/Icons/Capture.png",
    //   "name": "UTSR4",
    //   "status": "Connected"
    // }, {
    //   "id": 5,
    //   "img": "../../../../assets/images/ui/Icons/Capture.png",
    //   "name": "UTSR5",
    //   "status": "Connecting"
    // }, {
    //   "id": 6,
    //   "img": "../../../../assets/images/ui/Icons/Capture.png",
    //   "name": "UTSR6",
    //   "status": "Connect"
    // },
    // {
    //   "id": 7,
    //   "img": "../../../../assets/images/ui/Icons/Capture.png",
    //   "name": "UTSR7",
    //   "status": "Connected"
    // }, {
    //   "id": 8,
    //   "img": "../../../../assets/images/ui/Icons/Capture.png",
    //   "name": "UTSR8",
    //   "status": "Connected"
    // }, {
    //   "id": 9,
    //   "img": "../../../../assets/images/ui/Icons/Capture.png",
    //   "name": "UTSR9",
    //   "status": "Connected"
    // }];
    this.fetchedDevicesData;
    this.cd.detectChanges();
    this.initiateSwiper();

  }

  onTabChange(event) {
    console.log("event", event)
  }
  showData(letSearch: string) {
    console.log("Print Value", letSearch);
    if (letSearch == "All") {
      this.term = ""
    } else {
      this.term = letSearch
    }
  }
  // search(term: string) {
  //   console.log("term", term)
  //   // if (!term) {
  //   //   this.filteredPatients = this.patientsList;
  //   // } else {
  //   //   this.filteredPatients = this.patientsList.filter(x =>
  //   //     x.firstName.trim().toLowerCase().includes(term.trim().toLowerCase())
  //   //   );
  //   // }
  // }

  getPatientData(obj) {
    console.info("fetching patients data : ", obj);
    this.loginService.getPatientData(obj).subscribe(
      (res) => {
        console.log(res)
        if (res.response === 3) {

          this.patientsList = res.patients;
          this.filteredPatients = res.patients;
          // this.cd.detectChanges();
          // this.initiateSwiper();
          console.log("list of patients : ", this.patientsList);
          this.options = this.patientsList;
        } else {
          console.log(res.message);
        }
      }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {

          console.log("Client Side Error")
        } else {

          console.log(err)
        }
      })

    // this.initiateSwiper()

  }
  findPatient(term: string) {
    this.patients;
    this.filteredPatients;
    if (!term) {
      this.patients = this.filteredPatients;
    } else {
      this.patients = this.filteredPatients.filter(x =>
        x.firstName.trim().toLowerCase().startsWith(term.trim().toLowerCase())
      );
    }
  }
  selectPatientFromList(value: any) {
    console.log(value);
    let index = -1;
    index = this.filteredPatients.findIndex((val) => {
      return (
        val.patientID ===
        value.patientID
      );
    });
    if (index != -1) {
      let obj = this.filteredPatients[index];
      console.log("index val...", obj)
      this.selectedRow = this.filteredPatients[index].patientID;
      console.log("obj", obj);
      this.patientProfileForm.patchValue({
        firstName: obj.firstName,
        lastName: obj.lastName,
        patientID: obj.patientID,
        medical_record_id: obj.medical_record_id,
        doctorName:
          obj.firstName +
          " " +
          obj.lastName,
        medical_personnel_id: obj.medical_personnel_id,
        department: obj.department,
      });
      console.log("addTestDateDetails...", this.addTestDateDetails.value)
      //this.modalService.dismissAll()
    }
  }
  selectDeviceFromList(value: any) {
    console.log(value);
    let index = -1;
    index = this.fetchedDevicesData.findIndex((val) => {
      return (
        val.deviceID ===
        value.deviceID
      );
    });
    if (index != -1) {
      let obj = this.fetchedDevicesData[index];
      console.log("index val...", obj)
      this.selectedDevice = this.fetchedDevicesData[index].deviceID;
      obj.status = "Connecting"
      setTimeout(() => {
        obj.status = "Connected"
      }, 5000);




      console.log("obj", obj);
      // this.patientProfileForm.patchValue({
      //   doctorName:
      //     obj.firstName +
      //     " " +
      //     obj.lastName,
      //   medical_personnel_id: obj.medical_personnel_id,
      //   department: obj.department,
      // });
      //this.modalService.dismissAll()
    }
  }
  printPage(id: any) {
    console.log(id)
    // if (this.disableIcons === true) {
    //   this.disableIcons = false;
    // }

    let prntPage = document.getElementById('content').innerHTML;
    let originalContent = document.body.innerHTML;
    document.body.innerHTML = prntPage;
    window.print();
    location.reload()

  }
  openDeleteTestMethod(viewDeleteTestModelContent, patient) {
    // this.isButton = false;
    this.modalService.open(viewDeleteTestModelContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'md', backdrop: "static" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openViewTestReportMethod(viewTestReportModelContent, patient) {
    this.modalService.open(viewTestReportModelContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg', backdrop: "static" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openAddCommentMethod(openAddCommentModelContent, patient) {
    this.modalService.open(openAddCommentModelContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg', backdrop: "static" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openCreateNewTestMethod(createNewTestModel, selectedTestInfo) {
    console.log("selectedTestInfo...", selectedTestInfo)
    this.selectedTestInfo = selectedTestInfo;
    let testMethodData: any = selectedTestInfo.testMethod + " ( " + selectedTestInfo.testId + " @ " + selectedTestInfo.brand + ")"
    this.viewTestInfoForm.patchValue({
      testName: selectedTestInfo.testName,
      testDevice: selectedTestInfo.deviceModel,
      testMethod: testMethodData,
      testItems: selectedTestInfo.parameters2
    })
    this.addTestDateDetails.patchValue({
      sampleType: selectedTestInfo.testName
    })
    this.modalService.open(createNewTestModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg', backdrop: "static" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openUnableToConnectMethod(openUnableToConnectModel) {
    this.modalService.open(openUnableToConnectModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'md', backdrop: "static" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openAbortTestMethod(openAbortTestModel) {
    this.modalService.open(openAbortTestModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'md', backdrop: "static" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openDiscardMethod(openDiscardModel) {
    this.modalService.open(openDiscardModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'md', backdrop: "static" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openShareReportMethod(viewShareReportModel) {
    // console.log(selectedPatient)
    this.modalService.open(viewShareReportModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: "static" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  toggleWithGreeting(popover, greetings: string[], language: string) {
    if (popover.isOpen()) {
      popover.close();
    } else {
      popover.open({ greetings: greetings, language });
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

  initiateSwiper() {
    this.mySwiper = new Swiper('.s1', {
      slidesPerView: 3,
      spaceBetween: 10,
      // init: false,

      loop: true,
      // pagination: {
      //   el: '.swiper-pagination',
      //   clickable: true,
      // },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },

      autoplay: {
        delay: 2000,
        disableOnInteraction: false,
      },
      breakpoints: {
        640: {
          slidesPerView: 2,
          spaceBetween: 10,
        },
        768: {
          slidesPerView: 4,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 6,
          spaceBetween: 40,
        },
      }
      // And if we need scrollbar
    })


  }

}
