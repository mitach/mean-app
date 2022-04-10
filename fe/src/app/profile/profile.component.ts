import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { AuthService } from '../auth/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  isLoading: boolean = false;

  userId: string;

  user: any;
  
  name: string;
  
  constructor(public route: ActivatedRoute, public authService: AuthService) { }

   ngOnInit() {
    this.isLoading = true;

    this.route.paramMap
      .subscribe((paramMap: ParamMap) => {
        this.userId = paramMap.get('userId');
      });


     this.authService.getUser(this.userId)
     .subscribe((userData: { message: string, user: {} }) => {
        this.isLoading = false;

        this.user = userData.user;
      });

      
  }

}
