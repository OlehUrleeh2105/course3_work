import { HttpClient, HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, Subject, catchError, map, switchMap, tap, throwError } from "rxjs";
import { FbAuthResponse, User } from "src/app/shared/interfaces";
import { environment } from "src/environments/environment";

@Injectable({providedIn: 'root'})
export class AuthService {

  public error$: Subject<string> = new Subject<string>();

  constructor(
    private http: HttpClient
  ) {}

  get token(): string | null {
    const expDate = new Date(localStorage.getItem('fb-token-exp')!);
    if (new Date() > expDate) {
      this.logout();
      return null;
    }
    return localStorage.getItem('fb-token');
  }

  getUserByEmail(email: string): Observable<boolean> {
    return this.http.get<{[key: string]: any}>(`${environment.fbDbUrl}/users.json`)
    .pipe(
      map((response) => {
        const users = Object.values(response);
        const user = users.find(u => u?.email === email);
        return user ? user.isAdmin : false;
      })
    );
  }

  login(user: User, toAdmin: boolean): Observable<any> {
    if (toAdmin) {
      return this.getUserByEmail(user?.email).pipe(
        tap(isAdmin => {
          if (!isAdmin) {
            location.reload();
            alert("В цього акаунту немає прав адміністратора");
            throw new Error("В цього акаунту немає прав адміністратора");
          }
        }),
        switchMap(() => this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, { ...user, returnSecureToken: true })),
        tap(this.setToken),
        catchError(this.handleError.bind(this)),
      );
    } else {
      return this.http.post(`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${environment.apiKey}`, { ...user, returnSecureToken: true }).pipe(
        tap(this.setToken),
        catchError(this.handleError.bind(this))
      );
    }
  }

  logout() {
    this.setToken(null);
  }

  isAuthenticated(): boolean {
    return !!this.token;
  }

  private handleError(error: HttpErrorResponse) {
    const {message} = error.error.error;

    switch (message) {
      case 'INVALID_EMAIL':
        this.error$.next('Неправильний email');
        break;
      case 'INVALID_PASSWORD':
        this.error$.next('Неправильний пароль');
        break;
      case 'EMAIL_NOT_FOUND':
        this.error$.next('Email не знайдено');
        break;
    }

    return throwError(error);
  }

  private setToken(response: FbAuthResponse | null | any) {
    if (response) {
      const expDate = new Date(new Date().getTime() + +response.expiresIn * 1000);
      localStorage.setItem('fb-token', response.idToken);
      localStorage.setItem('fb-token-exp', expDate.toString());
    } else {
      localStorage.clear();
    }
  }
}
