import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { IPost } from './post.model';

@Injectable({
  providedIn: 'root'
})
export class PostService {
  
  readonly baseURL = 'http://localhost:3000/api';

  constructor(private http: HttpClient, private router: Router) {}

  addPost(postData: object) {

    this.http.post(this.baseURL + '/posts', postData)
      .subscribe((response) => {
        this.router.navigate(['']);
      })
  }
}
