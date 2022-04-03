import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { PostService } from '../post.service';
import { ActivatedRoute, ParamMap } from '@angular/router';

@Component({
  selector: 'app-post-edit',
  templateUrl: './post-edit.component.html',
  styleUrls: ['./post-edit.component.css']
})
export class PostEditComponent implements OnInit {

  form: FormGroup;

  post;

  postId: string;

  constructor(private postService: PostService, public route: ActivatedRoute) { }

  async ngOnInit() {
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)]
      }),
      'content': new FormControl(null, { validators: [Validators.required] })
    })

    this.route.paramMap
      .subscribe((paramMap: ParamMap) => {
        this.postId = paramMap.get('postId');
        this.postService.getPost(this.postId).subscribe((postData) => {
          this.post = {
            id: postData._id,
            title: postData.title,
            content: postData.content,
          };
          this.form.setValue({
            'title': this.post.title,
            'content': this.post.content,
          });
        });
      });
  }

  onEditPost() {
    if (this.form.invalid) {
      return;
    }
    
    this.postService.editPost(this.postId, this.form.value.title, this.form.value.content);
  }
}
