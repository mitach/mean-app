import { NgModule } from "@angular/core";
import { RouterModule, Routes } from "@angular/router";

import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

import { IsAuthGuard } from './isAuth.guard';


const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [IsAuthGuard] },
    { path: 'signup', component: SignupComponent, canActivate: [IsAuthGuard] },
]

@NgModule({
    imports: [
        RouterModule.forChild(routes)
    ],
    exports: [RouterModule],
  providers: [IsAuthGuard]
})
export class AuthRoutingModule {}