import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Router } from '@angular/router';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-blog-preview',
  templateUrl: './blog-preview.component.html',
  styleUrls: ['./blog-preview.component.css']
})
export class BlogPreviewComponent implements OnInit {

  blogId;

  blog;

  isLoading = false;

  constructor(private blogService: BlogService, private route: ActivatedRoute, public router: Router) { }

  ngOnInit(): void {
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

        });
      });
  }

  onDelete(postId: string) {
    this.isLoading = true;

    this.blogService.deleteBlog(postId)
      .subscribe(() => {
        this.router.navigate(['/blog']);

      })
  }

}
