import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgxsModule } from '@ngxs/store';
import { AuthService } from './services/auth.service';
import { AuthState } from './state/auth.state';

@NgModule({
  imports: [
    CommonModule,
    AngularFireAuthModule,
    NgxsModule.forFeature([AuthState])
  ],
  providers: [
    AuthService
  ]
})
export class AuthModule { }
