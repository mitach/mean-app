import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostEditComponent } from './posts/post-edit/post-edit.component';
import { PostListComponent } from './posts/post-list/post-list.component';
import { LoginComponent } from './auth/login/login.component';
import { SignupComponent } from './auth/signup/signup.component';
import { AuthGuard } from './auth/auth.guard';
import { IsAuthGuard } from './auth/isAuth.guard';
import { MainComponent } from './core/main/main.component';
import { ProfileComponent } from './profile/profile.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { BlogListComponent } from './blog/blog-list/blog-list.component';
import { BlogCreateComponent } from './blog/blog-create/blog-create.component';
import { BlogEditComponent } from './blog/blog-edit/blog-edit.component';
import { BlogPreviewComponent } from './blog/blog-preview/blog-preview.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'login', component: LoginComponent, canActivate: [IsAuthGuard] },
  { path: 'signup', component: SignupComponent, canActivate: [IsAuthGuard] },
  { path: 'posts', component: PostListComponent },
  { path: 'posts/create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'post/edit/:postId', component: PostEditComponent, canActivate: [AuthGuard] },
  { path: 'blog', component: BlogListComponent},
  { path: 'blog/create', component: BlogCreateComponent, canActivate: [AuthGuard] },
  { path: 'blog/edit/:blogId', component: BlogEditComponent, canActivate: [AuthGuard] },
  { path: 'blog/:blogId', component: BlogPreviewComponent, canActivate: [AuthGuard] },
  { path: 'profile/:userId', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '**', pathMatch: 'full', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
