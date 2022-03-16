import { Component, OnInit } from '@angular/core';
import { AppState } from './store/reducers';
import { Store } from '@ngrx/store';
import * as fromSelectors from './store/selectors';
import * as fromActions from './store/actions';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent implements OnInit {
  title = 'covid-alert';

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store.dispatch(fromActions.loadCurrentUser());
  }
}
