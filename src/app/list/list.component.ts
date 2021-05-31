import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FirebaseService } from '../services/firebase.service';
import { SessionService } from '../services/session.service';
import { ListService } from '../services/list.service';
import { CookieService } from 'ngx-cookie-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.css']
})
export class ListComponent implements OnInit {

  @ViewChild('modal') modal: ElementRef;

  public list;
  public itemName: string = '';

  constructor(
    private firebaseService: FirebaseService,
    private sessionService: SessionService,
    private cookieService: CookieService,
    private listService: ListService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.list = this.listService.getSelectedList();
  }

  public exitList() {
    this.listService.unsetSelectedList();
    this.router.navigateByUrl('/home');
  }

  public addItemModal() {
    this.modal.nativeElement.style.display = 'flex';
  }

  public cancelAddItem() {
    this.modal.nativeElement.style.display = 'none';
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
}
