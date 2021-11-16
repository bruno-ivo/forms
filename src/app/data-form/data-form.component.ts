import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DropdownService } from '../shared/services/dropdown.service';
import { EstadoBr } from '../shared/models/estado-br.models';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: any;
  estados: EstadoBr [] = [];

  constructor(private http: HttpClient,
              private formBuilder: FormBuilder,
              private dropwdownService: DropdownService,) {}

  ngOnInit(): void {

    this.dropwdownService.getEstadosBr()
    .subscribe((res: EstadoBr) => {
      this.estados.push(res);
      console.log(res);

    });
    /*this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null),
    });*/

    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: [null, [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
        cep: [null, Validators.required],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required],
      })
    })
  }

  onSubmit(){
    if(this.formulario.valid){
      this.http.post('https://httpbin.org/post', JSON.stringify(this.formulario.value))
      .pipe(map(res => res))
      .subscribe(dados => {
        console.log(dados);
        //reseta o form
        this.resetar();
      });
    }else {
      console.log('formulario invalido');
      this.verificaValidacoesForm(this.formulario);
    }
  }

  verificaValidacoesForm(formGroup: FormGroup){
    Object.keys(this.formulario.controls).forEach((campo) =>{
      console.log(campo);
      const controle = this.formulario.get(campo);
      controle.markAsTouched();
      if (controle instanceof FormGroup) {
        this.verificaValidacoesForm(controle);
      }
    });
  }

  resetar(){
    this.formulario.reset();
  }

  verificaValidTouched(campo: any){
    return !this.formulario.get(campo).valid &&  this.formulario.get(campo).touched;
  }

  aplicaCssErro(campo: any){
    return {
      'has-error': this.verificaValidTouched(campo),
      'has-feedback': this.verificaValidTouched(campo),
    }
  }

  consultaCEP(){
    let cep = this.formulario.get('endereco.cep').value;
    cep = cep.replace(/\D/g, '');
    if (cep != "") {
      var validacep = /^[0-9]{8}$/;
      if(validacep.test(cep)){
          //this.resetaDadosForm();
          this.http.get("https://viacep.com.br/ws/"+ cep +"/json/")
          .pipe(map(dados => dados))
          .subscribe(dados =>  this.populaDadosForm(dados, this.formulario) );
      }
    }
  }

  populaDadosForm(dados: any,form: any){
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
    });
   }

   resetaDadosForm() {
    this.formulario.form.patchValue({
      endereco: {
        rua: null,
        complemento: null,
        bairro: null,
        cidade: null,
        estado: null
      }
    });
  }

}
