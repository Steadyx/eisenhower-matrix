import { FC, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";
import {
  deleteActiveTasks,
  toggleSelectedTasksRequest
} from "@redux/slices/taskSlice";

const GlobalContextMenu: FC = () => {
  const dispatch = useDispatch();
  const activeTasks = useSelector((state: RootState) => state.tasks.activeTasks);
  const numOfSelected = activeTasks.length;

  useEffect(() => {
    dispatch(toggleSelectedTasksRequest());
  }, [dispatch]);


  if (numOfSelected === 0) return null;

  return (
    <div className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-white text-gray-800 shadow-lg rounded-md border p-4 flex gap-4 justify-center items-center">
      <span>{numOfSelected} task(s) selected</span>
      <button
        onClick={() => dispatch(toggleSelectedTasksRequest())}
        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
      >
        Toggle Selected
      </button>
      <button
        onClick={() => dispatch(deleteActiveTasks(activeTasks))}
        className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Delete Selected
      </button>
    </div>
  );
};

export default GlobalContextMenu;
