import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class PromiseService {
  constructor() {}
  getPromiseFromObservable(observableFn: Observable<Function>): Promise<any> {
    return new Promise((resolve, reject) => {
      observableFn.pipe(take(1)).subscribe(
        (res) => {
          resolve(res);
        },
        (error) => {
          reject(error);
        },
      );
    });
  }
}
