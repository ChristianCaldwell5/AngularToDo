import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private activeUser = {
    username: "",
    id: "",
    lists: [],
    selectedList: {},
    selectedIndex: 0
  };

  constructor(
    private cookieService: CookieService
  ) { }

  public getUser(): object {
    if (!this.activeUser.username) {
      this.activeUser = JSON.parse(sessionStorage.getItem("user"));
    }
    return this.activeUser;
  }

  public setUser(user): void {
    this.activeUser.username = user.username;
    this.activeUser.id = user.id;
    this.activeUser.lists = user.lists;
    sessionStorage.setItem("user", JSON.stringify(this.activeUser))
    // this.cookieService.set('user', JSON.stringify(this.activeUser));
  }

  public updateLists(item): void {
    this.activeUser.lists = this.activeUser.lists.concat(item);
    sessionStorage.setItem("user", JSON.stringify(this.activeUser))
    // this.cookieService.set('user', JSON.stringify(this.activeUser));
  }

  public setSelectedIndex(index): void {
    this.activeUser.selectedIndex = index;
  }

  public getSelectedIndex(): number {
    return this.activeUser.selectedIndex;
  }

  public setSelectedList(list): void {
    this.activeUser.selectedList = list;
  }

  public getSelectedList(): object {
    return this.activeUser.selectedList;
  }

  public updateSeledtedList(lists, selectdIndex) {
    this.activeUser.lists = lists;
    this.activeUser.selectedList = this.activeUser.lists[selectdIndex];
    sessionStorage.setItem("user", JSON.stringify(this.activeUser))
    // this.cookieService.set('user', JSON.stringify(this.activeUser));
  }

  public unsetSelectedList(): void {
    this.activeUser.selectedList = {}
  }

}
