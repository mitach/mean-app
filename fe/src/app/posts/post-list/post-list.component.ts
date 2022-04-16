import { Component, OnDestroy, OnInit } from '@angular/core';
import { PageEvent } from '@angular/material/paginator';
import { Subscription } from 'rxjs';
import { AuthService } from 'src/app/auth/auth.service';
import { IPost } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit, OnDestroy {

  posts: IPost[] = [];
  isLoading: boolean = false;

  filterBy: string = 'title';

  filterDisabling: boolean = true;

  totalPosts = 0;
  postsPerPage = 5;
  currentPage = 1;
  pageSizeOptions = [2, 5, 10, 20];

  creatorName: string;
  userId: string;
  userIsAuthenticated: boolean = false;
  private authStatusSub: Subscription;

  private postsSub: Subscription;

  constructor(private postService: PostService, private authService: AuthService) {

  }

  ngOnInit(): void {
    this.isLoading = true;

    this.postService.getPosts(this.postsPerPage, this.currentPage, '', '');
    this.userId = this.authService.getUserId();
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((postData: { posts: IPost[], postCount: number }) => {
        this.isLoading = false;

        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
      });

    this.userIsAuthenticated = this.authService.getIsAuth();
    this.authStatusSub = this.authService
      .getAuthStatusListener()
      .subscribe(isAuthenticated => {
        this.userIsAuthenticated = isAuthenticated;
        this.userId = this.authService.getUserId();
      });
  }


  onDelete(postId: string) {
    this.isLoading = true;

    this.postService.deletePost(postId)
      .subscribe(() => {
        this.postService.getPosts(this.postsPerPage, this.currentPage, '', '');
      }, () => {
        this.isLoading = false;
      })
  }

  onRemoveFilters() {
    this.isLoading = true;
    this.filterDisabling = true;

    this.postService.getPosts(this.postsPerPage, this.currentPage, '', '');
    this.userId = this.authService.getUserId();
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((postData: { posts: IPost[], postCount: number }) => {
        this.isLoading = false;

        this.totalPosts = postData.postCount;
        this.posts = postData.posts;
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

    this.postService.getPosts(this.postsPerPage, this.currentPage, '', '');

    window.scroll({
      top: 0,
      left: 0,
      behavior: 'smooth'
    });
  }

  onSearchByKeyword(event: Event) {
    this.isLoading = true;
    let keyword = (event.target as HTMLElement).textContent;
    this.filterDisabling = false;
    this.postService.getPosts(this.postsPerPage, this.currentPage, keyword, '');
  }

  onFilter(filter) {
    this.filterDisabling = false;

    if (this.filterBy == 'keyword') {
      this.postService.getPosts(this.postsPerPage, this.currentPage, filter.value, '');
    } else if (this.filterBy = 'title') {
      this.postService.getPosts(this.postsPerPage, this.currentPage, '', filter.value);
    }

    filter.value = '';
  }

  onSelect(event: Event) {
    if ((event.target as HTMLSelectElement).value == 'title') {
      this.filterBy = 'title'
    } else if ((event.target as HTMLSelectElement).value == 'keyword') {
      this.filterBy = 'keyword'
    }
  }

  ngOnDestroy(): void {
    this.postsSub.unsubscribe();
    this.authStatusSub.unsubscribe();
  }
}