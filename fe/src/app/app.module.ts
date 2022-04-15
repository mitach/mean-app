import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { HeaderComponent } from './core/header/header.component';
import { FooterComponent } from './core/footer/footer.component';
import { MainComponent } from './core/main/main.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ProfileComponent } from './profile/profile.component';

import { AuthInterceptor } from './auth/auth-interceptor';
import { ErrorComponent } from './error/error.component';
import { ErrorInterceptor } from './error-interceptor';

import { AngularMaterialModule } from './angular-material.module';
import { PostsModule } from './posts/posts.module';
// import { BlogsModule } from './blog/blogs.module';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainComponent,
    NotFoundComponent,
    ProfileComponent,
    ErrorComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    AngularMaterialModule,
    PostsModule,
    // BlogsModule,
  ],
  providers: [
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
  ],
  bootstrap: [AppComponent],
  entryComponents: [ErrorComponent]
})
export class AppModule { }
