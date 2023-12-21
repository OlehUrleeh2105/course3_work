import { PostPageComponent } from './post-page/post-page.component';
import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { MainLayoutComponent } from './shared/components/main-layout/main-layout.component';
import { HomePageComponent } from './home-page/home-page.component';
import { LoginUserComponent } from './login-user/login-user.component';
import { AddPageComponent } from './add-page/add-page.component';
import { AuthViewerGuard } from './shared/services/authViewer.guard';
import { ForAllComponent } from './for-all/for-all.component';

const routes: Routes = [
  {
    path: '', component: MainLayoutComponent, children: [
      {path: '', redirectTo: '/loginUser', pathMatch: 'full'},
      {path: 'loginUser', component: LoginUserComponent},
      {path: 'main', component: HomePageComponent, canActivate: [AuthViewerGuard]},
      {path: 'post/:id', component: PostPageComponent, canActivate: [AuthViewerGuard]},
      {path: 'add', component: AddPageComponent, canActivate: [AuthViewerGuard]},
      {path: 'forAll', component: ForAllComponent}
    ]
  },
  {
    path: 'admin', loadChildren: () => import('./admin/admin.module').then(x => x.AdminModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
