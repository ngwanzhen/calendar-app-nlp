import { Component, EventEmitter, Output, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';

@Component({
  selector: 'app-form',
  templateUrl: './form.component.html',
  styleUrls: ['./form.component.css']
})
export class FormComponent implements OnInit {

  @Output() submitForm = new EventEmitter<any>();

  constructor() { }

  ngOnInit() {
  }

  onSubmit(f: NgForm) {
    // console.log(f.value);  // { first: '', last: '' }
    this.submitForm.emit(f.value);
    f.reset();
  }

}
