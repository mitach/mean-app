import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../auth/auth.service';
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

  private postsSub: Subscription;

  constructor(public route: ActivatedRoute, public authService: AuthService, public postService: PostService) { }

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
        console.log(postsData.posts)
        this.posts = postsData.posts
      })


  }

  onDelete(postId: string) {
    this.postService.deletePost(postId)
      .subscribe(() => {
        this.postService.getPostsOfUser(this.userId)
          .subscribe((postsData: { posts: any }) => {
            console.log(postsData.posts)
            this.posts = postsData.posts
          })
      })
  }

}
