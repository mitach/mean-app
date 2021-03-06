import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../blog.service';

import { mimeType } from './mime-type.validator'; 

@Component({
  selector: 'app-blog-create',
  templateUrl: './blog-create.component.html',
  styleUrls: ['./blog-create.component.css']
})

export class BlogCreateComponent implements OnInit {
  form: FormGroup;
  
  imagePreview;
  err;
  
  constructor(public blogService: BlogService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)]
      }),
      'content': new FormControl(null, { validators: [Validators.required] }),
      'image': new FormControl(null, { validators: [Validators.required] })
    })
  }

  onSaveBlog() {
    if (this.form.value.image == null) {
      this.err = 'Image not selected';
      return;
    } else {
      this.err = '';
    }
    if (this.form.invalid) {
      return;
    }

    this.blogService.addBlog(this.form.value.title, this.form.value.content, this.form.value.image);
  }

  onImagePicked(event: Event) {
    this.err = '';

    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }
}
