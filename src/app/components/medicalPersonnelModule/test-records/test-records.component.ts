import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { MedicalPersonnelService } from 'src/app/services/medical-personnel.service';
interface SearchByValue {
  viewValue: string;
}
@Component({
  selector: 'app-test-records',
  templateUrl: './test-records.component.html',
  styleUrls: ['./test-records.component.css']
})
export class TestRecordsComponent implements OnInit {
  titleArray: any =
    {
      title: "Screening Center",
      subTitle: "",
      img: "/assets/images/ui/Icons/tube.png"
    };
  searchByValue: SearchByValue[] = [
    { viewValue: 'All' },
    { viewValue: 'Urine' },
    { viewValue: 'Blood' }
  ];
  baseURL: string = "http://34.231.177.197:3000";
  signInRes: any;
  signObj: any;
  userID: string;
  term: any;
  listOfTestRecords: any = []
  filteredlistOfTestRecords: any = []
  closeResult: string;
  isDateVisible: boolean = false;
  hideDate: boolean = true;
  isValue: any;
  testFactorsData: any = [];
  normalSize: any = [];
  AbnormalSize: any = [];
  clicked: string = '';
  selected = 'Any Date';
  addCommentForm: FormGroup;
  getDoctorTestRecordsDataObj: any;
  token: any;
  hideThis: boolean = false;
  is_edit: boolean;
  year1: number;
  month1: number;
  day1: number;
  year11: number;
  month11: number;
  day11: number;
  startTime: any;
  endTime: any;
  mydate1: any;
  mydate11: any;
  d1: any;
  d11: any;
  constructor(private elem: ElementRef, private modalService: NgbModal,
    private medicalPersonService: MedicalPersonnelService, private fb: FormBuilder,
    private _snackBar: MatSnackBar) { }

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

    this.addCommentForm = this.fb.group({
      comment: [""],
    })
  }

  @HostListener('document:click', ['$event'])
  DocumentClick(event: Event) {
    if (this.elem.nativeElement.contains(event.target))
      this.clicked = "inside";
    else
      this.clicked = "outside";
  }

  getTestRecordsData(obj, token) {
    this.medicalPersonService.fetchDoctorTestRecordsAPICall(obj, token).subscribe(
      (res) => {
        console.log("fetched doctor test-results...", res)
        if (res.response === 3) {
          // this.loading = false;
          this.listOfTestRecords = res.testResults;
          this.filteredlistOfTestRecords = res.testResults;
          console.log(this.listOfTestRecords.length);

          this.listOfTestRecords.forEach((val, index) => {
            this.listOfTestRecords[index].flagTrue = 0
            this.listOfTestRecords[index].flagFalse = 0
            let flag1 = [];
            let flag2 = [];//testFactors
            let testFactorsLength = val.testFactors.length
            flag1 = val.testFactors.filter(test => {
              return test.flag == true
            })
            flag2 = val.testFactors.filter(test1 => {
              return test1.flag == false
            })
            this.listOfTestRecords[index].flagTrue = testFactorsLength - flag1.length;
            this.listOfTestRecords[index].flagFalse = testFactorsLength - flag2.length;
          })
          console.log("Test", this.listOfTestRecords);


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

  showData(letSearch: string) {
    console.log("Print Value", letSearch);
    if (letSearch == "All") {
      this.term = ""
    } else {
      this.term = letSearch
    }
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
  searchFirstDate(firstDate: string) {
    console.log(firstDate)
    var fields = firstDate.split('-');

    this.year1 = parseInt(fields[0]);
    this.month1 = parseInt(fields[1]);
    this.day1 = parseInt(fields[2])
    this.mydate1 = new Date(this.year1, this.month1, this.day1);
    console.log("first entered date...", this.mydate1);

    function epoch(date) {
      return Date.parse(date)
    }
    this.d1 = epoch(this.mydate1)
    console.log("startOfTheDay...", this.d1);


    // this.mydate1.setHours(0, 0, 0)
    // console.log("start date time...", this.startTime.getTime());

  }
  searchSecondDate(secondDate: string) {
    console.log(secondDate)
    console.log(secondDate)
    var fields = secondDate.split('-');

    this.year11 = parseInt(fields[0]);
    this.month11 = parseInt(fields[1]);
    this.day11 = parseInt(fields[2])
    this.mydate11 = new Date(this.year11, this.month11, this.day11);
    console.log("second entered date...", this.mydate11);


    function epoch(date) {
      return Date.parse(date)
    }
    this.d11 = epoch(this.mydate11)
    console.log("startOfTheDay...", this.d11);


    // this.mydate11.setHours(23, 59, 59);
    // console.log("end time...", this.endTime.getTime());


    //var startTime, endTime;
    // this.startTime = new Date();
    // console.log("present date startTime...", this.startTime);

    // this.startTime.setHours(0, 0, 0)
    // console.log("start time...", this.startTime.getTime());

    // this.endTime = new Date();
    // this.endTime.setHours(23, 59, 59);
    // console.log("end time...", this.endTime.getTime());

    // this.listOfTestRecords = this.filteredlistOfTestRecords.filter(date => {
    //   var timestamp1 = date.testedTime;
    //   console.log(timestamp1);
    //   //return (yesterdayDate) === timestamp1;
    //   return this.startTime < timestamp1 && this.endTime > timestamp1;
    // })


    this.listOfTestRecords = this.filteredlistOfTestRecords.filter(date => {
      var timestamp1 = date.testedTime;
      console.log(timestamp1);
      console.log(this.d1, this.d11)
      return (this.d1) < timestamp1 && (this.d11) > timestamp1;
    })

  }
  findText(term: string) {
    console.log("findtext...", term)
    this.listOfTestRecords;
    this.filteredlistOfTestRecords;
    if (!term) {
      this.filteredlistOfTestRecords = this.listOfTestRecords;
    } else {
      this.filteredlistOfTestRecords = this.listOfTestRecords.filter(x =>
        x.categoryName.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
    }
  }

  openCalender() {
    this.isDateVisible = !this.isDateVisible
    this.showAllTests();
  }

  callCustomWise() {
    // this.hideThis = true;
    console.log("called customwise...");
    // var inputs = document.getElementsByTagName('input');
    // for (let i = 0; i < inputs.length; i++) {
    //   inputs[i].disabled = true;
    // }
    this.is_edit = true;

  }

  fetchTodayTests() {
    this.selected = "Today";
    console.log("fetchTodayTests Called...");
    this.isValue = 1;
    var startTime, endTime;
    startTime = new Date();
    console.log("present date startTime...", startTime);

    startTime.setHours(0, 0, 0)
    console.log("start time...", startTime.getTime());

    endTime = new Date();
    endTime.setHours(23, 59, 59);
    console.log("end time...", endTime.getTime());

    this.listOfTestRecords = this.filteredlistOfTestRecords.filter(date => {
      var timestamp1 = date.testedTime;
      console.log(timestamp1);
      //return (yesterdayDate) === timestamp1;
      return startTime < timestamp1 && endTime > timestamp1;
    })

  }
  fetchYesterdayTests() {
    this.selected = "Yesterday";
    console.log("fetchYesterdayTests Called...");
    this.isValue = 2;
    //let presentDate: number = Date.now();
    var startTime, endTime;
    startTime = new Date();
    console.log("present date startTime...", startTime);

    startTime.setHours(0, 0, 0)
    console.log("start time...", startTime.getTime());

    endTime = new Date();
    endTime.setHours(23, 59, 59);
    console.log("end time...", endTime.getTime());

    this.listOfTestRecords = this.filteredlistOfTestRecords.filter(date => {
      var timestamp1 = date.testedTime;
      console.log(timestamp1);
      //return (yesterdayDate) === timestamp1;
      return (startTime - 86400000) < timestamp1 && (endTime - 86400000) > timestamp1;
    })

  }
  fetchThisWeekTests() {
    this.selected = "This Week";
    console.log("fetchThisWeekTests Called...");
    this.isValue = 3;
    let thisWeekDate = new Date().getDate;
    console.log("thisWeekDate date...", thisWeekDate);

    function startOfWeek(date) {
      var diff = date.getDate() - date.getDay() + (date.getDay() === 1 ? -6 : 1);

      return new Date(date.setDate(diff));

    }

    var dt = new Date();

    console.log(startOfWeek(dt).toString());

    function epoch(date) {
      return Date.parse(date)
    }
    const weekStartDay = epoch(startOfWeek(dt).toString())

    console.log("week start unix time...", weekStartDay);
    const presentDate = new Date().getTime()
    console.log("present date", presentDate);

    function endOfWeek(date) {

      var lastday = date.getDate() - (date.getDay() - 1) + 6;
      return new Date(date.setDate(lastday));

    }

    // dt = new Date();

    // console.log(endOfWeek(dt).toString());


    this.listOfTestRecords = this.filteredlistOfTestRecords.filter(date => {
      var timestamp1 = date.testedTime;
      console.log(timestamp1);
      console.log(weekStartDay, presentDate)
      return (weekStartDay) < timestamp1 && (presentDate) > timestamp1;
    })

  }
  fetchThisMonthTests() {
    this.selected = "This Month";
    console.log("fetchThisMonthTests Called...");
    this.isValue = 4;
    let thisMonthDate = new Date().getMonth();
    console.log("thisMonthDate date...", thisMonthDate);

    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 1);
    var lastDay = new Date(date.getFullYear(), date.getMonth() + 1, 1);
    console.log(firstDay, lastDay)

    function epoch(date) {
      return Date.parse(date)
    }
    const startOfTheMonth = epoch(firstDay)
    console.log("startOfTheMonth...", startOfTheMonth);

    function epoch1(date) {
      return Date.parse(date)
    }
    const endOfTheMonth = epoch1(lastDay)
    console.log("endOfTheMonth...", endOfTheMonth);

    this.listOfTestRecords = this.filteredlistOfTestRecords.filter(date => {
      var timestamp1 = date.testedTime;
      console.log(timestamp1);
      console.log(startOfTheMonth, endOfTheMonth)
      return (startOfTheMonth) < timestamp1 && (endOfTheMonth) > timestamp1;
    })


  }
  showAllTests() {
    this.selected = "Show All";
    this.isValue = 5;
    this.listOfTestRecords = this.filteredlistOfTestRecords.filter(date => {
      var timestamp1 = date.testedTime;
      console.log(timestamp1);
      return timestamp1;
    })

  }
  commentTestRecord(patient) {
    console.log("Comment operation is on...", patient)
    console.log(this.addCommentForm.value.comment)
    let obj = {
      "hospital_reg_num": this.signObj.medicalPersonnel.profile.userProfile.hospital_reg_num,
      "patientID": patient.patientID,
      "testReportNumber": patient.testReportNumber,
      "doctorComments": this.addCommentForm.value.comment,
      "doctorMedicalPersonnelID": this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id
    }
    let token = this.signObj.access_token;
    this.medicalPersonService.commentDoctorTestRecordsAPICall(obj, token).subscribe(
      (res) => {
        console.log("comment by doctor test-results...", res)
        if (res.response === 3) {
          // this.loading = false;
          this.openSnackBar(res.message, "");
          this.modalService.dismissAll();
          this.addCommentForm.reset();
          this.getTestRecordsData(this.getDoctorTestRecordsDataObj, this.token);
          console.log(res);
        } else if (res.response === 0) {
          //this.loading = false;
          this.openSnackBar1(res.message, "");
        }
      }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          //this.loading = false;
          this.openSnackBar1("Bad Request", "");
          console.log("Client Side Error")
        } else {
          this.openSnackBar1("Bad Request", "");
          //this.loading = false;
          console.log(err)
        }
      })
  }
  deleteTestRecord(patient) {
    console.log("Delete operation is on...", patient)
    let obj = {
      "hospital_reg_num": this.signObj.medicalPersonnel.profile.userProfile.hospital_reg_num,
      "byWhom": "medical personnel",
      "byWhomID": this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id,
      "patientID": patient.patientID,
      "testReportNumber": patient.testReportNumber,
      "medical_record_id": patient.medical_record_id
    }
    let token = this.signObj.access_token;
    this.medicalPersonService.deleteDoctorTestRecordsAPICall(obj, token).subscribe(
      (res) => {
        console.log("comment by doctor test-results...", res)
        if (res.response === 3) {
          // this.loading = false;
          this.getTestRecordsData(this.getDoctorTestRecordsDataObj, this.token);
          this.openSnackBar(res.message, "");
          this.modalService.dismissAll();
          console.log(res);
        } else if (res.response === 0) {
          //this.loading = false;
          this.openSnackBar1(res.message, "");
        }
      }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          //this.loading = false;
          this.openSnackBar1("Bad Request", "");
          console.log("Client Side Error")
        } else {
          this.openSnackBar1("Bad Request", "");
          //this.loading = false;
          console.log(err)
        }
      })
  }
  openDeleteTestMethod(viewDeleteTestModelContent, patient) {
    // this.isButton = false;, windowClass: 'modal-md'
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
  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
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


}
