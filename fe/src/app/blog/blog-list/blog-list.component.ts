import { Component, OnDestroy, OnInit } from '@angular/core';
import { IBlog } from '../blog.model';
import { Subscription } from 'rxjs';
import { PageEvent } from '@angular/material/paginator';
import { AuthService } from 'src/app/auth/auth.service';
import { BlogService } from '../blog.service';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.css']
})
export class BlogListComponent implements OnInit, OnDestroy {
  isLoading: boolean = false;

  blogs: IBlog[] = [];

  totalBlogs = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [2, 5, 10, 20];

  creatorName: string;
  userId: string;
  userIsAuthenticated: boolean = false;
  private authStatusSub: Subscription;
  private blogSub: Subscription;



  constructor(private blogService: BlogService, private authService: AuthService) { }

  ngOnInit(): void {
    this.isLoading = true;

    this.blogService.getBlogs(this.postsPerPage, this.currentPage);
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

  onChangedPage(pageData: PageEvent) {
    this.isLoading = true;

    this.currentPage = pageData.pageIndex + 1;
    this.postsPerPage = pageData.pageSize;

    this.blogService.getBlogs(this.postsPerPage, this.currentPage);

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  onDelete(postId: string) {
    this.isLoading = true;

    this.blogService.deleteBlog(postId)
      .subscribe(() => {
        this.blogService.getBlogs(this.postsPerPage, this.currentPage)
      })
  }

  ngOnDestroy(): void {
    this.blogSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}
