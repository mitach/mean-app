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
  isLoading: boolean = false;

  private postsSub: Subscription

  constructor(private postService: PostService) {

  }

  ngOnInit(): void {
    this.isLoading = true;

    this.postService.getPosts();
    this.postsSub = this.postService.getPostUpdateListener()
      .subscribe((postData: { posts: IPost[] }) => {
        this.isLoading = false;
        
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
