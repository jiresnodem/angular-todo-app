import { Component, Inject } from '@angular/core';
import { Person } from '../../../models/person.model';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { PersonService } from '../../../core/services/person.service';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {MatCardModule} from '@angular/material/card';

@Component({
  selector: 'app-person-modal.component',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    MatButtonModule,
       MatCardModule
  ],
  templateUrl: './person-modal.component.html',
  styleUrl: './person-modal.component.css',
})
export class PersonModalComponent {
  form!: FormGroup;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<PersonModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private personService: PersonService
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      name: ['', [Validators.required, this.trimMinValidator]],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
    });

    // Si édition, remplir le formulaire
    if (this.data?.mode === 'edit' && this.data.person) {
      this.form.patchValue(this.data.person);
    }
  }

  get formControls() {
    return this.form.controls;
  }

  trimMinValidator(control: any) {
    if (control.value && control.value.trim().length < 3) {
      return { trimMin: true };
    }
    return null;
  }

  save() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const person: Person = {
      ...this.form.value,
      name: this.form.value.name.trim(),
    };

    // Vérifier unicité du nom
    this.personService.searchPersonsByName(person.name).subscribe((res) => {
      const exists =
        res.length > 0 && (this.data?.mode !== 'edit' || res[0].id !== this.data.person.id);
      if (exists) {
        this.form.get('name')?.setErrors({ notUnique: true });
        return;
      }

      if (this.data?.mode === 'create') {
        this.personService.createPerson(person).subscribe(() => this.dialogRef.close(true));
      } else {
        this.personService
          .updatePerson(this.data.person.id!, person)
          .subscribe(() => this.dialogRef.close(true));
      }
    });
  }

  close() {
    this.dialogRef.close(false);
  }
}
