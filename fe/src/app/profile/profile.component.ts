import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
import { BlogService } from '../blog/blog.service';
import { IPost } from '../posts/post.model';
import { PostService } from '../posts/post.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isLoading: boolean = false;

  userId: string;

  user: any;

  name: string;

  posts;

  blogs;

  render: string = 'posts';

  private postsSub: Subscription;

  constructor(public route: ActivatedRoute, public authService: AuthService, public postService: PostService, public blogService: BlogService) { }

  ngOnInit() {
    this.isLoading = true;

    this.route.paramMap
      .subscribe((paramMap: ParamMap) => {
        this.userId = paramMap.get('userId');
      });


    this.authService.getUser(this.userId)
      .subscribe((userData: { message: string, user: {} }) => {
        this.isLoading = false;

        this.user = userData.user;
      });

    this.postService.getPostsOfUser(this.userId)
      .subscribe((postsData: { posts: any }) => {
        this.posts = postsData.posts
      })

    this.blogService.getBlogsOfUser(this.userId)
      .subscribe((blogData: { blog: any }) => {
        this.blogs = blogData.blog
      })
  }

  onDeletePost(postId: string) {
    this.postService.deletePost(postId)
      .subscribe(() => {
        this.postService.getPostsOfUser(this.userId)
          .subscribe((postsData: { posts: any }) => {
            this.posts = postsData.posts
          })
      })
  }

  onChangeRenderToPosts() {
    this.render = 'posts';
  }

  onChangeRenderToBlogs() {
    this.render = 'blogs';
  }

  onDeleteBlog(postId: string) {
    this.blogService.deleteBlog(postId)
      .subscribe(() => {
        this.blogService.getBlogsOfUser(this.userId)
          .subscribe((blogData: { blog: any}) => {
            this.blogs = blogData.blog
          })
      })
  }

}
