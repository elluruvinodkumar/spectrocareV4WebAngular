import { HttpErrorResponse } from '@angular/common/http';
import { Component, ElementRef, HostListener, OnInit } from '@angular/core';
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
    { viewValue: 'Urine Test' },
    { viewValue: 'Blood Test' }
  ];
  baseURL: string = "http://34.231.177.197:3000";
  signInRes: any;
  signObj: any;
  userID: string;

  term: any;
  listOfTestRecords: any = []
  filteredlistOfTestRecords: any = []
  // [
  //   {
  //     "id": "12345678910",
  //     "name": "abc mani-rathnam",
  //     "date": "18/1/2021",
  //     "time": "10:00 AM",
  //     "testname": "urine test",
  //     "total": "10",
  //     "normal": "8",
  //     "abnormal": "2",
  //     "testedby": "Dr. Sourav Ganguly",
  //     "department": "Dental"
  //   }
  // ]
  closeResult: string;
  isDateVisible: boolean = false;
  hideDate: boolean = true;
  isValue: any;

  maxDate = "2018-08-28";
  minDate: '2016-08-28';
  testFactorsData: any = [];
  normalSize: any = [];
  AbnormalSize: any = [];
  clicked: string = '';
  constructor(private elem: ElementRef, private modalService: NgbModal, private medicalPersonService: MedicalPersonnelService) { }

  ngOnInit() {

    this.signInRes = localStorage.getItem("SignInRes");
    //    if (this.signInRes) {
    this.signObj = JSON.parse(this.signInRes);
    this.userID = localStorage.getItem('userID');

    let getDoctorTestRecordsDataObj = {
      "medical_personnel_id": this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id,
      "hospital_reg_num": this.signObj.medicalPersonnel.profile.userProfile.hospital_reg_num
    }
    let token = this.signObj.access_token;
    this.getTestRecordsData(getDoctorTestRecordsDataObj, token);
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

          for (let i = 0; i <= this.listOfTestRecords.length - 1; i++) {
            this.testFactorsData = this.listOfTestRecords[i].testFactors;
            let a1 = []
            a1.push(this.testFactorsData)
            console.log("test factors data length...", this.testFactorsData, a1.length, a1);
            // let normalSize = [];
            // let AbnormalSize = [];
            console.log(a1[0].length)
            let simpleArray = a1[0];
            console.log(simpleArray)

            var result = simpleArray.map(person => ({
              flag: person.flag,
              healthReferenceRanges: person.healthReferenceRanges,
              result: person.result,
              testName: person.testName,
              unit: person.unit,
              value: person.value
            }));
            console.log(result)

            for (let i = 0; i <= simpleArray.lenght - 1; i++) {
              console.log("inside 2nd for...", simpleArray[i].flag);
              if (simpleArray[i].flag === true) {
                this.normalSize.push(simpleArray[i])
                console.log(this.normalSize)
              }
              else {
                this.AbnormalSize.push(simpleArray[i])
              }
            }
            this.testFactorsData = []
            console.log("normal size length...", this.normalSize.length);
            console.log("abnormal size length...", this.AbnormalSize.length);

          }


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
    console.log("term", term)
  }
  findText(term: string) {
  }

  openCalender() {
    this.isDateVisible = !this.isDateVisible
  }
  callCustomWise() {
  }

  fetchTodayTests() {
    console.log("fetchTodayTests Called...");
    this.isValue = 1;
    let todayDate = new Date().getTime();
    console.log("today date...", todayDate);

    this.listOfTestRecords = this.filteredlistOfTestRecords.filter(date => {
      var timestamp1 = date.testedTime;
      console.log(timestamp1);
      console.log(todayDate)
      //var date1: any = new Date(timestamp1 * 1000);
      //var formattedDate1 = ('0' + date1.getDate()).slice(-2) + '/' + ('0' + (date1.getMonth() + 1)).slice(-2) + '/' + date1.getFullYear();
      //console.log(formattedDate1);
      return (todayDate / 1000) === timestamp1;
      //return formattedDate1 < formattedDate
      //return date.appointmentDetails.appointmentDate < presentDate
    })

  }
  fetchYesterdayTests() {
    console.log("fetchYesterdayTests Called...");
    this.isValue = 2;
    let presentDate: number = Date.now();
    let rem: number = 86400000;
    let yesterdayDate: number = presentDate - rem;
    console.log(yesterdayDate);

    //  var presentDate = Math.round(new Date().getTime())
    //console.log("present data : ", presentDate);
    //this.showData("All");
    //var timestamp = presentDate;
    //var date = new Date(timestamp * 1000);
    //var formattedDate = ('0' + date.getDate()).slice(-2) + '/' + ('0' + (date.getMonth() + 1)).slice(-2) + '/' + date.getFullYear();
    //console.log(formattedDate);

    this.listOfTestRecords = this.filteredlistOfTestRecords.filter(date => {
      var timestamp1 = date.testedTime;
      console.log(timestamp1);
      console.log(yesterdayDate)
      //var date1: any = new Date(timestamp1 * 1000);
      //var formattedDate1 = ('0' + date1.getDate()).slice(-2) + '/' + ('0' + (date1.getMonth() + 1)).slice(-2) + '/' + date1.getFullYear();
      //console.log(formattedDate1);
      return (yesterdayDate / 1000) === timestamp1;
      //return formattedDate1 < formattedDate
      //return date.appointmentDetails.appointmentDate < presentDate
    })

  }
  fetchThisWeekTests() {
    console.log("fetchThisWeekTests Called...");
    this.isValue = 3;
    let thisWeekDate = new Date().getDate;
    console.log("thisWeekDate date...", thisWeekDate);

    function startOfWeek(date) {
      var diff = date.getDate() - date.getDay() + (date.getDay() === 0 ? -6 : 1);

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

    dt = new Date();

    console.log(endOfWeek(dt).toString());


    this.listOfTestRecords = this.filteredlistOfTestRecords.filter(date => {
      var timestamp1 = date.testedTime;
      console.log(timestamp1);
      console.log(weekStartDay, presentDate)
      return weekStartDay < timestamp1 && presentDate > timestamp1;
    })

  }
  fetchThisMonthTests() {
    console.log("fetchThisMonthTests Called...");
    this.isValue = 4;
    let thisMonthDate = new Date().getMonth();
    console.log("thisMonthDate date...", thisMonthDate);

    var date = new Date();
    var firstDay = new Date(date.getFullYear(), date.getMonth(), 2);
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
      return (startOfTheMonth / 1000) < timestamp1 && (endOfTheMonth / 1000) > timestamp1;
    })


  }
  showAllTests() {
    this.isValue = 5;
    this.listOfTestRecords = this.filteredlistOfTestRecords.filter(date => {
      var timestamp1 = date.testedTime;
      console.log(timestamp1);
      return timestamp1;
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

}
