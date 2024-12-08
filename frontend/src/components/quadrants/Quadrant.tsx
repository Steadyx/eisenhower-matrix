import React, { useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import TaskList from "@/components/task/TaskList";
import TaskForm from "@/components/task/TaskForm";
import QuadrantHeader from "./QuadrantHeader";

import {
  createTaskRequest,
  updateTaskRequest,
  deleteTaskRequest,
  deleteTaskFromQuadrant
} from "@/redux/slices/taskSlice";

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

  const toggleTask = (id: string, currentStatus: boolean) => {
    dispatch(updateTaskRequest({ id, updates: { completed: !currentStatus } }));
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

  console.log('gloobalQuery', globalQuery);

  const filteredTasks = tasks.filter((task) => {
    const query = globalQuery ? globalQuery : searchQuery;

    return task.quadrantId === quadrantId && task.title.toLowerCase().includes(query.toLowerCase());
  });

  return (
    <div className="bg-gray-100 p-6 rounded-xl shadow-lg h-[400px] flex flex-col">
      <QuadrantHeader title={title} />

      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search tasks..."
        className="mb-4 p-2 border rounded focus:outline-none focus:ring focus:border-blue-300 text-gray-800"
      />

      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto pr-2">
          <TaskList
            tasks={filteredTasks}
            toggleTask={toggleTask}
            deleteTask={deleteTask}
          />
        </div>

        <div className="pt-4 mt-auto">
          {isAdding ? (
            <TaskForm addTask={addTask} cancel={() => setIsAdding(false)} />
          ) : (
            <button
              onClick={() => setIsAdding(true)}
              className="w-full py-2 border-dashed border-2 rounded-lg text-gray-600 hover:text-gray-800 hover:border-gray-400"
            >
              + Add Task
            </button>
          )}
        </div>
      </div>

      {/* Clear All Tasks Button */}
      <button
        onClick={() => dispatch(deleteTaskFromQuadrant(quadrantId))}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
      >
        Clear All Tasks
      </button>
    </div>
  );
};

export default Quadrant;
