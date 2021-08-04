import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-progress-bar',
  templateUrl: './progress-bar.component.html',
  styleUrls: ['./progress-bar.component.css']
})
export class ProgressBarComponent implements OnInit {

  @Input() stages: any;

  constructor() { }

  ngOnInit(): void {
  }

  public get completed(): number {
    let numCompleted = 0;
    this.stages.forEach(element => {
      if (element.completed === true) {
        numCompleted += 1;
      }
    });
    return numCompleted;
  }

}
