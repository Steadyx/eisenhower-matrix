import { FC } from "react";
import { Task } from "src/types/task";
import TaskItem from "./TaskItem";

interface TaskListProps {
  tasks: Task[];
  toggleTask: (id: string, currentStatus: boolean) => void;
  deleteTask: (id: string) => void;
}

const TaskList: FC<TaskListProps> = ({ tasks, toggleTask, deleteTask }) => {
  return (
    <div className="space-y-3">
      {tasks.map((task) => (
        <TaskItem
          key={task._id}
          task={task}
          toggleTask={toggleTask}
          deleteTask={deleteTask}
        />
      ))}
    </div>
  );
};

export default TaskList;
