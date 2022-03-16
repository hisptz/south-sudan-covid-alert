import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { commonUsedIds } from '../../models/alert.model';
import { Store } from '@ngrx/store';
import { AppState } from 'src/app/store/reducers';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as fromActions from '../../../store/actions';

@Component({
  selector: 'app-case-number-dialog',
  templateUrl: './case-number-dialog.component.html',
  styleUrls: ['./case-number-dialog.component.css'],
})
export class CaseNumberDialogComponent implements OnInit {
  addCaseNumberForm: FormGroup;
  commonIds = commonUsedIds;

  constructor(
    public dialogRef: MatDialogRef<CaseNumberDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
    private fb: FormBuilder,
    private store: Store<AppState>,
    private _snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    console.log(this.data);
    this.addCaseNumberForm = this.fb.group({
      [this.commonIds?.CASE_NUMBER]: [
        this.data?.caseNumber,
        [Validators.required],
      ],
    });
  }
  closeDialog(): void {
    this.dialogRef.close();
  }
  onSave(form) {
    const { value } = form?.form || { value: null };
    this._snackBar.open('Saving case number', null, {
      duration: 3000,
    });
    this.store.dispatch(
      fromActions.addCaseNumber({ data: value, id: this.data?.eventId }),
    );

    this.dialogRef.close();
  }
}
