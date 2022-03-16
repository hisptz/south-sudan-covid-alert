import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-view-event',
  templateUrl: './view-event.component.html',
  styleUrls: ['./view-event.component.css'],
})
export class ViewEventComponent implements OnInit {
  @Input() event;
  @Input() headers;
  @Output() closeEvent = new EventEmitter<any>();
  constructor() {}

  ngOnInit() {}

  closeSection() {
    this.closeEvent.emit({ closeView: true });
  }

  onPrint(){
    console.log("On print");
  }
}
