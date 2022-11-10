import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ChessBoardComponent } from './chess-board/chess-board.component';
import { HomeComponent } from './home/home.component';

const routes: Routes = [
  {
    path: 'mainpage',
    component: HomeComponent,
  },
  {
    path: '',
    redirectTo: 'mainpage',
    pathMatch: 'full',
  },
  {
    path: 'iframepage',
    component: ChessBoardComponent,
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
