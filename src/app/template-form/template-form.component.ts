import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {map} from 'rxjs/operators';
import { FormDebugComponent } from '../form-debug/form-debug.component';

@Component({
  selector: 'app-template-form',
  templateUrl: './template-form.component.html',
  styleUrls: ['./template-form.component.css']
})
export class TemplateFormComponent implements OnInit {

  usuario: any =  {
    nome: null,
    email:null
  }

  onSubmit(form: any){
    console.log(form.value);
    //console.log(this.usuario);

  }

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
  }

  verificaValidTouched(campo: any){
    return !campo.valid && campo.touched;
  }

  aplicaCssErro(campo: any){
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo),
    }
  }
  consultaCEP(cep: any, form: any){
    cep = cep.replace(/\D/g, '');
    if (cep != "") {
      var validacep = /^[0-9]{8}$/;
      if(validacep.test(cep)){
          this.http.get("https://viacep.com.br/ws/"+ cep +"/json/")
          .pipe(map(dados => dados))
          .subscribe(dados =>  this.populaDadosForm(dados, form) );
      }
    }
  }

  populaDadosForm(dados: any, form: any){
   form.setValue({

        nome: form.value.nome,
        email: form.value.email,
        endereco: {
          cep: dados.cep,
          numero: '',
          complemento: dados.complemento,
          rua: dados.logradouro,
          bairro: dados.bairro,
          cidade: dados.localidade,
          estado: dados.uf

      }
    })

  /*  form.form.pathValue({
      endereco: {
        cep: dados.cep,
        complemento: dados.complemento,
        rua: dados.logradouro,
        bairro: dados.bairro,
        cidade: dados.localidade,
        estado: dados.uf

    }
    })*/
  }

}
