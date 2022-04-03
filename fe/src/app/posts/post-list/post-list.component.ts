import { Component, OnInit } from '@angular/core';
import { IPost } from '../post.model';
import { PostService } from '../post.service';

@Component({
  selector: 'app-post-list',
  templateUrl: './post-list.component.html',
  styleUrls: ['./post-list.component.css']
})
export class PostListComponent implements OnInit {

  posts: IPost[] = [];

  constructor(private postService: PostService) { 
    
  }

  ngOnInit(): void {

    this.postService.getPosts()
      .subscribe((res) => {
        this.posts = [...res.posts];
      });
  }



  
}
