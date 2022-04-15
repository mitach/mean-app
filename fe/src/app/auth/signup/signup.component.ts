import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { AuthService } from '../auth.service';

import { mimeType } from './mime-type.validator';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit, OnDestroy {

  form: FormGroup;

  imagePreview: string;

  isLoading: boolean = false;

  err: string;

  private authStatusSub: Subscription;

  constructor(public authService: AuthService) { }

  ngOnInit(): void {
    this.authStatusSub = this.authService.getAuthStatusListener()
      .subscribe(authStatus => {
        // this.isLoading = authStatus;
        this.isLoading = false;
      });

    this.form = new FormGroup({
      'name': new FormControl(null, {
        validators: [Validators.required, Validators.minLength(3)]
      }),
      'email': new FormControl(null, { validators: [Validators.required] }),
      'password': new FormControl(null, { validators: [Validators.required, Validators.minLength(6)] }),
      'repass': new FormControl(null, { validators: [Validators.required, Validators.minLength(6)] }),
      'image': new FormControl(null, { validators: [Validators.required], asyncValidators: [mimeType] })
    })
  }

  onSignup() {
    if (this.form.value.image == null) {
      this.err = 'Image not selected';
      return;
    } else {
      this.err = '';
    }

    if (this.form.value.password != this.form.value.repass) {
      this.err = 'Password missmatch!';
      return;
    } else {
      this.err = '';
    }
    
    if (this.form.invalid) {
      return;
    }




    this.isLoading = true;

    this.authService.createUser(this.form.value.name, this.form.value.email, this.form.value.password, this.form.value.image);
  }

  onImagePicked(event: Event) {
    this.err = '';
    const file = (event.target as HTMLInputElement).files[0];
    this.form.patchValue({ image: file });
    this.form.get('image').updateValueAndValidity();

    const reader = new FileReader();

    reader.onload = () => {
      this.imagePreview = reader.result as string;
    }
    reader.readAsDataURL(file);
  }

  ngOnDestroy(): void {
    this.authStatusSub.unsubscribe();
  }

}
