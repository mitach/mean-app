import { ThisReceiver } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-create',
  templateUrl: './post-create.component.html',
  styleUrls: ['./post-create.component.css']
})
export class PostCreateComponent implements OnInit {

  form: FormGroup;

  constructor(public postService: PostService) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)]
      }),
      'content': new FormControl(null, {validators: [Validators.required]})
    })
  }

  onSavePost() {
    if (this.form.invalid) {
      return;
    }

    const postData = {
      title: this.form.value.title,
      content: this.form.value.content
    }
    
    this.postService.addPost(postData);
    
  }

}
