export interface Task {
  _id: string;
  quadrantId: string;
  title: string;
  description?: string;
  completed: boolean;
}
