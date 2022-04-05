import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { IPost } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts: IPost[] = [];

  private postsSub: Subscription

  constructor(private postService: PostService) {

  }

  ngOnInit(): void {

    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((postData: { posts: IPost[] }) => {
        this.posts = postData.posts;
      });
  }

  onDelete(postId) {
    this.postService.deletePost(postId)
      .subscribe(() => {
        this.postService.getPosts();
      })
  }



}
