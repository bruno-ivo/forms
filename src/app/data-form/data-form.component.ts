import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null),
    });
  }

  onSubmit(){
    this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
    .pipe(map(res => res))
    .subscribe(dados => {
      console.log(dados);
      //reseta o form
      this.resetar();
    });
  }

  resetar(){
    this.formulario.reset();
  }

}
