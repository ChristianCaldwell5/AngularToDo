import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  private selectedList = {};
  private selectedIndex: number;

  constructor(
    private cookieService: CookieService
  ) { }

  public getSelectedList() {
    if (this.cookieService.check('list')) {
      this.selectedList = JSON.parse(this.cookieService.get('list'));
      this.selectedIndex = Number(this.cookieService.get('list-index'));
    }
    return this.selectedList;
  }

  public getSelectedIndex() {
    return this.selectedIndex;
  }

  public setSelectedList(list, index) {
    this.selectedList = list;
    this.selectedIndex = index;
    this.cookieService.set('list', JSON.stringify(this.selectedList));
    this.cookieService.set('list-index', this.selectedIndex.toString());
  }

  public unsetSelectedList() {
    this.selectedList = {}
    this.cookieService.delete('list');
  }

  public updateListCookie(list) {
    this.cookieService.set('list', JSON.stringify(list));
  }
}
