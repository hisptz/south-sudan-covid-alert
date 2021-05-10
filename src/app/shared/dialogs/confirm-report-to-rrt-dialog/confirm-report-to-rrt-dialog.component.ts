import { Component, Inject, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-confirm-report-to-rrt-dialog',
  templateUrl: './confirm-report-to-rrt-dialog.component.html',
  styleUrls: ['./confirm-report-to-rrt-dialog.component.css'],
})
export class ConfirmReportToRrtDialogComponent implements OnInit {
  constructor(
    public dialogRef: MatDialogRef<ConfirmReportToRrtDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data,
  ) {}

  ngOnInit(): void {}
  closeDialog(): void {
    this.dialogRef.close();
  }
  reportToRRT() {
    this.dialogRef.close({ reportToRRT: true });
  }
}
