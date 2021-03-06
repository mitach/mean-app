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

  getBlogs(postsPerPage: number, currentPage: number) {
    const queryParameters = `?pagesize=${postsPerPage}&page=${currentPage}`;

    this.http.get<{ message: string, blog: any, maxPosts: number }>(this.baseURL + '/blog' + queryParameters)
      .pipe(map((blogData) => {
        return {
          blog: blogData.blog.map(blog => {
            return {
              id: blog._id,
              title: blog.title,
              content: blog.content,
              imagePath: blog.imagePath,
              creator: blog.creator,
              creatorName: blog.creatorName,
              firstSentance: blog.content.split('.')[0] + '...'
            };
          }),
          maxBlogs: blogData.maxPosts
        };
      }))
      .subscribe((transformedData) => {
        this.blogs = transformedData.blog
        this.blogUpdated.next({ blog: [...this.blogs], blogCount: transformedData.maxBlogs });
      });
  }

  getBlog(id: string) {
    return this.http.get<{ _id: string, title: string, content: string, imagePath: string, creator: string }>(this.baseURL + '/blog/' + id);
  }

  getBlogsOfUser(userId: string) {

    return this.http.get<{ blogs: any }>(this.baseURL + '/blog/by/' + userId)
      .pipe(map((blogData) => {
        return {
          blog: blogData.blogs.map(blog => {
            return {
              id: blog._id,
              title: blog.title,
              content: blog.content,
              imagePath: blog.imagePath,
              creator: blog.creator,
              creatorName: blog.creatorName,
              firstSentance: blog.content.split('.')[0] + '...'

            }
          })
        }
      }))
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
        this.router.navigate(['/blog']);
      })
  }

  editPost(id: string, title: string, content: string, image: File | string) {
    let blogData: IBlog | FormData;

    if (typeof (image) === 'object') {
      blogData = new FormData();
      blogData.append('id', id)
      blogData.append('title', title);
      blogData.append('content', content);
      blogData.append('image', image, title)
    } else {
      blogData = { id: id, title: title, content: content, imagePath: image, creator: null, creatorName: null, firstSentance: null };
    }

    this.http.put(this.baseURL + '/blog/edit/' + id, blogData)
      .subscribe(response => {
        this.router.navigate(['/blog']);
      })
  }

  deleteBlog(postId: string) {
    return this.http.delete(this.baseURL + '/blog/' + postId);
  }
}
