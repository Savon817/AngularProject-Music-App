import {HttpClient, HttpHeaders} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { BehaviorSubject, tap } from "rxjs";
import { User } from "./user.model";

const SIGNUP_KEY = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyAklE7r4FP7CvxWyMmJ3YKXBE5pA6pTocU';
const LOGIN_KEY = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyAklE7r4FP7CvxWyMmJ3YKXBE5pA6pTocU';
// const CLIENT_ID = '86c3692b956f4c72a651bbc1f954c2ef';
// const CLIENT_SECRET = '1d009847f7a24d009a17e5490c119cc2';
// const REDIRECT_URI = 'localhost:4200/musiclist';

export interface AuthResponseData {
  kind?: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService{

  user = new BehaviorSubject<User>(null);
  private tokenExpirationTimer: any;

  constructor(private http: HttpClient, private router: Router){}

  signup(email: string, password: string){
    return this.http.post<AuthResponseData>(SIGNUP_KEY,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(tap(resData => {
      this.handleAuthentication(
        resData.email,
        resData.localId,
        resData.idToken,
        +resData.expiresIn
      );
    }))
  }


  login(email: string, password: string){
    return this.http.post<AuthResponseData>(LOGIN_KEY,
      {
        email: email,
        password: password,
        returnSecureToken: true
      }
    ).pipe(tap(resData => {
      this.handleAuthentication(
        resData.email,
        resData.localId,
        resData.idToken,
        +resData.expiresIn
      );
    }))
  }

  logout(){
    this.user.next(null);
    this.router.navigate(['/home']);
  }

  autoLogout(expirationDuration: number){
    this.tokenExpirationTimer = setTimeout(() => {
      this.logout();
    }, expirationDuration);
  }

  private handleAuthentication(
    email: string,
    userId: string,
    token:string,
    expiresIn: number
  ){
    const expirationDate = new Date(new Date().getTime() + expiresIn * 1000);
    const user = new User(email, userId, token, expirationDate);
    this.user.next(user);
    this.autoLogout(expiresIn * 1000);
    localStorage.setItem('userData', JSON.stringify(user));
  }
}