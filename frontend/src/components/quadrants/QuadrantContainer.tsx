import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { clearAllTasksRequest, fetchTasksRequest } from "@redux/slices/taskSlice";
import LogoutButton from "@components/LogoutButton";
import Quadrant from "./Quadrant";
import SearchBar from "@components/search";
import ConfirmationModal from "@components/ConfirmationModal";
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
    <div className="min-h-screen w-full dark:bg-gray-800 bg-cyan-400 transition-colors py-10">
      <div className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex-1">
            <SearchBar />
          </div>
          <div className="flex gap-3 justify-center sm:justify-end">
            <button
              onClick={openModal}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors w-full sm:w-auto"
            >
              Delete All Tasks
            </button>
            <div className="hidden sm:block">
              <LogoutButton />
            </div>
          </div>
        </div>

        <div className="sm:hidden mb-6">
          <LogoutButton />
        </div>

        {tasksState.error && (
          <p className="text-red-500 mb-4 text-center">{tasksState.error}</p>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <Quadrant
            title="Urgent & Important"
            quadrantId="urgent-important"
          />
          <Quadrant
            title="Not Urgent & Important"
            quadrantId="not-urgent-important"
          />
          <Quadrant
            title="Urgent & Not Important"
            quadrantId="urgent-not-important"
          />
          <Quadrant
            title="Not Urgent & Not Important"
            quadrantId="not-urgent-not-important"
          />
        </div>

        <ConfirmationModal
          isOpen={isModalOpen}
          title="Confirm Delete All Tasks"
          message="Are you sure you want to delete all tasks? This action cannot be undone."
          onConfirm={confirmDeleteAllTasks}
          onCancel={closeModal}
        />
      </div>
    </div>
  );
};

export default QuadrantContainer;
