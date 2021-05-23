import { Component, OnInit } from '@angular/core';
import { ListService } from '../services/list.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  public list;

  constructor(
    private listService: ListService
  ) { }

  ngOnInit(): void {
    this.list = this.listService.getSelectedList();
  }

}
