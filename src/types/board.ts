export interface Board {
  id: number;
  title: string;
  todos: Todo[];
}

export interface Todo {
  id: number;
  content: string;
}
