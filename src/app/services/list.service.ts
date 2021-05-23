import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ListService {

  private selectedList = {};

  constructor() { }

  public getSelectedList() {
    return this.selectedList;
  }

  public setSelectedList(list) {
    this.selectedList = list;
  }
}
