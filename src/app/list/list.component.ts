import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { SessionService } from '../services/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  @ViewChild('modal') modal: ElementRef;
  @ViewChild('settingModal') settingModal: ElementRef;

  public list;
  public user;
  public newItemName: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private sessionService: SessionService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.sessionService.getUser();
    this.list = this.user.selectedList;
  }

  public exitList() {
    this.sessionService.unsetSelectedList();
    this.router.navigateByUrl('/home');
  }

  public addItemModal() {
    this.modal.nativeElement.style.display = 'flex';
  }

  public cancelAddItem() {
    this.modal.nativeElement.style.display = 'none';
  }

  public openSettings() {
    this.settingModal.nativeElement.style.display = 'flex';
  }

  public closeSettings() {
    this.settingModal.nativeElement.style.display = 'none';
  }

  public createNewItem(name) {
    let item = {
      "name": name,
      "completed": false
    }
    let user = this.sessionService.getUser();
    this.firebaseService.addItem(user, item);
    this.modal.nativeElement.style.display = 'none';
    this.list.items = this.list.items.concat(item);
  }

  public deleteItem(index) {
    console.log("clicked");
    // delete list item from backend
    this.firebaseService.deleteItem(this.user, this.list.items[index]);
    // update list on frontend
    this.list.items = this.list.items.filter(item => item.name !== this.list.items[index].name);
  }

  // delete list from user data and session
  public deleteList() {
    // delete list from backend
    this.firebaseService.deleteList(this.user);
    // update lists on the frontend
    const lists = this.user.lists.filter(list => list.name !== list[this.user.selectedIndex].name);
    this.sessionService.setLists(lists);
    // route back to home
    this.router.navigateByUrl('/home');
  }
}
