import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private activeUser = {
    username: "",
    id: ""
  };

  constructor() { }

  public getUser(): object {
    return this.activeUser;
  }

  public setReturningUser(user): void {
    this.activeUser.username = user.username;
    this.activeUser.id = user.id;
  }

  public setNewUser(username: string): void {
    this.activeUser.username = username
  }

  public setNewUserId(id: string): void {
    this.activeUser.id = id;
    console.log(this.activeUser);
  }

}
