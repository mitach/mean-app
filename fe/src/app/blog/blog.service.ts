import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { map } from 'rxjs/operators'; 
import { Subject } from 'rxjs';

import { IBlog } from './blog.model';

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  blogs: IBlog[] = [];
  private blogUpdated = new Subject<{ blog: IBlog[], blogCount: number }>();


  readonly baseURL = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) { }

  getBlogs() {

    this.http.get<{ message: string, blog: any, maxPosts: number }>(this.baseURL + '/blog')
      .pipe(map((blogData) => {
        return {
          blog: blogData.blog.map(post => {
            return {
              id: post._id,
              title: post.title,
              content: post.content,
              imagePath: post.imagePath,
              creator: post.creator,
              creatorName: post.creatorName,
              firstSentance: post.content.split('.')[0] + '...'
            };
          }),
          maxPosts: blogData.maxPosts
        };
      }))
      .subscribe((transformedData) => {
        this.blogs = transformedData.blog
        this.blogUpdated.next({ blog: [...this.blogs], blogCount: transformedData.maxPosts });
      });
  }

  getPostUpdateListener() {
    return this.blogUpdated.asObservable();
  }

  addBlog(title: string, content: string, image: File) {
    const blogData = new FormData();

    blogData.append('title', title);
    blogData.append('content', content);
    blogData.append('image', image, title);

    this.http.post<{ message: string, post: IBlog }>(this.baseURL + '/blog', blogData)
      .subscribe((response) => {
        console.log(response);

        this.router.navigate(['/blog']);
      })
  }
}
