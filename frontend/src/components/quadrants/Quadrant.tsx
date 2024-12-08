import { FC, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/redux/store";
import TaskList from "@/components/task/TaskList";
import TaskForm from "@/components/task/TaskForm";
import QuadrantHeader from "./QuadrantHeader";
import { addTask as addTaskAction, toggleTask as toggleTaskAction, deleteActiveTasks as deleteTaskAction } from "@/redux/slices/taskSlice";

interface QuadrantProps {
  quadrantId: string;
  title: string;
}

const Quadrant: FC<QuadrantProps> = ({ title, quadrantId }) => {
  const tasks = useSelector((state: RootState) => state.tasks.tasks);
  const searchQuery = useSelector((state: RootState) => state.tasks.searchQuery);
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);

  const toggleTask = (id: string) => {
    dispatch(toggleTaskAction(id));
  };

  const deleteTask = () => {
    dispatch(deleteTaskAction());
  };

  const addTask = (title: string) => {
    const newTask = { id: Date.now().toString(), title, completed: false, quadrantId };
    dispatch(addTaskAction(newTask));
    setIsAdding(false);
  };

  const filteredTasks = tasks.filter(
    (task) =>
      task.title.toLowerCase().includes(searchQuery.toLowerCase()) &&
      task.quadrantId === quadrantId
  );

  return (
    <div className="bg-gray-100 p-6 rounded-xl shadow-lg h-[400px] flex flex-col">
      <QuadrantHeader title={title} />
      <div className="flex-1 flex flex-col min-h-0">
        <div className="flex-1 overflow-y-auto pr-2">
          <TaskList tasks={filteredTasks} toggleTask={toggleTask} deleteTask={deleteTask} />
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
    </div>
  );
};

export default Quadrant;
