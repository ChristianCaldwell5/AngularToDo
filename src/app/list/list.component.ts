import { Component, ElementRef, EventEmitter, HostListener, OnInit, Output, ViewChild } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { SessionService } from '../services/session.service';
import { GeneralService } from 'src/app/services/general.service';
import { Router } from '@angular/router';
import { formatDate } from '@angular/common';

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
  public newItemTime: string = '';
  public isMobile: boolean;

  @HostListener('window:resize', ['$event'])
  getScreenSize(event?) {
    this.isMobile = window.innerWidth < 1030;
  }

  // add item modal fields
  public newItem = {
    name: '',
    dueDate: '',
    time: '',
    completed: false
  }

  // errors
  public errors = {
    itemName: ''
  }

  constructor(
    private firebaseService: FirebaseService,
    private sessionService: SessionService,
    private generalService: GeneralService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.user = this.sessionService.getUser();
    this.list = this.user.selectedList;
    this.getScreenSize();
  }

  public exitList() {
    this.sessionService.unsetSelectedList();
    this.router.navigateByUrl('/home');
  }

  public addItemModal() {
    this.modal.nativeElement.style.display = 'flex';
  }

  public cancelAddItem() {
    this.clearAddModal();
    this.modal.nativeElement.style.display = 'none';
  }

  public openSettings() {
    this.settingModal.nativeElement.style.display = 'flex';
  }

  public closeSettings() {
    this.settingModal.nativeElement.style.display = 'none';
  }

  public setSelectedDate(date: Date) {
    const dateString = formatDate(date, 'longDate', 'en-US');
    this.newItem.dueDate = dateString;
    //console.log("New item date: ", this.newItem.dueDate)
  }

  public createNewItem() {
    // error check
    this.errors.itemName = !this.newItemName ? "Item name is required" : '';
    if (this.errors.itemName) {
      return;
    }
    // set name
    this.newItem.name = this.newItemName;
    // convert date and set
    if (this.newItemTime) {
      const H = +this.newItemTime.substr(0,2);
      const h = H % 12 || 12;
      const suffix = (H < 12 || H === 24) ? "AM" : "PM";
      this.newItem.time = h + this.newItemTime.substr(2, 3) + suffix;
    }
    // get user
    let user = this.sessionService.getUser();
    // add to firebase
    this.firebaseService.addItem(user, this.newItem);
    // stop displaying modal
    this.modal.nativeElement.style.display = 'none';
    // add to frontend 
    this.list.items = this.list.items.concat(this.newItem);
    // clear modal 
    this.clearAddModal();
    console.log("Updated items: ", this.list.items);
  }

  public deleteItem(index) {
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

  public clearAddModal(): void {
    this.newItemName = "";
    this.newItemTime = "";
    this.generalService.clearDate.next(true)
    this.newItem = {
      name: '',
      dueDate: undefined,
      time: '',
      completed: false
    }
  }
}
