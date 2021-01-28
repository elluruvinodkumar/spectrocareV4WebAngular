import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-billandpayment',
  templateUrl: './billandpayment.component.html',
  styleUrls: ['./billandpayment.component.css']
})
export class BillandpaymentComponent implements OnInit {

  titleArray:any =
  {title:"Admin Center",
  subTitle:"Bill & Payment",
img:"assets/images/ui/Icons/1x/admin center.png"};
  constructor() { }

  ngOnInit() {
  }

}
