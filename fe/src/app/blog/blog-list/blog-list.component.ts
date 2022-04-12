import { Component, OnInit } from '@angular/core';
import { IBlog } from '../blog.model';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit {
  isLoading: boolean = false;

  blogs: IBlog[] = [];

  creatorName: string;
  userId: string;
  userIsAuthenticated: boolean = false;
  private authStatusSub: Subscription;
  private blogSub: Subscription;

  totalBlogs = 0;


  constructor(private blogService: BlogService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.blogService.getBlogs();
    this.userId = this.authService.getUserId();
    this.blogSub = this.blogService.getPostUpdateListener()
      .subscribe((blogData: { blog: IBlog[], blogCount: number }) => {
        this.isLoading = false;

        this.totalBlogs = blogData.blogCount;
        this.blogs = blogData.blog;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });

      
  }

}
