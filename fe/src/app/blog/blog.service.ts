import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { IBlog } from './blog.model'

@Injectable({
  providedIn: 'root'
})
export class BlogService {

  blogs: IBlog[] = [];

  readonly baseURL = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) { }

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
