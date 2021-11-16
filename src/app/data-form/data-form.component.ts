import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DropdownService } from '../shared/services/dropdown.service';
import { EstadoBr } from '../shared/models/estado-br.models';
import { ConsultaCepService } from '../shared/services/consulta-cep.service';
import { Observable } from 'rxjs';
import { ArrayType } from '@angular/compiler';
import { FormValidations } from '../shared/form-validations';

@Component({
  selector: 'app-data-form',
  templateUrl: './data-form.component.html',
  styleUrls: ['./data-form.component.css']
})
export class DataFormComponent implements OnInit {

  formulario: any;
  //estados: EstadoBr [] = [];
  estados: Observable<EstadoBr[]> = new Observable;
  cargos: any[] = [];
  tecnologias: any[] = [];
  newsletterOp: any = [];
  frameworks = ['Angular', 'React', 'Vue', 'Sencha'];

  constructor(private http: HttpClient,
              private formBuilder: FormBuilder,
              private dropwdownService: DropdownService,
              private cepService: ConsultaCepService) {}

  ngOnInit(): void {

    this.estados = this.dropwdownService.getEstadosBr();
    this.cargos = this.dropwdownService.getCargos();
    this.tecnologias = this.dropwdownService.getTecnologias();
    this.newsletterOp = this.dropwdownService.getNewsletter();
    /*
    this.dropwdownService.getEstadosBr()
    .subscribe((res: EstadoBr) => {
      this.estados.push(res);
      console.log(res);
    });
    */
    /*this.formulario = new FormGroup({
      nome: new FormControl(null),
      email: new FormControl(null),
    });*/

    this.formulario = this.formBuilder.group({
      nome: [null, [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      email: [null, [Validators.required, Validators.email]],
      endereco: this.formBuilder.group({
        cep: [null, Validators.required, FormValidations.cepValidator],
        numero: [null, Validators.required],
        complemento: [null],
        rua: [null, Validators.required],
        bairro: [null, Validators.required],
        cidade: [null, Validators.required],
        estado: [null, Validators.required],
      }),

      cargo: [null],
      tecnologias: [null],
      newsletter: ['s'],
      termos: [null, Validators.pattern('true')],
      frameworks: this.buildFrameworks(),
    })
  }

  buildFrameworks(){
    const values = this.frameworks.map(f => new FormControl(false));
    return this.formBuilder.array(values);
  }

  requiredMinCheckbox(min = 1){
    const validator = (formArray: FormArray) => {
     /* const values = formArray.controls;
      let totalChecked = 0;
      for (let i = 0; i < values.length; i++) {
        if (values[i].value) {
          totalChecked += 1;
        }
      } */
      const totalChecked = formArray.controls
      .map(v => v.value)
      .reduce((total, current) => current ? total + current : total, 0);
      return totalChecked >= min ? null: { required: true };
    };
    return validator;
  }

  onSubmit(){

    let valueSumit = Object.assign({}, this.formulario.value);

    valueSumit = Object.assign({
      frameworks: valueSumit.frameworks
      .map((v: any, i: any) => v ? this.frameworks[i]: null)
      .filter((v: null) => v !== null)
    });

    if(this.formulario.valid){
      this.http.post('https://httpbin.org/post', JSON.stringify(valueSumit))
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
    const cep = this.formulario.get('endereco.cep').value;

    if(cep != null && cep !== '') {
      this.cepService.consultaCEP(cep)
      .pipe(map(dados => dados))
      .subscribe(dados =>  this.populaDadosForm(dados, this.formulario) );
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

  setarCargo(){
    const cargo = { nome: 'Dev', nivel: 'Pleno', desc: 'Dev Pl'};
    this.formulario.get('cargo').setValue(cargo);
  }

  compararCargos(obj1: any, obj2: any){
    return obj1 && obj2 ? (obj1.nome === obj2.nome && obj1.nivel === obj2.nivel) : obj1 === obj2 ;
  }

}
