import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
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
  term: any;
  listOfTestRecords = [
    {
      "id": "123",
      "name": "abc babu",
      "date": "18/1/2021",
      "time": "10:00 AM",
      "testname": "urine test",
      "total": "10",
      "normal": "8",
      "abnormal": "2",
      "testedby": "Dr. Sourav Ganguly"
    }
  ]
  closeResult: string;
  isDateVisible: boolean = false;
  hideDate: boolean = true;
  isValue: any;

  maxDate = "2018-08-28";
  minDate: '2016-08-28';
  constructor(private modalService: NgbModal,) { }

  ngOnInit() {

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
    // if (!term) {
    //   this.filteredPatients = this.patientsList;
    // } else {
    //   this.filteredPatients = this.patientsList.filter(x =>
    //     x.firstName.trim().toLowerCase().includes(term.trim().toLowerCase())
    //   );
    // }
  }
  findText(term: string) {
    // this.listOfAppointments;
    // this.filteredListOfAppointments;
    // if (!term) {
    //   this.listOfAppointments = this.filteredListOfAppointments;
    // } else {
    //   this.listOfAppointments = this.filteredListOfAppointments.filter(x =>
    //     x.patientDetails.firstName.trim().toLowerCase().startsWith(term.trim().toLowerCase())
    //   );
    // }
  }

  openCalender() {
    this.isDateVisible = !this.isDateVisible
  }
  callCustomWise() {
    //var x = document.getElementById("hideDates");
    // if (x.style.display === "none") {
    //   x.style
    // } else {
    //   x.style.display = "none";
    // }
  }

  fetchTodayTests() {
    console.log("fetchTodayTests Called...");
    this.isValue = 1;
    let todayDate = new Date().getTime();
    console.log("today date...", todayDate);
  }
  fetchYesterdayTests() {
    console.log("fetchYesterdayTests Called...");
    this.isValue = 2;
    let yesterdayDate = new Date().getDate();
    console.log("yesterdayDate date...", yesterdayDate - 1);
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

    function endOfWeek(date) {

      var lastday = date.getDate() - (date.getDay() - 1) + 6;
      return new Date(date.setDate(lastday));

    }

    dt = new Date();

    console.log(endOfWeek(dt).toString());


  }
  fetchThisMonthTests() {
    console.log("fetchThisMonthTests Called...");
    this.isValue = 4;
    let thisMonthDate = new Date().getMonth() + 1;
    console.log("thisMonthDate date...", thisMonthDate);
  }

  openDeleteTestMethod(viewDeleteTestModelContent, patient) {
    // this.isButton = false;
    this.modalService.open(viewDeleteTestModelContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'md', backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openViewTestReportMethod(viewTestReportModelContent, patient) {
    this.modalService.open(viewTestReportModelContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg', backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  openAddCommentMethod(openAddCommentModelContent, patient) {
    this.modalService.open(openAddCommentModelContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: 'lg', backdrop: false }).result.then((result) => {
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
