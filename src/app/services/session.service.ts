import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private activeUser = {
    username: "",
    id: "",
    lists: []
  };

  constructor(
    private cookieService: CookieService
  ) { }

  public getUser(): object {
    if (!this.activeUser.username) {
      this.activeUser = JSON.parse(this.cookieService.get('user'));
    }
    return this.activeUser;
  }

  public setUser(user): void {
    this.activeUser.username = user.username;
    this.activeUser.id = user.id;
    this.activeUser.lists = user.lists;
    this.cookieService.set('user', JSON.stringify(this.activeUser), 1);
  }

  public updateList(item): void {
    this.activeUser.lists = this.activeUser.lists.concat(item);
  }

}
