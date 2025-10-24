import { Routes } from '@angular/router';
import { TodosListComponent } from './pages/todos-list/todos-list.component';

export const routes: Routes = [
   {
    path: "",
    component: MasterLayoutComponent,
    children: [
      {
        path: '',
        redirectTo: '/todos',
        pathMatch: 'full',
      },
      {
        path: "todos",
        component: TodosListComponent
      },
      {
        path: "users",
        component: TodosListComponent
      }
    ]
  },
];
