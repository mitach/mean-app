import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { BlogService } from '../blog.service';

import { mimeType } from '../blog-create/mime-type.validator';

@Component({
  selector: 'app-blog-edit',
  templateUrl: './blog-edit.component.html',
  styleUrls: ['./blog-edit.component.css']
})
export class BlogEditComponent implements OnInit {

  form: FormGroup;

  blog;

  blogId;

  imagePreview: string;

  constructor(private blogService: BlogService, public route: ActivatedRoute) { }

  ngOnInit(): void {
    this.form = new FormGroup({
      'title': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(2)]
      }),
      'content': new FormControl(null, { validators: [Validators.required] }),
      'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    });

    this.route.paramMap
      .subscribe((paramMap: ParamMap) => {
        this.blogId = paramMap.get('blogId');
        this.blogService.getBlog(this.blogId).subscribe((blogData) => {

          this.blog = {
            id: blogData._id,
            title: blogData.title,
            content: blogData.content,
            imagePath: blogData.imagePath
          };

          this.form.setValue({
            'title': this.blog.title,
            'content': this.blog.content,
            'image': this.blog.imagePath
          });
        });
      });
  }

  onEditBlog() {
    if (this.form.invalid) {
      return;
    }

    this.blogService.editPost(this.blogId, this.form.value.title, this.form.value.content, this.form.value.image);
  }

  onImagePicked(event: Event) {

  }

}
