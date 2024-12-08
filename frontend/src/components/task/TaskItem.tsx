import { FC } from "react";
import { useDispatch } from "react-redux";
import { toggleTask } from "@/redux/slices/taskSlice";
import { Task } from "@/types/task";

interface TaskItemProps {
  task: Task;
}

const TaskItem: FC<TaskItemProps> = ({ task }) => {
  const dispatch = useDispatch();

  return (
    <div
      className={`
        ${task.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}
        rounded-lg p-4 transition-all duration-200 hover:shadow-md cursor-pointer border
      `}
    >
      <div className="flex items-center justify-between">
        <span className={`text-gray-800 font-medium ${task.completed ? "text-green-800" : ""}`}>
          {task.title}
        </span>
        <input
          type="checkbox"
          checked={task.completed}
          onChange={() => dispatch(toggleTask(task.id))}
          className="h-5 w-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500 shadow-sm focus:ring-2"
        />
      </div>
    </div>
  );
};

export default TaskItem;
