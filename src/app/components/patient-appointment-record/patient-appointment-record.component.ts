import { Component, OnInit } from "@angular/core";
import { PatientProfileComponent } from "../patient-profile/patient-profile.component";
import { NgbModal, ModalDismissReasons } from "@ng-bootstrap/ng-bootstrap";
import { Router } from '@angular/router';
interface SearchByValue {
  viewValue: string;
}
@Component({
  selector: "app-patient-appointment-record",
  templateUrl: "./patient-appointment-record.component.html",
  styleUrls: ["./patient-appointment-record.component.css"],
})
export class PatientAppointmentRecordComponent implements OnInit {
  dateToShow: string;
  loading: boolean;
  patientAppointmentsData: any;
  selectedPatient: any;
  closeResult: string;

  selected = "All";
  searchByValue: SearchByValue[] = [{ viewValue: "All" }];

  constructor(
    private patientProfile: PatientProfileComponent,
    private modalService: NgbModal, private router: Router
  ) { }

  ngOnInit() {
    this.selectedPatient = this.patientProfile.selectedPatient
    this.dateToShow = new Date().toLocaleDateString();
    this.patientAppointmentsData = this.patientProfile.patientAppointmentsData;

  }
  callBookAppointment(selectedPatient) {
    this.router.navigate(['/admincenter/bookappointment'], {
      queryParams: {
        firstName: selectedPatient.firstName,
        countryCode: selectedPatient.phoneNumber.countryCode,
        phoneNumber: selectedPatient.phoneNumber.phoneNumber,
        emailID: selectedPatient.emailID,
        patientID: selectedPatient.patientID,
        medical_record_id: selectedPatient.medical_record_id
      }
    })
  }

  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return "by pressing ESC";
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return "by clicking on a backdrop";
    } else {
      return `with: ${reason}`;
    }
  }

  openViewMethod(viewModel) {
    this.modalService
      .open(viewModel, {
        ariaLabelledBy: "modal-basic-title",
        centered: true,
        size: "md", backdrop: false
      })
      .result.then(
        (result) => {
          this.closeResult = `Closed with: ${result}`;
        },
        (reason) => {
          this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  showData(event) { }
}
