import { FC } from "react";
import TaskItem from "./TaskItem";
import { Task } from "@/types/task"

interface TaskListProps {
  tasks: Task[];
  toggleTask: (id: string, currentStatus: boolean) => void;
  deleteTask: (id: string, currentStatus: boolean) => void;
}

const TaskList: FC<TaskListProps> = ({ tasks, toggleTask, deleteTask }) => (
  <div className="space-y-3">
    {tasks.map((task) => (
      <TaskItem key={task.id} task={task} toggleTask={toggleTask} deleteTask={deleteTask} />
    ))}
  </div>
);

export default TaskList;
