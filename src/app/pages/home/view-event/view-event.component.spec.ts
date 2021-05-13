import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';

import { ViewEventComponent } from './view-event.component';

describe('ViewEventComponent', () => {
  let component: ViewEventComponent;
  let fixture: ComponentFixture<ViewEventComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewEventComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewEventComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
