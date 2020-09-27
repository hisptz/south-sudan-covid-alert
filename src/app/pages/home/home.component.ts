import { Component, OnInit } from '@angular/core';
import {AppState} from '../../store/reducers';
import {Store} from '@ngrx/store';
import * as fromSelectors from '../../store/selectors';
import * as fromActions from '../../store/actions';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  eventsAnalytics$: Observable<any>;

  constructor(private store: Store<AppState>) {
    this.eventsAnalytics$ = store.select(fromSelectors.getEvents);
  }

  ngOnInit() {
    this.store.dispatch(fromActions.loadEvents());
  }



}
