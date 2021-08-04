import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { GeneralService } from 'src/app/services/general.service';

@Component({
  selector: 'app-date-select',
  templateUrl: './date-select.component.html',
  styleUrls: ['./date-select.component.css']
})
export class DateSelectComponent implements OnInit {

  @Output() dateEvent = new EventEmitter<string>();

  @ViewChild('dateValue') dateValue: ElementRef;

  public dateSelected: Date;

  constructor(
    private generalService: GeneralService
  ) { }

  ngOnInit(): void {
    this.generalService.clearDate.subscribe(action => {
      if (action) {
        this.clearSelectedDate();
      }
    });
  }

  public dateChanged($event): void {
    this.dateSelected = $event;
    this.dateEvent.emit($event);
    this.dateSelected = undefined;
  }

  public clearSelectedDate(): void {
    this.dateValue.nativeElement.value = '';
  }

}
