import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Todo } from '../../models/todo.model';

@Injectable({
  providedIn: 'root',
})
export class TodoService {
  // Base URL of the API endpoint for Todos
  private baseUrl = 'http://localhost:3000/api/todos';

  // Inject HttpClient to perform HTTP requests
  private http = inject(HttpClient);

  /**
   * Fetch a paginated list of todos with optional filters.
   *
   * @param page - The current page number (default: 1)
   * @param limit - Number of items per page (default: 10)
   * @param filters - Optional filters (priority, label, personId)
   * @returns An Observable containing an array of Todo objects
   */
  fetchPaginatedTodos(page = 1, limit = 10, filters: any = {}): Observable<Todo[]> {
    let params = new HttpParams().set('_page', page).set('_limit', limit);
    if (filters.priority) params = params.set('priority', filters.priority);
    if (filters.label) params = params.set('labelsLike', filters.label);
    if (filters.personId) params = params.set('personId', filters.personId);
    return this.http.get<Todo[]>(this.baseUrl, { params, observe: 'body' });
  }

  /**
   * Retrieve all todos without pagination or filters.
   *
   * @returns An Observable containing all Todo objects
   */
  fetchAllTodos() {
    return this.http.get<Todo[]>(this.baseUrl);
  }

  /**
   * Retrieve a specific todo by its ID.
   *
   * @param id - The ID of the todo to retrieve
   * @returns An Observable containing the Todo object
   */
  getTodoById(id: number): Observable<Todo> {
    return this.http.get<Todo>(`${this.baseUrl}/${id}`);
  }

  /**
   * Create a new todo item.
   *
   * @param t - The Todo object to be created
   * @returns An Observable containing the created Todo
   */
  createTodo(t: Todo) {
    return this.http.post<Todo>(this.baseUrl, t);
  }

  /**
   * Update an existing todo item by ID.
   *
   * @param id - The ID of the todo to update
   * @param t - The updated Todo object
   * @returns An Observable containing the updated Todo
   */
  updateTodo(id: number, t: Todo) {
    return this.http.put<Todo>(`${this.baseUrl}/${id}`, t);
  }

  /**
   * Delete a todo item by ID.
   *
   * @param id - The ID of the todo to delete
   * @returns An Observable that completes when the deletion is done
   */
  deleteTodo(id: number) {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }
}
