export interface Task {
  _id: string;
  quadrantId: string;
  selected: boolean;
  title: string;
  description?: string;
  completed: boolean;
}
