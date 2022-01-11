import { Component, Input, OnInit } from '@angular/core';
import { HeaderBreadcrumb } from '../models/common-models';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  @Input() headerBreadcrumbs:HeaderBreadcrumb[] = null;
  constructor() { }

  ngOnInit() {
  }

}
