import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GeneralService {

  public clearDate = new Subject<any>();

  constructor() { }

}
