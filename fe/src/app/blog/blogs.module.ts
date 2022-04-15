import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterModule } from "@angular/router";

import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogCreateComponent } from './blog-create/blog-create.component';
import { BlogEditComponent } from './blog-edit/blog-edit.component';
import { BlogPreviewComponent } from './blog-preview/blog-preview.component';

import { AngularMaterialModule } from "../angular-material.module";
import { BlogsRoutingModule } from "./blogs-routing.module";

@NgModule({
    declarations: [
        BlogListComponent,
        BlogPreviewComponent,
        BlogCreateComponent,
        BlogEditComponent
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
        RouterModule,
        BlogsRoutingModule
    ]
})
export class BlogsModule {}
