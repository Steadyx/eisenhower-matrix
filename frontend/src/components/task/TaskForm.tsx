import { FC, useState } from "react";

interface TaskFormProps {
  addTask: (title: string) => void;
  cancel: () => void;
}

const TaskForm: FC<TaskFormProps> = ({ addTask, cancel }) => {
  const [newTaskTitle, setNewTaskTitle] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newTaskTitle.trim()) {
      addTask(newTaskTitle.trim());
      setNewTaskTitle("");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex gap-2">
        <div className="flex-1 w-32">
          <input
            type="text"
            value={newTaskTitle}
            onChange={(e) => setNewTaskTitle(e.target.value)}
            placeholder="Enter task title..."
            className="w-full px-4 py-2 border rounded-lg focus:ring-blue-500 focus:border-blue-500 text-gray-800"
            autoFocus
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600"
        >
          Add
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-gray-200 text-gray-600 rounded-lg hover:bg-gray-300"
          onClick={cancel}
        >
          Cancel
        </button>
      </div>
    </form>
  );
};

export default TaskForm;
