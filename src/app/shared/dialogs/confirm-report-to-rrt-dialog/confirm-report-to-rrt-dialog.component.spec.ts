import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmReportToRrtDialogComponent } from './confirm-report-to-rrt-dialog.component';

describe('ConfirmReportToRrtDialogComponent', () => {
  let component: ConfirmReportToRrtDialogComponent;
  let fixture: ComponentFixture<ConfirmReportToRrtDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ConfirmReportToRrtDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmReportToRrtDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
