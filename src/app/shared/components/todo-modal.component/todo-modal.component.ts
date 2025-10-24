import { ChangeDetectionStrategy, Component, Inject, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Person } from '../../../models/person.model';
import { map, Observable, startWith } from 'rxjs';
import { PersonService } from '../../../core/services/person.service';
import { TodoService } from '../../../core/services/todo.service';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Todo } from '../../../models/todo.model';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatSelect, MatSelectModule } from '@angular/material/select';
import { MatInputModule } from '@angular/material/input';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import {MatIconModule} from '@angular/material/icon';
import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-todo-modal.component',
  providers: [provideNativeDateAdapter()],
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatAutocompleteModule,
    MatSelectModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    MatButtonModule,
    MatCardModule
  ],
  templateUrl: './todo-modal.component.html',
  styleUrl: './todo-modal.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TodoModalComponent {
  form!: FormGroup;
  persons: Person[] = [];
  filteredPersons!: Observable<Person[]>;
  priorities = ['Facile', 'Moyen', 'Difficile'];
  labels = ['HTML', 'CSS', 'NODE JS', 'JQUERY'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<TodoModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private personService: PersonService,
    private todoService: TodoService
  ) {}

  ngOnInit() {
    this.form = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), this.trimValidator]],
      personId: [null, Validators.required],
      startDate: [new Date(), Validators.required],
      endDate: [{ value: null, disabled: false }],
      priority: ['Moyen', Validators.required],
      labels: [[]],
      description: [''],
      completed: [false],
    });

    this.personService.fetchAllPersons().subscribe((p) => {
      this.persons = p;
      this.filteredPersons = this.form.get('personId')!.valueChanges.pipe(
        startWith(''),
        map((val) => this._filterPersons(val))
      );
    });
  }



  get formControls() {
    return this.form.controls;
  }

  private _filterPersons(val: any) {
    const filter = typeof val === 'string' ? val.toLowerCase() : '';
    return this.persons.filter((p) => p.name.toLowerCase().includes(filter));
  }

  displayPerson(personId: number) {
    const p = this.persons.find((x) => x.id === personId);
    return p ? p.name : '';
  }

  trimValidator(control: any) {
    if (control.value && typeof control.value === 'string' && control.value.trim().length < 3) {
      return { trimMin: true };
    }
    return null;
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    const payload: Todo = {
      title: this.form.value.title.trim(),
      personId: this.form.value.personId,
      startDate: this.form.value.startDate,
      endDate: this.form.get('endDate')!.disabled
        ? this.form.get('endDate')!.value
        : this.form.value.endDate,
      priority: this.form.value.priority,
      labels: this.form.value.labels,
      description: this.form.value.description,
      completed: this.form.value.completed,
    };
    if (this.data?.mode === 'create') {
      this.todoService.createTodo(payload).subscribe(() => this.dialogRef.close(true));
    } else {
      const id = this.data.todo.id;
      this.todoService.updateTodo(id, payload).subscribe(() => this.dialogRef.close(true));
    }
  }

  close() {
    this.dialogRef.close(false);
  }
}
