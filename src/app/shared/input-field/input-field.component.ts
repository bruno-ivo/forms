import { Component, Input, OnInit } from '@angular/core';
import { ControlValueAccessor } from '@angular/forms';

@Component({
  selector: 'app-input-field',
  templateUrl: './input-field.component.html',
  styleUrls: ['./input-field.component.css'],
})
export class InputFieldComponent implements OnInit, ControlValueAccessor {
  @Input() classeCSS: any;
  @Input() id: string = '';
  @Input() label: string = '';
  @Input() type = 'text';
  @Input() control: any;
  @Input() isReadOnly: any;

  private innerValue: any;

  get value(){
    return this.innerValue;
  }

  set value(v: any){
    if (v !== this.innerValue) {
      this.innerValue = v;
      this.onChangeCb(v);
    }
  }

  constructor() {}

  onChangeCb: (_: any) => void  = () => {};
  onTouchedCb: (_: any) => void  = () => {};

  writeValue(v: any): void {
    this.value = v;
  }
  registerOnChange(fn: any): void {
   this.onChangeCb = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouchedCb = fn;
  }

  setDisabledState?(isDisabled: boolean): void{
    this.isReadOnly = isDisabled;
  }

  ngOnInit(): void {}
}
