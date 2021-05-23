import { Component, OnInit } from '@angular/core';
import { SessionService } from '../services/session.service';
import { ListService } from '../services/list.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  public user;
  public lists: Array<any>;

  constructor(
    private sessionService: SessionService,
    private listService: ListService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.sessionService.getUser();
    this.lists = this.user.lists;
  }

  public viewList(listLocation: number) {
    this.listService.setSelectedList(this.lists[listLocation]);
    this.router.navigateByUrl('/list');
  }

}
