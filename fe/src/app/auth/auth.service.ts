import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  readonly baseURL = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient, private router: Router) { }

  createUser(name: string, email: string, password: string) {
    const authData: AuthData = { name: name, email: email, password: password };

    this.http.post(this.baseURL + '/signup', authData)
      .subscribe(response => {
        this.router.navigate(['/']);
      });
  }
}
