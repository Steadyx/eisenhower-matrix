export interface Task {
  id: string;
  quadrantId: string;
  title: string;
  description?: string;
  completed: boolean;
}
