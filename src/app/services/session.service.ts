import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionService {

  private activeUser: string;

  constructor() { }

  public getUser(): string {
    return this.activeUser;
  }

  public setUser(user: string): void {
    this.activeUser = user;
  }

}
