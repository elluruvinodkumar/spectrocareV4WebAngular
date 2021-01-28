import { Component, OnInit } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

@Component({
  selector: 'app-payment-transactions',
  templateUrl: './payment-transactions.component.html',
  styleUrls: ['./payment-transactions.component.css']
})
export class PaymentTransactionsComponent implements OnInit {
  presentDate: string;
  paid: number;
  amount: number;
  theData: any;
  term: any;
  paymentsData: any = [
    { "Invoice": "AB-1001", "Client": "abc babu", "InvoiceDate": "08/06/2020", "PaymentDate": "10/06/2020", "Amount": "250", "Balance": "50", "TxFee": "10", "TxID": "2020060801", "PaymentMethod": "VISA", "CardNo": "1234123412341234", "Items": "Urine test", "Issuedate": "2020-03-13" },
    { "Invoice": "AB-1002", "Client": "def rani", "InvoiceDate": "08/06/2020", "PaymentDate": "10/06/2020", "Amount": "250", "Balance": "50", "TxFee": "10", "TxID": "2020060802", "PaymentMethod": "VISA", "CardNo": "1234123412341234", "Items": "Urine test", "Issuedate": "2020-03-13" },
    { "Invoice": "AB-1003", "Client": "ghijil khan rao", "InvoiceDate": "08/06/2020", "PaymentDate": "10/06/2020", "Amount": "250", "Balance": "50", "TxFee": "10", "TxID": "2020060803", "PaymentMethod": "VISA", "CardNo": "1234123412341234", "Items": "Urine test", "Issuedate": "2020-03-13" },
    { "Invoice": "AB-1004", "Client": "jkl vasundhar", "InvoiceDate": "08/06/2020", "PaymentDate": "10/06/2020", "Amount": "250", "Balance": "50", "TxFee": "10", "TxID": "2020060804", "PaymentMethod": "VISA", "CardNo": "1234123412341234", "Items": "Urine test", "Issuedate": "2020-03-13" },
    { "Invoice": "AB-1005", "Client": "mno flintoff", "InvoiceDate": "08/06/2020", "PaymentDate": "10/06/2020", "Amount": "250", "Balance": "50", "TxFee": "10", "TxID": "2020060805", "PaymentMethod": "VISA", "CardNo": "1234123412341234", "Items": "Urine test", "Issuedate": "2020-03-13" },
    { "Invoice": "AB-1006", "Client": "pqr prasuna", "InvoiceDate": "08/06/2020", "PaymentDate": "10/06/2020", "Amount": "250", "Balance": "50", "TxFee": "10", "TxID": "2020060806", "PaymentMethod": "VISA", "CardNo": "1234123412341234", "Items": "Urine test", "Issuedate": "2020-03-13" },
  ]

  constructor(private modalService: NgbModal,) { }

  ngOnInit() {
    this.presentDate = new Date().toLocaleDateString();
    this.theData = this.paymentsData;
  }


  openViewModal(viewContent, selectedInvoicesData) {
    this.paid = parseInt(selectedInvoicesData.Amount) - parseInt(selectedInvoicesData.Balance);
    this.amount = this.paid - parseInt(selectedInvoicesData.TxFee);
    this.modalService.open(viewContent, { centered: true, size: "md", backdrop: false })
  }

}
