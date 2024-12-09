import { FC } from "react";
import { useDispatch } from "react-redux";
import { updateTaskRequest } from "@redux/slices/taskSlice"
import { Task } from "src/types/task";

interface TaskItemProps {
  task: Task;
  toggleTask: (id: string, currentStatus: boolean) => void;
  deleteTask: (id: string) => void;
}

const TaskItem: FC<TaskItemProps> = ({ task }) => {
  const dispatch = useDispatch();
  const isSelected = task.selected;

  const handleCheckboxChange = () => {
    const updates = {
      selected: !isSelected,
    };
    dispatch(updateTaskRequest({ id: task._id, updates }));
  };

  const handleToggle = () => {
    const updates = {
      completed: !task.completed,
    };
    dispatch(updateTaskRequest({ id: task._id, updates }));
  };

  return (
    <div
      className={`
        ${task.completed ? "bg-green-50 border-green-200" : "bg-white border-gray-200"}
        rounded-lg p-4 transition-all duration-200 hover:shadow-md cursor-pointer border flex items-center
      `}
    >
      <input
        type="checkbox"
        checked={isSelected}
        onChange={handleCheckboxChange}
        className="mr-4 h-5 w-5 rounded-md border-gray-300 text-blue-600 focus:ring-blue-500"
      />
      <div className="flex-1" onClick={handleToggle}>
        <span className={`text-gray-800 font-medium ${task.completed ? "text-green-800 line-through" : ""}`}>
          {task.title}
        </span>
      </div>
    </div>
  );
};

export default TaskItem;
