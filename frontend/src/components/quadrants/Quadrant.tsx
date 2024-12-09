import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@redux/store";
import TaskList from "@components/task/TaskList";
import TaskForm from "@components/task/TaskForm";
import QuadrantHeader from "./QuadrantHeader";
import ConfirmationModal from "@components/ConfirmationModal";

import {
  createTaskRequest,
  updateTaskRequest,
  fetchTasksRequest,
  deleteTaskRequest,
  deleteTaskFromQuadrantRequest,
} from "@redux/slices/taskSlice";

interface QuadrantProps {
  quadrantId: string;
  title: string;
}

const Quadrant: React.FC<QuadrantProps> = ({ quadrantId, title }) => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const globalQuery = useSelector((state: RootState) => state.tasks.searchQuery);
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const tasksInQuadrant = tasks.filter((task) => task.quadrantId === quadrantId);

  const openModal = () => {
    if (tasksInQuadrant.length === 0) return;
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const toggleTask = (id: string, currentStatus: boolean) => {
    const updates = { completed: !currentStatus, selected: !currentStatus };
    dispatch(updateTaskRequest({ id, updates }));
  };

  const deleteTask = (id: string) => {
    dispatch(deleteTaskRequest(id));
  };

  const addTask = (title: string) => {
    dispatch(createTaskRequest({ title, quadrantId }));
    setIsAdding(false);
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const filteredTasks = tasks.filter((task) => {
    const query = globalQuery ? globalQuery : searchQuery;
    return task.quadrantId === quadrantId && task.title.toLowerCase().includes(query.toLowerCase());
  });

  const confirmDeleteAllTasks = () => {
    if (tasksInQuadrant.length === 0) return;
    dispatch(deleteTaskFromQuadrantRequest(quadrantId));
    setIsModalOpen(false);
  };

  useEffect(() => {
    dispatch(fetchTasksRequest());
  }, [dispatch]);

  return (
    <div className="dark:bg-gray-100 bg-softWhite rounded-xl shadow-lg h-[450px] sm:h-[500px] lg:h-[550px] flex flex-col overflow-hidden">
      <div className="p-4 sm:p-6 flex flex-col h-full">
        {/* Fixed Header Section */}
        <div className="flex-none">
          <QuadrantHeader title={title} />
          <div className="mb-4">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearch}
              placeholder="Search tasks..."
              className="w-full p-2 sm:p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300 text-gray-800 transition-all"
            />
          </div>
        </div>

        <div className="flex-1 overflow-hidden flex flex-col min-h-0">
          <div className="overflow-y-auto flex-1 pr-2">
            <TaskList
              tasks={filteredTasks}
              toggleTask={toggleTask}
              deleteTask={deleteTask}
            />
          </div>
        </div>

        <div className="flex-none mt-4">
          <div className="flex flex-col sm:flex-row justify-between items-stretch sm:items-center gap-3">
            <div className="flex-1">
              {isAdding ? (
                <TaskForm addTask={addTask} cancel={() => setIsAdding(false)} />
              ) : (
                <button
                  onClick={() => setIsAdding(true)}
                  className="w-full py-2 px-4 border-stone-900 dark:border-gray-400 border-dashed border-2 rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-400 transition-colors"
                >
                  + Add Task
                </button>
              )}
            </div>
            <button
              onClick={openModal}
              className="w-full sm:w-auto px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              Delete Tasks
            </button>
          </div>
        </div>
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

export default Quadrant;
