import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  @ViewChild('modal') modal: ElementRef;

  public user;
  public lists: Array<any>;

  public newListName: string = '';

  // all errors possible for user on this component
  public errors = {
    listName: ''
  }

  constructor(
    private firebaseService: FirebaseService,
    private sessionService: SessionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.sessionService.getUser();
    this.lists = this.user.lists;
  }

  public viewList(listLocation: number) {
    this.sessionService.setSelectedIndex(listLocation);
    this.sessionService.setSelectedList(this.lists[listLocation]);
    this.router.navigateByUrl('/list');
  }

  public createListModal() {
    this.modal.nativeElement.style.display = 'flex';
  }

  public cancelCreate() {
    this.modal.nativeElement.style.display = 'none';
    this.errors.listName = '';
  }

  public finishCreate(user, newListName) {
    if (newListName === '') {
      this.errors.listName = 'A list must have a name.';
      return;
    }
    // add item to lists
    if (this.firebaseService.addList(user, newListName)) {
      this.errors.listName = '';
      // update session user and list
      this.user = this.sessionService.getUser();
      this.lists = this.user.lists;
      // view list
      this.router.navigateByUrl('/list');
    } else {
      this.errors.listName = 'It looks like a list with this name already exists.'
    }
  }

}
