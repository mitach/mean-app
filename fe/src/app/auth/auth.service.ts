import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';

import { AuthData } from './auth-data.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private token: string;
  private tokenTimer: any;
  private authStatusListener = new Subject<boolean>();
  private userId: string;
  private isAuthenticated = false;

  readonly baseURL = 'http://localhost:3000/api/users';

  constructor(private http: HttpClient, private router: Router) { }

  createUser(name: string, email: string, password: string, image: File) {
    // const authData: AuthData = { name: name, email: email, password: password };

    const authData = new FormData();
    authData.append('name', name);
    authData.append('email', email);
    authData.append('password', password);
    authData.append('image', image, email);

    console.log(authData.get('image'));

    this.http.post(this.baseURL + '/signup', authData)
      .subscribe(response => {

        this.login(email, password);

        this.router.navigate(['/']);
      });
  }

  async makeData(name: string, email: string, password: string) {
    const authData = new FormData();
    authData.append('name', name);
    authData.append('email', email);
    authData.append('password', password);
  }

  login(email: string, password: string) {
    const authData = { email: email, password: password };

    this.http.post<{ token: string, expiresIn: number, userId: string }>(this.baseURL + '/login', authData)
      .subscribe(response => {
        const token = response.token;
        this.token = token;

        if (token) {
          const expiresInDuration = response.expiresIn;
          this.setAuthTimer(expiresInDuration);
          this.isAuthenticated = true;
          this.userId = response.userId;
          this.authStatusListener.next(true);

          const now = new Date();
          const expirationDate = new Date(now.getTime() + expiresInDuration * 1000);
          this.saveAuthData(token, expirationDate, this.userId);

          this.router.navigate(['/']);
        }
      })
  }

  logout() {
    this.token = null;
    this.isAuthenticated = false;
    this.authStatusListener.next(false);
    clearTimeout(this.tokenTimer);
    this.clearAuthData();
    this.userId = null;
    this.router.navigate(['/main']);
  }

  // TODO: Delete
  // autoAuthUser() {
  //   const authInformation = this.getAuthData();

  //   if (!authInformation) {
  //     return;
  //   }

  //   const now = new Date();
  //   const expiresIn = authInformation.expirationDate.getTime() - now.getTime();

  //   if (expiresIn > 0) {
  //     this.token = authInformation.token;
  //     this.isAuthenticated = true;
  //     this.userId = authInformation.userId;
  //     this.setAuthTimer(expiresIn / 1000);
  //     this.authStatusListener.next(true);
  //   }
  // }

  getToken() {
    return this.token;
  }

  getUserId() {
    return this.userId;
  }

  getIsAuth() {
    const token = localStorage.getItem('token');
    const expirationDate = new Date(localStorage.getItem('expiration'));
    const userId = localStorage.getItem('userId');

    if (!token || !expirationDate) {
      return null;
    }

    const now = new Date();
    const expiresIn = expirationDate.getTime() - now.getTime();

    if (expiresIn > 0) {
      this.token = token;
      this.isAuthenticated = true;
      this.userId = userId;
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    }
    return this.isAuthenticated;
  }

  getAuthStatusListener() {
    return this.authStatusListener.asObservable();
  }

  private setAuthTimer(duration: number) {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }

  private saveAuthData(token: string, expirationDate: Date, userId: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toISOString());
    localStorage.setItem('userId', userId);
  }

  private clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
    localStorage.removeItem('userId');
  }

  // TODO: Delete
  // private getAuthData() {
  //   const token = localStorage.getItem('token');
  //   const expirationDate = localStorage.getItem('expiration');
  //   const userId = localStorage.getItem('userId');

  //   if (!token || !expirationDate) {
  //     return null;
  //   }

  //   return {
  //     token: token,
  //     expirationDate: new Date(expirationDate),
  //     userId: userId,
  //   }
  // }
}
