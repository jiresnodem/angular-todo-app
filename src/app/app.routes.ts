import { Routes } from '@angular/router';
import { TodosListComponent } from './pages/todos-list/todos-list.component';
import { MasterLayoutComponent } from './layouts/master/master-layout/master-layout.component';
import { UserListComponent } from './pages/user-list.component/user-list.component';

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
        component: UserListComponent
      }
    ]
  },
];
