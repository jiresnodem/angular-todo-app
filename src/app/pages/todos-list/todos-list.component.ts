import { Component, Inject, OnInit } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { PersonService } from '../../core/services/person.service';
import { TodoService } from '../../core/services/todo.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TodoModalComponent } from '../../shared/components/todo-modal.component/todo-modal.component';
import { Label, Priority, Todo } from '../../models/todo.model';
import { MatButtonModule } from '@angular/material/button';
import { PersonModalComponent } from '../../shared/components/person-modal.component/person-modal.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-todos-list.component',
  imports: [ReactiveFormsModule, CommonModule, FormsModule, MatButtonModule],
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.css',
})
export class TodosListComponent implements OnInit {
  priorities: Priority[] = ['Facile', 'Moyen', 'Difficile'];
  labels: Label[] = ['HTML', 'CSS', 'NODE JS', 'JQUERY'];
  todos: Todo[] = [];
  personsMap = new Map<number, string>();

  // Filtre
  filterText = '';
  filterPriority: Priority | '' = '';
  filterLabel: Label | '' = '';

  // Pagination
  page = 1;
  pageSize = 2;
  totalItems = 0;
  get totalPages() {
    return Math.ceil(this.totalItems / this.pageSize);
  }

  get filteredTodos(): Todo[] {
    return this.todos
      .filter((t) => t.title.toLowerCase().includes(this.filterText.toLowerCase()))
      .filter((t) => (this.filterPriority ? t.priority === this.filterPriority : true))
      .filter((t) => (this.filterLabel ? t.labels.includes(this.filterLabel) : true));
  }

  get paginatedTodos(): Todo[] {
    const start = (this.page - 1) * this.pageSize;
    return this.filteredTodos.slice(start, start + this.pageSize);
  }

  changePage(newPage: number) {
    if (newPage >= 1 && newPage <= Math.ceil(this.totalItems / this.pageSize)) {
      this.page = newPage;
         this.loadTodos();
    }
  }

  constructor(
    private todoService: TodoService,
    private personService: PersonService,
    private dialog: MatDialog
  ) {}

  ngOnInit() {
    this.loadPersons();
    this.loadTodos();
  }

  loadPersons() {
    this.personService.fetchAllPersons().subscribe((persons) => {
      persons.forEach((p) => this.personsMap.set(p.id!, p.name));
    });
  }

  loadTodos() {
    this.todoService.fetchPaginatedTodos(this.page, this.pageSize).subscribe((res: any) => {
      console.log("%O", res.body);

      this.todos = res.body || [];
      this.totalItems = Number(res.headers.get('x-total-count') || 0);
    });
  }

  onAdd() {
    const dialogRef = this.dialog.open(TodoModalComponent, {
      width: '100%',
      maxWidth: '900px',
      data: { mode: 'create' },
      panelClass: 'p-4',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadTodos();
    });
  }

  onAddPerson() {
    const dialogRef = this.dialog.open(PersonModalComponent, {
      width: '100%',
      maxWidth: '900px',
      data: { mode: 'create' },
      panelClass: 'p-4',
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadTodos();
    });
  }

  onEdit(row: any) {
    const dialogRef = this.dialog.open(TodoModalComponent, {
      width: '100%',
      maxWidth: '900px',
      panelClass: 'p-4',
      data: { mode: 'edit', todo: row },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.loadTodos();
    });
  }

  onDelete(row: any) {
    if (confirm('Supprimer cette tâche ?')) {
      this.todoService.deleteTodo(row.id).subscribe(() => this.loadTodos());
    }
  }
}
