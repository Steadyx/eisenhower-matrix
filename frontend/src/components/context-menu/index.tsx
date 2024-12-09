import { FC } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";
import { deleteActiveTasks, toggleSelectedTasks } from "@redux/slices/taskSlice";
import { Task } from "src/types/task";

const GlobalContextMenu: FC = () => {
  const dispatch = useDispatch();
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const numOfSelected = tasks.filter((task: Task) => task.selected).length;
  const selectedTasks = tasks.filter((task: Task) => task.selected).map((task: Task) => task._id);

  if (numOfSelected === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 shadow-lg rounded-md border p-4 flex gap-4 justify-center items-center">
      <span>{numOfSelected} task(s) selected</span>

      <button
        onClick={() => dispatch(toggleSelectedTasks())}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Toggle Selected
      </button>
      <button
        onClick={() => dispatch(deleteActiveTasks(selectedTasks))}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Delete Selected
      </button>
    </div>
  );
};

export default GlobalContextMenu;
