import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-blog-create',
  templateUrl: './blog-create.component.html',
  styleUrls: ['./blog-create.component.css']
})

export class BlogCreateComponent implements OnInit {
  form: FormGroup;
  
  imagePreview;
  
  constructor() { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)]
      }),
      'content': new FormControl(null, { validators: [Validators.required] }),
      'image': new FormControl(null, { validators: [Validators.required] })
    })
  }

  onSavePost() {

  }

  onImagePicked(event: Event) {}


}
