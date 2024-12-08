import { FC } from "react";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  toggleTask: (id: string) => void;
  deleteTask: (id: string) => void;
}

const TaskList: FC<TaskListProps> = ({ tasks, toggleTask, deleteTask }) => (
  <div className="space-y-3">
    {tasks.map((task) => (
      <TaskItem key={task.id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} />
    ))}
  </div>
);

export default TaskList;
