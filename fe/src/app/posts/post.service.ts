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
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath
            };
          })
        };
      }))
      .subscribe((transformedData) => {
        this.posts = transformedData.posts
        this.postsUpdated.next({ posts: [...this.posts] });
      });
  }

  getPost(id: string) {
    return this.http.get<{ _id: string, title: string, content: string }>(this.baseURL + '/posts/' + id);
  }

  getPostUpdateListener() {
    return this.postsUpdated.asObservable();
  }

  addPost(title: string, content: string, image: File) {
    const postData = new FormData();
    postData.append('title', title);
    postData.append('content', content);
    postData.append('image', image, title);

    this.http.post<{message: string, post: IPost}>(this.baseURL + '/posts', postData)
      .subscribe((response) => {
        this.router.navigate(['']);
      })
  }

  editPost(id: string, title: string, content: string, image: File | string) {
    let postData: IPost | FormData;

    if (typeof (image) === 'object') {
      postData = new FormData();
      postData.append('id', id)
      postData.append('title', title);
      postData.append('content', content);
      postData.append('image', image, title)
    } else {
      postData = { id: id, title: title, content: content, imagePath: image };
    }

    this.http.put(this.baseURL + '/posts/edit/' + id, postData)
      .subscribe(response => {
        this.router.navigate(['']);
      })
  }

  deletePost(postId: string) {
    return this.http.delete(this.baseURL + '/posts/' + postId);
  }
}
