import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-countdown',
  templateUrl: './countdown.component.html',
  styleUrls: ['./countdown.component.css']
})
export class CountdownComponent implements OnInit {

  @Input() stages: any;

  constructor() { }

  ngOnInit(): void {
  }

  public get remaining(): number {
    let numRemaining = 0;
    this.stages.forEach(element => {
      if (element.completed === false) {
        numRemaining += 1;
      }
    });
    return numRemaining;
  }

}
