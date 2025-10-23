export type Priority = 'Facile' | 'Moyen' | 'Difficile';
export type Label = 'HTML' | 'CSS' | 'NODE JS' | 'JQUERY';

export interface Todo {
  id?: number;
  title: string;
  personId: number;
  startDate: string;
  endDate?: string | null;
  priority: Priority;
  labels: Label[];
  description?: string;
  completed: boolean;
}
