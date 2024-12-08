import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Task {
  _id: string;
  title: string;
  completed: boolean;
  quadrantId: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  searchQuery: string;
  activeTasks: string[];
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  searchQuery: "",
  activeTasks: [],
};

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    fetchTasksRequest(state) {
      state.loading = true;
      state.error = null;
    },
    fetchTasksSuccess(state, action: PayloadAction<Task[]>) {
      state.loading = false;
      state.tasks = action.payload;
    },
    fetchTasksFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    createTaskRequest(state, _action: PayloadAction<{ title: string; quadrantId: string }>) {
      state.loading = true;
      state.error = null;
    },
    createTaskSuccess(state, action: PayloadAction<Task>) {
      state.loading = false;
      state.tasks.push(action.payload);
    },
    createTaskFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    updateTaskRequest(state, _action: PayloadAction<{ id: string; updates: Partial<Task> }>) {
      state.loading = true;
      state.error = null;
    },
    updateTaskSuccess(state, action: PayloadAction<Task>) {
      state.loading = false;
      const index = state.tasks.findIndex((task) => task._id === action.payload._id);
      if (index !== -1) {
        state.tasks[index] = action.payload;
      }
    },
    updateTaskFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    deleteTaskRequest(state, _action: PayloadAction<string>) {
      state.loading = true;
      state.error = null;
    },
    deleteTaskSuccess(state, action: PayloadAction<string>) {
      state.loading = false;
      state.tasks = state.tasks.filter((task) => task._id !== action.payload);
      state.activeTasks = state.activeTasks.filter((id) => id !== action.payload);
    },
    deleteTaskFailure(state, action: PayloadAction<string>) {
      state.loading = false;
      state.error = action.payload;
    },
    clearAllTasks(state) {
      state.tasks = [];
      state.activeTasks = [];
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    toggleTask(state, action: PayloadAction<string>) {
      const task = state.tasks.find((task) => task._id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    selectTask(state, action: PayloadAction<string>) {
      if (!state.activeTasks.includes(action.payload)) {
        state.activeTasks.push(action.payload);
      }
    },
    deselectTask(state, action: PayloadAction<string>) {
      state.activeTasks = state.activeTasks.filter((id) => id !== action.payload);
    },
    clearActiveTasks(state) {
      state.activeTasks = [];
    },
    toggleSelectedTasks(state) {
      state.activeTasks.forEach((id) => {
        const task = state.tasks.find((task) => task._id === id);
        if (task) {
          task.completed = !task.completed;
        }
      });
    },
    deleteActiveTasks(state) {
      state.tasks = state.tasks.filter((task) => !state.activeTasks.includes(task._id));
      state.activeTasks = [];
    },
    deleteTaskFromQuadrant(state, action: PayloadAction<string>) {
      state.tasks = state.tasks.filter((task) => task.quadrantId !== action.payload);
    },
  },
});

export const {
  fetchTasksRequest,
  fetchTasksSuccess,
  fetchTasksFailure,
  createTaskRequest,
  createTaskSuccess,
  createTaskFailure,
  updateTaskRequest,
  updateTaskSuccess,
  updateTaskFailure,
  deleteTaskRequest,
  deleteTaskSuccess,
  deleteTaskFailure,
  clearAllTasks,
  setSearchQuery,
  toggleTask,
  selectTask,
  deselectTask,
  toggleSelectedTasks,
  deleteActiveTasks,
  deleteTaskFromQuadrant,
} = taskSlice.actions;

export default taskSlice.reducer;