import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrls: ['./alert.component.scss']
})
export class AlertComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: AlertPopupData,
    private mdDialogRef: MatDialogRef<AlertComponent>
  ) { }

  color: any = {
    'success': '#32cd32',
    'fail': '#ff4500',
    'alert': '#0099ff',
    'error': '#7b1fa2'
  }
  style = {
    "color": this.color[this.data.header.toLowerCase()]
  }

  ngOnInit(): void {
    // console.log(this.data)
  }

  public close() {
    this.mdDialogRef.close();
  }
}

export interface AlertPopupData {
  header: string,
  message: string,
}