import { useEffect } from "react";
import Quadrant from "./Quadrant";
import SearchBar from "@/components/search";
import { useDispatch, useSelector } from "react-redux";
import { clearAllTasksRequest, fetchTasksRequest } from "@/redux/slices/taskSlice";
import LogoutButton from "@/components/LogoutButton";
import { RootState } from "@/redux/store";

const QuadrantContainer = () => {
  const dispatch = useDispatch();
  const tasksState = useSelector((state: RootState) => state.tasks);

  useEffect(() => {
    dispatch(fetchTasksRequest());
  }, [dispatch]);

  return (
    <div className="p-8 w-full">
      <div className="flex justify-between items-center mb-4">
        <div className="flex justify-between items-center mb-4 gap-4">
          <SearchBar />
          <div className="flex justify-end">
            <button
              onClick={() => dispatch(clearAllTasksRequest())}
              className="px-4 py-2 my-8 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete All Tasks
            </button>
          </div>
        </div>
        <LogoutButton />
      </div>
      {tasksState.loading && <p>Loading tasks...</p>}
      {tasksState.error && <p className="text-red-500">{tasksState.error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <Quadrant title="Urgent & Important" quadrantId="urgent-important" />
        <Quadrant title="Not Urgent & Important" quadrantId="not-urgent-important" />
        <Quadrant title="Urgent & Not Important" quadrantId="urgent-not-important" />
        <Quadrant title="Not Urgent & Not Important" quadrantId="not-urgent-not-important" />
      </div>
    </div>
  );
};

export default QuadrantContainer;
