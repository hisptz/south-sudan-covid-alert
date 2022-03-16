import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CaseNumberDialogComponent } from './case-number-dialog.component';

describe('CaseNumberDialogComponent', () => {
  let component: CaseNumberDialogComponent;
  let fixture: ComponentFixture<CaseNumberDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [CaseNumberDialogComponent],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CaseNumberDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
