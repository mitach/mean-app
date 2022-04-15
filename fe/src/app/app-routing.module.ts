import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { PostCreateComponent } from './posts/post-create/post-create.component';
import { PostEditComponent } from './posts/post-edit/post-edit.component';
import { PostListComponent } from './posts/post-list/post-list.component';

import { AuthGuard } from './auth/auth.guard';
import { IsAuthGuard } from './auth/isAuth.guard';

import { MainComponent } from './core/main/main.component';
import { ProfileComponent } from './profile/profile.component';
import { NotFoundComponent } from './core/not-found/not-found.component';

const routes: Routes = [
  { path: '', component: MainComponent },
  { path: 'auth', loadChildren: () => import('./auth/auth.module').then(x => x.AuthModule) },
  { path: 'posts', component: PostListComponent },
  { path: 'posts/create', component: PostCreateComponent, canActivate: [AuthGuard] },
  { path: 'post/edit/:postId', component: PostEditComponent, canActivate: [AuthGuard] },
  { path: 'blog', loadChildren: () => import('./blog/blogs.module').then(x => x.BlogsModule) },
  { path: 'profile/:userId', component: ProfileComponent, canActivate: [AuthGuard] },
  { path: '**', pathMatch: 'full', component: NotFoundComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})

export class AppRoutingModule { }