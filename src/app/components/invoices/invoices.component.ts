import { Component, OnInit } from '@angular/core';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';
import { PatientService } from 'src/app/services/patient.service';
import { HttpErrorResponse } from '@angular/common/http';
import { LoginService } from 'src/app/services/login.service';
import { MatSnackBar } from '@angular/material';
import { Router } from '@angular/router';
import { debugOutputAstAsTypeScript } from '@angular/compiler';

interface SearchByValue {
  viewValue: string;
}

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.css']
})
export class InvoicesComponent implements OnInit {
  signInRes: any;
  signObj: any;
  userID: string;
  patientObj: any;
  addServiceForm: FormGroup;
  viewServiceForm: FormGroup;
  editServiceForm: FormGroup;
  selectPatientForm: FormGroup;
  selectDatesForm: FormGroup;
  editSelectPatientForm: FormGroup;
  editSelectDatesForm: FormGroup;
  selectedRow: any;
  selectedData: any;
  term: any;
  selected = 'All';
  titleArray: any =
    {
      title: "Admin Center",
      subTitle: "Invoices",
      img: "assets/images/ui/Icons/1x/admin center.png"
    };
  patients: any = [];
  filteredPatients: any = [];
  dateToShow: any;
  dateToShow2: any;
  isLoading: boolean = false;
  loading: boolean;
  indexValue: any;
  subTotalAmount: number = 0;
  editSubTotalAmount: number = 0;
  fetchedSubTotalAmount: number = 0;
  fetchedVat: number = 0;
  fetchedTotalAmount: number = 0;
  totalAmount: number = 0;
  editTotalAmount: number = 0;
  editVat = 0;
  vat: number = 0;
  fetchedListOfServicesData: any = [];
  searchByValue: SearchByValue[] = [
    { viewValue: 'All' },
    { viewValue: 'Draft' },
    { viewValue: 'Paid' },
    { viewValue: 'Unpaid' },
    { viewValue: 'Overdue' }
  ];
  invoicesData: any = [];
  filteredInvoicesData: any = [];
  listOfServices: any = [];
  filteredListOfServices: any = [];
  fetchedListOfServices: any = [];
  mainServiceData: Array<any> = [];
  fetchedServicesDaya: Array<any> = [];
  selectedTest: any;
  closeResult: string;
  timestamp1: any;
  timestamp2: any;
  disableIcons: boolean = true;
  content: any;
  constructor(private fb: FormBuilder, private modalService: NgbModal,
    private patientService: PatientService, private loginService: LoginService,
    private _snackBar: MatSnackBar, private router: Router) { }

  ngOnInit() {
    this.signInRes = localStorage.getItem("SignInRes");
    this.signObj = JSON.parse(this.signInRes);
    this.userID = localStorage.getItem('userID');
    this.fetchListOfServicesData();
    this.fetchInvoicesData();
    if (this.signObj && this.signObj.hospitalAdmin) {
      let getPatientsData = {
        "byWhom": "admin",
        "byWhomID": this.signObj.hospitalAdmin.userID,
        "category": "All",
        "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
        "token": this.signObj.access_token
      }
      this.getPatientData(getPatientsData)
    }
    else {
      let getPatientsDataObj = {
        "byWhom": "medical personnel",
        "byWhomID": this.signObj.medicalPersonnel.profile.userProfile.medical_personnel_id,
        "category": "all",
        "hospital_reg_num": this.signObj.medicalPersonnel.profile.userProfile.hospital_reg_num,
        "token": this.signObj.access_token
      }
      this.getPatientData(getPatientsDataObj);
    }
    this.loading = true;
    this.selectedData = this.invoicesData
    this.showData;
    console.log("Invoices Data : ", this.invoicesData);

    this.addServiceForm = this.fb.group({
      serviceHistory: this.fb.array([

      ])
    });
    this.addService();

    this.viewServiceForm = this.fb.group({
      viewServiceHistory: this.fb.array([

      ])
    });

    this.editServiceForm = this.fb.group({
      editServiceHistory: this.fb.array([

      ])
    });

    this.selectPatientForm = this.fb.group({
      patientName: [""],
      emailID: [""],
      phoneNumber: [""],
      address: [""]
    })
    this.editSelectPatientForm = this.fb.group({
      patientName: [""],
      emailID: [""],
      phoneNumber: [""],
      address: [""]
    })

    this.selectDatesForm = this.fb.group({
      invoiceNumber: [""],
      invoiceDate: [""],
      paymentDueDate: [""]
    })
    this.editSelectDatesForm = this.fb.group({
      invoiceNumber: [""],
      invoiceDate: [""],
      paymentDueDate: [""]
    })

  }

  printPage(id) {
    if (this.disableIcons === true) {
      this.disableIcons = false;
    }

    let prntPage = document.getElementById('content').innerHTML;
    let originalContent = document.body.innerHTML;
    document.body.innerHTML = prntPage;
    window.print();
    location.reload()

  }

  callPaymentTransactions() {
    console.log(" called callPaymentTransactions method...");
    //alert("from payment txns ");
    this.router.navigateByUrl('/admincenter/paymentTransactions');
  }

  //Patch Family History
  patchFamilyHistory(fetchedListOfServices) {

    //console.log("ViewService Data",this.viewServiceData.value)
    this.mainServiceData = []
    for (let i: number = 0; i <= fetchedListOfServices.length - 1; i++) {
      this.mainServiceData.push(
        {
          serviceName: fetchedListOfServices[i].serviceName,
          cost: fetchedListOfServices[i].serviceNetCost,
          units: fetchedListOfServices[i].serviceUnit,
          vat: fetchedListOfServices[i].serviceVAT,
          amount: fetchedListOfServices[i].serviceGrossCost
        }
      )
    }
  }

  //Patch Family History
  patchFetchedService(fetchedListOfServices) {
    console.log(this.editServiceData.value);
    for (let i = 0; i <= this.editServiceData.value.length - 1; i++) {

      this.editServiceData.removeAt(i);
    }
    //this.editServiceData.removeAt(this.editServiceData.value.length-1);
    console.log(this.editServiceData.value);
    console.log("fetched services data : ", fetchedListOfServices.length);

    for (let i: number = 0; i <= fetchedListOfServices.length - 1; i++) {
      this.editServiceData.push(
        this.fb.group({
          serviceID: fetchedListOfServices[i].serviceID,
          serviceName: fetchedListOfServices[i].serviceName,
          cost: fetchedListOfServices[i].serviceNetCost,
          units: fetchedListOfServices[i].serviceUnit,
          vat: fetchedListOfServices[i].serviceVAT,
          // amount: fetchedListOfServices[i].serviceGrossCost
          amount: fetchedListOfServices[i].serviceGrossCost
        })
      )
    } console.log(this.editServiceData.value);

  }

  //Fetch patients data
  getPatientData(obj) {
    this.patientService.getPatientData(obj).subscribe(
      (res) => {
        console.log(res)
        if (res.response === 3) {
          this.loading = false;
          this.patients = res.patients;
          this.filteredPatients = this.patients;
          console.log("patients data : ", this.patients);
        } else if (res.response === 0) {
          this.loading = false;
        }
      }, (err: HttpErrorResponse) => {
        if (err.error instanceof Error) {
          this.loading = false;
          console.log("Client Side Error")
        } else {
          this.loading = false;
          console.log(err)
        }
      })
  }

  //get Allergie
  get serviceData() {
    return <FormArray>this.addServiceForm.get('serviceHistory')
  }

  get editServiceData() {
    return <FormArray>this.editServiceForm.get('editServiceHistory')
  }
  //Add Allergie
  addService() {
    this.serviceData.push(this.fb.group({
      serviceID: [""],
      serviceName: [""],
      cost: [""],
      units: [""],
      vat: [""],
      amount: [""]
    }))
  }

  //Add row to the fetched services data
  editViewService() {
    this.editServiceData.push(this.fb.group({
      serviceID: [""],
      serviceName: [""],
      cost: [""],
      units: [""],
      vat: [""],
      amount: [""]
    }))
  }
  //Remove Allergie removeService
  removeService(index) {
    this.serviceData.removeAt(index);
    console.log(this.serviceData.value);
    this.subTotalAmount = 0;
    this.vat = 0;
    this.totalAmount = 0;
    for (let i = 0; i <= this.serviceData.value.length - 1; i++) {
      console.log("Service Array", this.serviceData.value[i].amount);
      let numberValue: number = 0;
      let totalValue: number = 0;

      this.vat += (parseFloat(this.serviceData.value[i].cost) / 10) * parseFloat(this.serviceData.value[i].units);
      totalValue = parseFloat(this.serviceData.value[i].amount);
      numberValue = (parseFloat(this.serviceData.value[i].cost) * parseFloat(this.serviceData.value[i].units))//- parseFloat(this.serviceData.value[i].vat);
      this.subTotalAmount += numberValue;
      this.totalAmount += totalValue
      console.log(this.subTotalAmount);

    }

  }
  removeService1(index) {
    this.editServiceData.removeAt(index);
    console.log(this.editServiceData.value);

    this.editSubTotalAmount = 0;
    this.editVat = 0;
    this.editTotalAmount = 0;
    for (let i = 0; i <= this.editServiceData.value.length - 1; i++) {
      console.log("Service Array", this.editServiceData.value[i].amount);
      let numberValue: number = 0;
      let totalValue: number = 0;
      this.editVat += parseFloat(this.editServiceData.value[i].vat);
      totalValue += parseFloat(this.editServiceData.value[i].amount);
      numberValue = parseFloat(this.editServiceData.value[i].amount);
      this.editSubTotalAmount += numberValue;
      this.editTotalAmount += totalValue + parseFloat(this.editServiceData.value[i].vat);//+ this.editVat
      console.log(this.editSubTotalAmount);
    }
  }

  findText(term: string) {
    this.invoicesData;
    this.filteredInvoicesData;
    if (!term) {
      this.invoicesData = this.filteredInvoicesData;
    } else {
      this.invoicesData = this.filteredInvoicesData.filter(x =>
        x.clientDetails.name.trim().toLowerCase().startsWith(term.trim().toLowerCase())
      );
    }
  }

  showData(letSearch: string) {
    console.log("Print Value", letSearch);
    if (letSearch == "All") {
      //this.term = ""
      this.invoicesData = this.filteredInvoicesData.filter(x =>
        x.paymentStatus
      );
    } else {
      //this.term = letSearch
      this.invoicesData = this.filteredInvoicesData.filter(x =>
        x.paymentStatus.trim().toLowerCase().startsWith(letSearch.trim().toLowerCase())
      );
    }
  }

  searchService(term: string) {
    if (!term) {
      this.filteredListOfServices = this.listOfServices;
    } else {
      this.filteredListOfServices = this.listOfServices.filter(x =>
        x.serviceName.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
    }
  }

  searchService1(term: string) {
    if (!term) {
      this.filteredListOfServices = this.listOfServices;
    } else {
      this.filteredListOfServices = this.listOfServices.filter(x =>
        x.serviceName.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
    }
  }

  selectServiceFromList(value: any) {

    console.log(value);
    let index = -1
    index = this.listOfServices.findIndex(val => {
      return val.serviceName === value.serviceName
    })
    if (index != -1) {
      this.listOfServices = this.listOfServices[index];
      this.serviceData.at(this.indexValue).patchValue({
        serviceID: value.serviceID,
        serviceName: value.serviceName,
        cost: value.serviceCost,
        units: value.units,
        vat: value.serviceVATPercent,
        amount: parseInt(value.units) + parseInt(value.serviceVATPercent)
      })
    }

    // this.serviceData.at(this.indexValue).patchValue({
    //   serviceID: value.serviceID,
    //   serviceName: value.serviceName,
    //   cost: value.serviceCost,
    //   units: value.units,
    //   vat: value.serviceVATPercent,
    //   amount: parseInt(value.units) + parseInt(value.serviceVATPercent)
    // })

    console.log("After for total amount : ", this.subTotalAmount);
  }

  selectServiceFromList1(value: any) {

    this.editServiceData.at(this.indexValue).patchValue({
      serviceID: value.serviceID,
      serviceName: value.serviceName,
      cost: value.serviceCost,
      units: value.units,
      vat: value.serviceVATPercent,
      amount: parseInt(value.units) + parseInt(value.serviceVATPercent)
    })
    console.log(value);

  }

  selectPatientFromList(value: any) {
    console.log(value);
    let index = -1
    index = this.patients.findIndex(val => {
      return val.patientID === value.patientID
    })
    if (index != -1) {
      this.patientObj = this.patients[index]
      console.log("medicalPersonnelObj obj", this.patientObj)
      this.selectPatientForm.patchValue({
        patientName: this.patientObj.firstName + " " + this.patientObj.lastName,
        emailID: this.patientObj.emailID,
        phoneNumber: this.patientObj.phoneNumber.countryCode + " " + this.patientObj.phoneNumber.phoneNumber,
        address: this.patientObj.address
      })

      //this.modalService.close();
      //this.modalService.dismissAll()
    }
  }


  searchDoctor(term: string) {
    if (!term) {
      this.filteredPatients = this.patients;
    } else {
      this.filteredPatients = this.patients.filter(x =>
        x.firstName.trim().toLowerCase().includes(term.trim().toLowerCase())
      );
    }
  }

  openCreateInvoiceModal(viewCreateInvoiceContent) {
    this.modalService.open(viewCreateInvoiceContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "lg", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      this.addServiceForm.reset();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      this.addServiceForm.reset();
    });
  }
  //View Invoice Modal
  openViewModal(viewContent, selectedInvoicesData) {
    console.log(selectedInvoicesData);
    this.fetchedListOfServices = selectedInvoicesData.serviceItems;
    console.log("FetchedListOf", this.fetchedListOfServices);
    this.patchFamilyHistory(this.fetchedListOfServices)

    this.modalService.open(viewContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "lg", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;

    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;

    });
  }

  //Edit Modal
  openEditModal(editContent, selectedInvoicesData) {
    this.fetchedListOfServicesData = [];
    this.editSelectPatientForm.patchValue({
      patientName: selectedInvoicesData.clientDetails.name,
      emailID: selectedInvoicesData.clientDetails.emailID,
      phoneNumber: selectedInvoicesData.clientDetails.phoneNumber.countryCode + " " + selectedInvoicesData.clientDetails.phoneNumber.phoneNumber,
      address: selectedInvoicesData.clientDetails.address
    });
    this.timestamp1 = selectedInvoicesData.invoiceIssueDate; // replace your timestamp
    var date1 = new Date(this.timestamp1 * 1000);
    this.dateToShow = ('0' + date1.getFullYear()).slice(-2) + '-' + ('0' + (date1.getMonth() + 1)).slice(-2) + '-' + date1.getDate();

    this.timestamp2 = selectedInvoicesData.invoicePaymentDueDate; // replace your timestamp
    var date1 = new Date(this.timestamp2 * 1000);
    this.dateToShow2 = ('0' + date1.getFullYear()).slice(-2) + '-' + ('0' + (date1.getMonth() + 1)).slice(-2) + '-' + date1.getDate();

    this.editSelectDatesForm.patchValue({
      invoiceNumber: selectedInvoicesData.invoiceNumber,
    });

    this.fetchedListOfServicesData = selectedInvoicesData.serviceItems;
    console.log(this.fetchedListOfServicesData);
    this.patchFetchedService(this.fetchedListOfServicesData)
    this.editSubTotalAmount = 0;
    this.editTotalAmount = 0;
    this.editVat = 0;
    for (let i = 0; i <= this.fetchedListOfServicesData.length - 1; i++) {
      console.log("Service data : ", this.fetchedListOfServicesData[i]);
      let numberValue: number = 0;
      let totalValue: number = 0;
      this.editVat += parseInt(this.fetchedListOfServicesData[i].serviceVAT);
      totalValue += parseFloat(this.fetchedListOfServicesData[i].serviceGrossCost);
      numberValue = parseFloat(this.fetchedListOfServicesData[i].serviceGrossCost);
      this.editSubTotalAmount += numberValue;
      this.editTotalAmount += totalValue + parseInt(this.fetchedListOfServicesData[i].serviceVAT);
    }

    console.log("Edit Total Amount : ", this.editTotalAmount);


    this.modalService.open(editContent, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "lg", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
      for (let i = 0; i <= this.editServiceData.value.length - 1; i++) {
        this.removeService1(this.editServiceData.value[i])
        console.log(this.editServiceData.value.length);
      }
      console.log(this.editServiceData.value.length);

      this.editServiceForm.reset();
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      for (let i = 0; i <= this.editServiceData.value.length - 1; i++) {
        this.removeService1(this.editServiceData.value[i])
        console.log(this.editServiceData.value.length);
      }
      console.log(this.editServiceData.value.length);

      this.editServiceForm.reset();
    });
  }

  sendInvoiceToClient(selectedInvoicesData) {
    this.isLoading = true;
    console.log("the invoice data to send : " + selectedInvoicesData.clientDetails.emailID);
    let objDataToSend = {
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
      "invoiceNumber": selectedInvoicesData.invoiceNumber
    }
    console.log(objDataToSend);
    this.loginService.sendInvoiceData(objDataToSend, this.signObj.access_token).
      subscribe(
        (res) => {
          console.log("res for send invoices data  : ", res)
          if (res.response === 3) {
            this.isLoading = false;
            this.loading = false;
            console.log("send invoice success response : ", res.response);
            this.openSnackBar(res.message, "");//+" to ",selectedInvoicesData.clientDetails.name
            this.modalService.dismissAll();
          }
          else if (res.response === 0) {
            this.isLoading = false;
            this.loading = false;
            console.log("send invoice failure response : ", res.response);
            this.openSnackBar1(res.message, "");
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log(err)
          }
        })
  }

  sendReminderToClient(selectedInvoicesData) {
    console.log("the invoice data to send reminder : " + selectedInvoicesData.clientDetails.emailID);
    this.isLoading = true;
    let objDataToSendReminder = {
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
      "invoiceNumber": selectedInvoicesData.invoiceNumber
    }
    console.log(objDataToSendReminder);
    this.loginService.sendReminderInvoiceData(objDataToSendReminder, this.signObj.access_token).
      subscribe(
        (res) => {
          console.log("res for send invoices reminder data  : ", res)
          if (res.response === 3) {
            this.isLoading = false;
            this.loading = false;
            console.log("send invoice reminder success response : ", res.response);
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
          }
          else if (res.response === 0) {
            this.isLoading = false;
            this.loading = false;
            console.log("send invoice reminder failure response : ", res.response);
            this.openSnackBar1(res.message, "");
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log(err)
          }
        })
  }

  openSendInvoiceModal(sendInvoiceContent, selectedInvoicesData) {
    console.log("the invoice data to send : " + selectedInvoicesData.clientDetails.emailID);

    this.modalService.open(sendInvoiceContent, { centered: true, size: "md", backdrop: false })
  }

  //Delete Modal
  openDeleteModal(deleteContent, selectedInvoicesData) {
    this.modalService.open(deleteContent, { centered: true, size: "md", backdrop: false })
  }

  //Send Reminder Modal
  openSendReminderModal(sendReminderContent, selectedInvoicesData) {
    this.modalService.open(sendReminderContent, { centered: true, size: "md", backdrop: false })
  }

  //Open ServicesList Model
  openServiceMethod(serviceModel, index) {
    this.indexValue = index;
    console.log("the index value : ", this.indexValue);

    this.modalService.open(serviceModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }
  //Open ServicesList Model
  openServiceMethod1(serviceModel1, index) {
    this.indexValue = index;
    console.log("the index value : ", this.indexValue);

    this.modalService.open(serviceModel1, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md" }).result.then((result) => {
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }

  calculateAmount1() {
    let calculatedAmount: Number = this.serviceData.at(this.indexValue).value.cost *
      this.serviceData.at(this.indexValue).value.units + ((parseInt((this.serviceData.at(this.indexValue).value.cost))) * this.serviceData.at(this.indexValue).value.units / 10);
    //parseInt(this.serviceData.at(this.indexValue).value.vat);

    console.log("the Amount value with VAT is : ", calculatedAmount);
    this.serviceData.at(this.indexValue).patchValue({
      amount: "" + calculatedAmount
    })

    console.log(this.serviceData);
    this.subTotalAmount = 0;
    this.vat = 0;
    this.totalAmount = 0;
    for (let i = 0; i <= this.serviceData.value.length - 1; i++) {
      console.log("Service Array", this.serviceData.value[i].amount);
      let numberValue: number = 0;
      let totalValue: number = 0;
      this.vat += (parseFloat(this.serviceData.value[i].cost) * parseFloat(this.serviceData.value[i].units)) / 10;
      totalValue = parseFloat(this.serviceData.value[i].amount)
      numberValue = (parseFloat(this.serviceData.value[i].cost) * parseFloat(this.serviceData.value[i].units)); //- (parseFloat(this.serviceData.value[i].amount) / 10) //- parseFloat(this.serviceData.value[i].vat)
      this.subTotalAmount += numberValue;
      this.totalAmount += totalValue;
      console.log(this.subTotalAmount);
    }
    console.log(this.subTotalAmount);
  }
  calculateAmount11() {
    console.log("cost data : ", this.editServiceData.at(this.indexValue));
    let calculatedAmount: Number = this.editServiceData.at(this.indexValue).value.cost *
      this.editServiceData.at(this.indexValue).value.units;
    // + parseInt(this.editServiceData.at(this.indexValue).value.vat);;
    console.log("the Amount value is : ", calculatedAmount);
    this.editServiceData.at(this.indexValue).patchValue({
      amount: "" + calculatedAmount
    })
    this.editSubTotalAmount = this.editSubTotalAmount +
      parseInt(this.editServiceData.at(this.indexValue).value.amount, 10);
    this.editTotalAmount = this.editSubTotalAmount + this.editVat;

  }
  calculateAmount12() {
    // let calculatedAmount: Number = this.editServiceData.at(this.indexValue).value.cost *
    //  this.editServiceData.at(this.indexValue).value.units;
    let calculatedAmount: number = this.editServiceData.at(this.indexValue).value.cost *
      this.editServiceData.at(this.indexValue).value.units +
      parseInt(this.editServiceData.at(this.indexValue).value.vat);
    console.log("the Amount value is : ", calculatedAmount);
    this.editServiceData.at(this.indexValue).patchValue({
      amount: "" + calculatedAmount
    })
    console.log(this.editServiceData);
    this.editSubTotalAmount = 0;
    this.editVat = 0;
    this.editTotalAmount = 0;
    for (let i = 0; i <= this.editServiceData.value.length - 1; i++) {
      console.log("Service Array", this.editServiceData.value[i].amount);
      let numberValue: number = 0;
      let totalValue: number = 0;
      this.editVat += parseFloat(this.editServiceData.value[i].vat);
      totalValue += parseFloat(this.editServiceData.value[i].amount);
      numberValue = parseFloat(this.editServiceData.value[i].amount);
      //numberValue += parseFloat(this.editServiceData.value[i].amount);

      this.editSubTotalAmount += numberValue;
      this.editTotalAmount += totalValue + parseFloat(this.editServiceData.value[i].vat);//+ this.editVat
      console.log(this.editSubTotalAmount);
    }
    var editTotalAmountValue: any = (Math.round(this.editTotalAmount * 100) / 100).toFixed(2);
    this.editTotalAmount = editTotalAmountValue;
    console.log((Math.round(this.editTotalAmount * 100) / 100).toFixed(2));
  }
  onSearchChange1(searchValue: string): void {
    console.log("keyup value weight : ", searchValue);
    this.calculateAmount1();
  }
  onSearchChange12(searchValue: string): void {
    console.log("keyup value weight : ", searchValue);
    this.calculateAmount12();
  }

  fetchListOfServicesData() {
    let fetchedListOfServicesObj = {
      "requestedByWhom": "admin",
      "requestedPersonID": this.signObj.hospitalAdmin.userID,
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num
    }
    this.loginService.getServicesData(fetchedListOfServicesObj, this.signObj.access_token).
      subscribe(
        (res) => {
          console.log("res for fetch services data  : ", res)
          if (res.response === 3) {
            this.loading = false;
            this.listOfServices = res.services;
            this.filteredListOfServices = res.services;
          }
          else if (res.response === 0) {
            this.loading = false;
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.loading = false;
            console.log("Client Side Error")
          } else {
            this.loading = false;
            console.log(err)
          }
        })
  }

  fetchInvoicesData() {
    this.loading = true;
    let fetchedInvoicesObj = {
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num
    }
    this.loginService.fetchInvoicesData(fetchedInvoicesObj, this.signObj.access_token).
      subscribe(
        (res) => {
          console.log("res for fetch invoices data  : ", res)
          if (res.response === 3) {
            this.loading = false;
            this.invoicesData = res.invoices;
            this.filteredInvoicesData = this.invoicesData;
          }
          else if (res.response === 0) {
            this.loading = false;
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.loading = false;
            console.log("Client Side Error")
          } else {
            this.loading = false;
            console.log(err)
          }
        })
  }

  deleteInvoiceMethod(selectedInvoicesData) {
    console.log(selectedInvoicesData.invoiceNumber);
    this.isLoading = true;
    let deleteInvoiceObjData = {
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
      "invoiceNumber": selectedInvoicesData.invoiceNumber
    }
    this.loginService.deleteInvoicesData(deleteInvoiceObjData, this.signObj.access_token).
      subscribe(
        (res) => {
          console.log("res for delete invoices data  : ", res)
          if (res.response === 3) {
            this.fetchInvoicesData();
            this.isLoading = false;
            this.loading = false;
            console.log("delete invoice success response : ", res.response);
            this.openSnackBar(res.message, "");
            this.modalService.dismissAll();
          }
          else if (res.response === 0) {
            this.isLoading = false;
            this.loading = false;
            console.log("delete invoice failure response : ", res.response);
            this.openSnackBar1(res.message, "");
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log(err)
          }
        })
  }

  addInvoiceSubmit() {
    this.isLoading = true;
    console.log("payload data : ", this.addServiceForm.value.serviceHistory);

    let payLoad = this.addServiceForm.value.serviceHistory;
    let serviceHistoryArray: any[] = [];
    for (let i: number = 0; i <= payLoad.length - 1; i++) {
      serviceHistoryArray.push(
        {
          "serviceID": payLoad[i].serviceID,
          "serviceName": payLoad[i].serviceName,
          "serviceNetCost": payLoad[i].cost,
          "serviceUnit": "" + payLoad[i].units,
          "serviceVAT": payLoad[i].vat,
          "serviceGrossCost": "" + payLoad[i].amount,
          "category": "Human",
        }
      )
    }
    let payLoad2 = this.selectPatientForm.value;
    console.log("serviceHistoryArray data from form : ", serviceHistoryArray, payLoad2);
    let ngbDate = this.selectDatesForm.controls['invoiceDate'].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split('/');
    var newDate = dateAr[2] + '/' + dateAr[0] + '/' + dateAr[1];
    var invoiceDate = new Date(newDate).getTime() / 1000;
    let ngbDate1 = this.selectDatesForm.controls['paymentDueDate'].value;
    let myDate1 = new Date(ngbDate1.year, ngbDate1.month - 1, ngbDate1.day);
    var dateAr1 = myDate1.toLocaleDateString().split('/');
    var newDate1 = dateAr1[2] + '/' + dateAr1[0] + '/' + dateAr1[1];
    var paymentDueDate = new Date(newDate1).getTime() / 1000;

    console.log("invoice date is : ", invoiceDate, paymentDueDate);
    console.log("total amount is : ", this.subTotalAmount);

    let addIllnessObj = {
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "invoiceNumber": this.selectDatesForm.value.invoiceNumber,
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
      "invoiceIssueDate": "" + invoiceDate,
      "invoicePaymentDueDate": "" + paymentDueDate,
      "subTotal": "" + this.subTotalAmount,
      "VAT": "" + this.vat,
      "totalAmount": "" + this.totalAmount,
      "isSavedInDraft": false,
      "paymentStatus": "unpaid",
      "clientDetails": {
        "name": this.patientObj.firstName,
        "phoneNumber": {
          "countryCode": this.patientObj.phoneNumber.countryCode,
          "phoneNumber": this.patientObj.phoneNumber.phoneNumber
        },
        "emailID": this.patientObj.emailID,
        "address": this.patientObj.address
      },
      "serviceItems": serviceHistoryArray
    }
    console.log("the req for add invoice data obj : ", addIllnessObj);
    this.loginService.addInvoiceData(addIllnessObj, this.signObj.access_token).
      subscribe(
        (res) => {
          console.log("res from add invoice  : ", res)
          if (res.response === 3) {
            this.isLoading = false;
            this.loading = false;
            this.modalService.dismissAll();
            this.openSnackBar(res.message, "");
            console.log(res.response);
            this.fetchInvoicesData();
          }
          else if (res.response === 0) {
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar1(res.message, "");
            console.log(res.response);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log(err)
          }
        })
  }

  updateInvoiceSubmit() {
    this.isLoading = true;
    console.log("payload data : ", this.editServiceForm.value.editServiceHistory);

    let payLoad = this.editServiceForm.value.editServiceHistory;
    let serviceHistoryArray: any[] = [];
    for (let i: number = 0; i <= payLoad.length - 1; i++) {
      serviceHistoryArray.push(
        {
          "serviceID": payLoad[i].serviceID,
          "serviceName": payLoad[i].serviceName,
          "serviceNetCost": payLoad[i].cost,
          "serviceUnit": "" + payLoad[i].units,
          "serviceVAT": payLoad[i].vat,
          "serviceGrossCost": "" + payLoad[i].amount,
          "category": "Human",
        }
      )
    }
    let payLoad2 = this.editSelectPatientForm.value;
    console.log("serviceHistoryArray data from form to update : ", serviceHistoryArray, payLoad2);
    let ngbDate = this.editSelectDatesForm.controls['invoiceDate'].value;
    let myDate = new Date(ngbDate.year, ngbDate.month - 1, ngbDate.day);
    var dateAr = myDate.toLocaleDateString().split('/');
    var newDate = dateAr[2] + '/' + dateAr[0] + '/' + dateAr[1];
    var invoiceDate = new Date(newDate).getTime() / 1000 || this.timestamp1;
    let ngbDate1 = this.editSelectDatesForm.controls['paymentDueDate'].value;
    let myDate1 = new Date(ngbDate1.year, ngbDate1.month - 1, ngbDate1.day);
    var dateAr1 = myDate1.toLocaleDateString().split('/');
    var newDate1 = dateAr1[2] + '/' + dateAr1[0] + '/' + dateAr1[1];
    var paymentDueDate = new Date(newDate1).getTime() / 1000 || this.timestamp2;

    console.log("invoice date is : ", invoiceDate, paymentDueDate);
    console.log("invoice & payment dates without calender : " + this.timestamp1, this.timestamp2);

    console.log("total amount is : ", this.editSubTotalAmount);

    let phoneNumber = payLoad2.phoneNumber.split(" ");

    let addIllnessObj = {
      "byWhom": "admin",
      "byWhomID": this.signObj.hospitalAdmin.userID,
      "invoiceNumber": this.editSelectDatesForm.value.invoiceNumber,
      "hospital_reg_num": this.signObj.hospitalAdmin.hospital_reg_num,
      "invoiceIssueDate": "" + invoiceDate,
      "invoicePaymentDueDate": "" + paymentDueDate,
      "subTotal": "" + this.editSubTotalAmount,
      "VAT": "" + this.editVat,
      "totalAmount": "" + this.editTotalAmount,
      "isSavedInDraft": false,
      "paymentStatus": "unpaid",
      "clientDetails": {
        "name": payLoad2.patientName,
        "phoneNumber": {
          "countryCode": phoneNumber[0],
          "phoneNumber": phoneNumber[1]
        },
        "emailID": payLoad2.emailID,
        "address": payLoad2.address
      },
      "serviceItems": serviceHistoryArray
    }
    console.log("the req for add invoice data obj : ", addIllnessObj);
    this.loginService.updateInvoiceData(addIllnessObj, this.signObj.access_token).
      subscribe(
        (res) => {
          console.log("res from update invoice  : ", res)
          if (res.response === 3) {
            this.isLoading = false;
            this.loading = false;
            this.modalService.dismissAll();
            this.openSnackBar(res.message, "");
            console.log(res.response);
            this.fetchInvoicesData();
          }
          else if (res.response === 0) {
            this.isLoading = false;
            this.loading = false;
            this.openSnackBar1(res.message, "");
            console.log(res.response);
          }
        },
        (err: HttpErrorResponse) => {
          if (err.error instanceof Error) {
            this.isLoading = false;
            this.loading = false;
            console.log("Client Side Error")
          } else {
            this.isLoading = false;
            this.loading = false;
            console.log(err)
          }
        })
  }

  //Open PatientsList Model
  openPatientMethod(patientsModel) {
    this.modalService.open(patientsModel, { ariaLabelledBy: 'modal-basic-title', centered: true, size: "md", backdrop: false }).result.then(
      (result) => {
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

  deleteProject() {

  }

  onTabChange($event) {

  }
  closeView() {

  }

  addRow() {

  }

  //Mat Snack Bar
  openSnackBar(message: string, action: string) {
    this._snackBar.open(message, action, {
      panelClass: ['theme-snackbar'],
      duration: 5000,
      verticalPosition: "bottom", // 'top' | 'bottom'
      horizontalPosition: "right", //'start' | 'center' | 'end' | 'left' | 'right'
    });
  }

  //Mat Snack Bar
  openSnackBar1(message: string, action: string) {
    this._snackBar.open(message, action, {
      panelClass: ['red-snackbar'],
      duration: 5000,
      verticalPosition: "bottom", // 'top' | 'bottom'
      horizontalPosition: "right", //'start' | 'center' | 'end' | 'left' | 'right'
    });
  }
}
