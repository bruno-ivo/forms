import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css']
})
export class InputFieldComponent implements OnInit {

  @Input() classeCSS: any;
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() type = 'text';
  @Input() control: any;

  constructor() { }

  ngOnInit(): void {
  }

}
