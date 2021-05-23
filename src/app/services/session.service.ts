import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private activeUser = {
    username: "",
    id: "",
    lists: []
  };

  constructor() { }

  public getUser(): object {
    return this.activeUser;
  }

  public setUser(user): void {
    this.activeUser.username = user.username;
    this.activeUser.id = user.id;
    this.activeUser.lists = user.lists;
  }

}
