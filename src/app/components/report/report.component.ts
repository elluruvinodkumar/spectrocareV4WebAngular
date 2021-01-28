import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-report',
  templateUrl: './report.component.html',
  styleUrls: ['./report.component.css']
})
export class ReportComponent implements OnInit {

  titleArray:any =
  {title:"Admin Center",
  subTitle:"Report",
img:"assets/images/ui/Icons/1x/admin center.png"};

  constructor() { }

  ngOnInit() {
  }

}
