import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { Person } from '../../models/person.model';
import { PersonService } from '../../core/services/person.service';
import { TodoService } from '../../core/services/todo.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { TodoModalComponent } from '../../shared/components/todo-modal.component/todo-modal.component';
import { Todo } from '../../models/todo.model';
import { PersonModalComponent } from '../../shared/components/person-modal.component/person-modal.component';

@Component({
  selector: 'app-todos-list.component',
  imports: [ReactiveFormsModule],
  templateUrl: './todos-list.component.html',
  styleUrl: './todos-list.component.css',
})
export class TodosListComponent implements OnInit {
// source = new LocalDataSource();
  // settings = {
  //   actions: { add: false, edit: false, delete: false }, // lecture seule
  //   columns: {
  //     title: { title: 'Titre' },
  //     personName: { title: 'Personne' },
  //     startDate: { title: 'Début', valuePrepareFunction: (date) => new Date(date).toLocaleString() },
  //     endDate: { title: 'Fin', valuePrepareFunction: (date) => date ? new Date(date).toLocaleString() : '-' },
  //     priority: { title: 'Priorité' },
  //     labels: { title: 'Labels', valuePrepareFunction: (labels) => labels.join(', ') },
  //     completed: { title: 'Terminé', type: 'html', valuePrepareFunction: v => v ? '✅' : '❌' }
  //   }
  // };
  todos: Todo[] = [];
  personsMap = new Map<number,string>();
  // pagination state
  page = 1; limit = 10; total = 0;

  constructor(
    private todoService: TodoService,
    private personService: PersonService,
    private dialog: MatDialog
  ) {}

  ngOnInit(){
    this.loadPersons();
    this.loadTodos();
  }

  loadPersons(){
    this.personService.fetchAllPersons().subscribe(persons => {
      persons.forEach(p => this.personsMap.set(p.id!, p.name));
    });
  }

  loadTodos(){
    this.todoService.fetchPaginatedTodos(this.page, this.limit).subscribe((res: any) => {
      // if observe: 'response', use res.body and res.headers.get('x-total-count')
      this.todos = res;
      // map to table source with personName
      const rows = this.todos.map(t => ({ ...t, personName: this.personsMap.get(t.personId) || '—' }));
      // this.source.load(rows);
    });
  }

  onAdd(){
    const dialogRef = this.dialog.open(TodoModalComponent, { width: '100%', maxWidth: '800px',  data: { mode: 'create' } ,  panelClass: 'p-4' });
    dialogRef.afterClosed().subscribe(result => { if (result) this.loadTodos(); });
  }

  onAddPerson(){
    const dialogRef = this.dialog.open(PersonModalComponent, { width: '100%', maxWidth: '800px',  data: { mode: 'create' } ,  panelClass: 'p-4' });
    dialogRef.afterClosed().subscribe(result => { if (result) this.loadTodos(); });
  }

  onEdit(row: any){
    const dialogRef = this.dialog.open(TodoModalComponent, { width: '1000px', data: { mode: 'edit', todo: row } });
    dialogRef.afterClosed().subscribe(result => { if (result) this.loadTodos(); });
  }

  onDelete(row: any){
    if (confirm('Supprimer cette tâche ?')) {
      this.todoService.deleteTodo(row.id).subscribe(() => this.loadTodos());
    }
  }

}
