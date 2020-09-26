import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth.service';
import { AngularFireAuthModule } from '@angular/fire/auth';
import { NgxsModule } from '@ngxs/store';
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
