import { NgModule, Provider } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { HomePageComponent } from './home-page/home-page.component';
import { PostPageComponent } from './post-page/post-page.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { PostComponent } from './shared/components/post/post.component';
import { SharedModule } from './shared/shared.module';
import { AuthInterceptor } from './shared/auth.interceptor';
import { SearchMainPipe } from './shared/pipes/searchMain.pipe';
import { SearchNameMainPipe } from './shared/pipes/searchNameMain.pipe';
import { SearchTypeMainPipe } from './shared/pipes/filtrTypeMain.pipe';
import { HasStuffMainPipe } from './shared/pipes/hasStuffMain.pipe';
import { AddPageComponent } from './add-page/add-page.component';
import { ForAllComponent } from './for-all/for-all.component';

const INTERCEPTOR_PROVIDER: Provider = {
  provide: HTTP_INTERCEPTORS,
  multi: true,
  useClass: AuthInterceptor
}

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    HomePageComponent,
    PostPageComponent,
    LoginUserComponent,
    PostComponent,
    SearchMainPipe,
    SearchNameMainPipe,
    SearchTypeMainPipe,
    HasStuffMainPipe,
    AddPageComponent,
    ForAllComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    AppRoutingModule,
    SharedModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [INTERCEPTOR_PROVIDER],
  bootstrap: [AppComponent]
})
export class AppModule { }
