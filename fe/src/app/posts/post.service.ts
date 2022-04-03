import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { Subject } from 'rxjs';


import { IPost } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {

  posts: IPost[] = [];
  private postsUpdated = new Subject<{ posts: IPost[] }>();

  readonly baseURL = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) { }

  getPosts() {
    this.http.get<{ message: string, posts: any }>(this.baseURL + '/posts')
      .pipe(map((postData) => {
        return {
          posts: postData.posts.map(post => {
            return {
              title: post.title,
              content: post.content,
              id: post._id,
            };
          })
        };
      }))
      .subscribe((transformedData) => {
        this.posts = transformedData.posts
        this.postsUpdated.next({ posts: [...this.posts] });
      });
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(postData: object) {
    this.http.post(this.baseURL + '/posts', postData)
      .subscribe((response) => {
        this.router.navigate(['']);
      })
  }

  deletePost(postId: string) {
    return this.http.delete(this.baseURL + '/posts/' + postId);
  }
}
