import { FC } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toggleTask, selectTask, deselectTask } from "@/redux/slices/taskSlice";
import { RootState } from "@/redux/store";
import { Task } from "@/types/task";

interface TaskItemProps {
  key: string;
  task: Task;
  toggleTask: (id: string, currentStatus: boolean) => void;
  deleteTask: (id: string, currentStatus: boolean) => void;
}

const TaskItem: FC<TaskItemProps> = ({ task }) => {
  const dispatch = useDispatch();
  const activeTasks = useSelector((state: RootState) => state.tasks.activeTasks);
  const isSelected = activeTasks.includes(task._id);

  const handleCheckboxChange = () => {
    if (isSelected) {
      dispatch(deselectTask(task._id));
    } else {
      dispatch(selectTask(task._id));
    }
  };

  const handleToggle = () => {
    dispatch(toggleTask(task._id));
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
