import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Person } from '../../models/person.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PersonService {
  // Base URL of the API endpoint for Person entities
  private baseUrl = 'http://localhost:3000/persons';

  // Inject HttpClient to make HTTP requests
  private http = inject(HttpClient);

  /**
   * Fetch a paginated list of persons with optional search query.
   *
   * @param page - The current page number (default: 1)
   * @param limit - Number of results per page (default: 10)
   * @param q - Optional search keyword to filter persons
   * @returns An Observable containing an array of Person objects
   */
  fetchPaginatedPersons(page = 1, limit = 10, q?: string): Observable<Person[]> {
    const params: any = { _page: page, _limit: limit };
    if (q) params.q = q;
    return this.http.get<Person[]>(this.baseUrl, { params, observe: 'body' });
  }

  /**
   * Retrieve all persons without pagination or filters.
   *
   * @returns An Observable containing all Person objects
   */
  fetchAllPersons(): Observable<Person[]> {
    return this.http.get<Person[]>(this.baseUrl);
  }

  /**
   * Retrieve a specific person by ID.
   *
   * @param id - The ID of the person to retrieve
   * @returns An Observable containing the Person object
   */
  getPersonById(id: number): Observable<Person> {
    return this.http.get<Person>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new person record.
   *
   * @param p - The Person object to be created
   * @returns An Observable containing the newly created Person
   */
  createPerson(p: Person): Observable<Person> {
    return this.http.post<Person>(this.baseUrl, p);
  }

  /**
   * Update an existing person by ID.
   *
   * @param id - The ID of the person to update
   * @param p - The updated Person object
   * @returns An Observable containing the updated Person
   */
  updatePerson(id: number, p: Person): Observable<Person> {
    return this.http.put<Person>(`${this.baseUrl}/${id}`, p);
  }

  /**
   * Delete a person record by ID.
   *
   * @param id - The ID of the person to delete
   * @returns An Observable that completes when the deletion is successful
   */
  deletePerson(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

  /**
   * Find persons by their name using a query string.
   *
   * @param name - The name or part of the name to search for
   * @returns An Observable containing a list of matching Person objects
   */
  searchPersonsByName(name: string): Observable<Person[]> {
    return this.http.get<Person[]>(`${this.baseUrl}?name=${encodeURIComponent(name)}`);
  }
}
