import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogCreateComponent } from './blog-create/blog-create.component';
import { BlogEditComponent } from './blog-edit/blog-edit.component';
import { BlogPreviewComponent } from './blog-preview/blog-preview.component';

import { AuthGuard } from '../auth/auth.guard';

const routes: Routes = [
    { path: '', component: BlogListComponent },
    { path: 'create', component: BlogCreateComponent, canActivate: [AuthGuard] },
    { path: 'edit/:blogId', component: BlogEditComponent, canActivate: [AuthGuard] },
    { path: ':blogId', component: BlogPreviewComponent, canActivate: [AuthGuard] },
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
    providers: [AuthGuard]
})
export class BlogsRoutingModule { }