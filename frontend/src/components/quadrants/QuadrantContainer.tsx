import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAllTasksRequest, fetchTasksRequest } from "@redux/slices/taskSlice";
import LogoutButton from "@components/LogoutButton";
import Quadrant from "./Quadrant";
import SearchBar from "@components/search";
import ConfirmationModal from "@components/ConfirmationModal"; // Import the modal
import { RootState } from "@redux/store";

const QuadrantContainer = () => {
  const dispatch = useDispatch();
  const tasksState = useSelector((state: RootState) => state.tasks);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchTasksRequest());
  }, [dispatch]);

  const openModal = () => {
    if (tasksState.tasks.length === 0) return;
    setIsModalOpen(true);
  };

  const closeModal = () => {
    if (tasksState.tasks.length === 0) return;
    setIsModalOpen(false);
  };

  const confirmDeleteAllTasks = () => {
    if (tasksState.loading) return;
    dispatch(clearAllTasksRequest());
    setIsModalOpen(false);
  };

  return (
    <div className="p-8 w-full max-w-screen-xl">
      <div className="flex justify-between items-center mb-4">
        <div className="flex justify-between items-center mb-4 gap-4">
          <SearchBar />
          <div className="flex justify-end">
            <button
              onClick={openModal} // Open the modal instead of directly deleting
              className="px-4 py-2 my-8 bg-red-500 text-white rounded-lg hover:bg-red-600"
            >
              Delete All Tasks
            </button>
          </div>
        </div>
        <LogoutButton />
      </div>

      {tasksState.error && <p className="text-red-500">{tasksState.error}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <Quadrant title="Urgent & Important" quadrantId="urgent-important" />
        <Quadrant title="Not Urgent & Important" quadrantId="not-urgent-important" />
        <Quadrant title="Urgent & Not Important" quadrantId="urgent-not-important" />
        <Quadrant title="Not Urgent & Not Important" quadrantId="not-urgent-not-important" />
      </div>

      <ConfirmationModal
        isOpen={isModalOpen}
        title="Confirm Delete All Tasks"
        message="Are you sure you want to delete all tasks? This action cannot be undone."
        onConfirm={confirmDeleteAllTasks}
        onCancel={closeModal}
      />
    </div>
  );
};

export default QuadrantContainer;
