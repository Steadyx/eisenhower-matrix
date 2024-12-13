import { createSlice, PayloadAction, createAction } from "@reduxjs/toolkit";

export interface Task {
  _id: string;
  title: string;
  description?: string;
  completed: boolean;
  selected: boolean;
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

export const fetchTasksRequest = createAction("tasks/fetchTasksRequest");
export const fetchTasksSuccess = createAction<Task[]>("tasks/fetchTasksSuccess");
export const fetchTasksFailure = createAction<string>("tasks/fetchTasksFailure");

export const createTaskRequest = createAction<{ title: string; quadrantId: string }>("tasks/createTaskRequest");
export const createTaskSuccess = createAction<Task>("tasks/createTaskSuccess");
export const createTaskFailure = createAction<string>("tasks/createTaskFailure");

export const updateTaskRequest = createAction<{ id: string; updates: Partial<Task> }>("tasks/updateTaskRequest");
export const updateTaskSuccess = createAction<Task>("tasks/updateTaskSuccess");
export const updateTaskFailure = createAction<string>("tasks/updateTaskFailure");

export const deleteTaskRequest = createAction<string>("tasks/deleteTaskRequest");
export const deleteTaskSuccess = createAction<string>("tasks/deleteTaskSuccess");
export const deleteTaskFailure = createAction<string>("tasks/deleteTaskFailure");

export const clearAllTasksRequest = createAction("tasks/clearAllTasksRequest");
export const clearAllTasksSuccess = createAction("tasks/clearAllTasksSuccess");
export const clearAllTasksFailure = createAction<string>("tasks/clearAllTasksFailure");

export const toggleSelectedTasksRequest = createAction("tasks/toggleSelectedTasksRequest");
export const toggleSelectedTasksSuccess = createAction<Task[]>("tasks/toggleSelectedTasksSuccess");
export const toggleSelectedTasksFailure = createAction<string>("tasks/toggleSelectedTasksFailure");

export const deleteTaskFromQuadrantRequest = createAction<string>("tasks/deleteTaskFromQuadrantRequest");
export const deleteTaskFromQuadrantSuccess = createAction<string>("tasks/deleteTaskFromQuadrantSuccess");
export const deleteTaskFromQuadrantFailure = createAction<string>("tasks/deleteTaskFromQuadrantFailure");

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {
    toggleTask(state, action: PayloadAction<string>) {
      const task = state.tasks.find((task) => task._id === action.payload);
      if (task) {
        task.completed = !task.completed;
      }
    },
    setSearchQuery(state, action: PayloadAction<string>) {
      state.searchQuery = action.payload;
    },
    setActiveTask(state, action: PayloadAction<string>) {
      if (!state.activeTasks.includes(action.payload)) {
        state.activeTasks.push(action.payload);
      } else {
        state.activeTasks = state.activeTasks.filter(id => id !== action.payload);
      }
    },
    clearActiveTasks(state) {
      state.activeTasks = [];
    },
    deleteActiveTasks(state, action: PayloadAction<string[]>) {
      const ids = action.payload;
      state.tasks = state.tasks.filter((task) => !ids.includes(task._id));
      state.activeTasks = state.activeTasks.filter((id) => !ids.includes(id));
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchTasksRequest, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTasksSuccess, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(fetchTasksFailure, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(createTaskRequest, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTaskSuccess, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        state.tasks.push(action.payload);
      })
      .addCase(createTaskFailure, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(updateTaskRequest, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateTaskSuccess, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        const index = state.tasks.findIndex((task) => task._id === action.payload._id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(updateTaskFailure, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTaskRequest, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskSuccess, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task._id !== action.payload);
        state.activeTasks = state.activeTasks.filter((id) => id !== action.payload);
      })
      .addCase(deleteTaskFailure, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(clearAllTasksRequest, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearAllTasksSuccess, (state) => {
        state.loading = false;
        state.tasks = [];
        state.activeTasks = [];
      })
      .addCase(clearAllTasksFailure, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(toggleSelectedTasksRequest, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(toggleSelectedTasksSuccess, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        action.payload.forEach((updatedTask) => {
          const index = state.tasks.findIndex((task) => task._id === updatedTask._id);
          if (index !== -1) {
            state.tasks[index] = updatedTask;
          }
        });
        state.activeTasks = [];
      })
      .addCase(toggleSelectedTasksFailure, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(deleteTaskFromQuadrantRequest, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteTaskFromQuadrantSuccess, (state, action: PayloadAction<string>) => {
        const quadrantId = action.payload;
        state.loading = false;
        state.tasks = state.tasks.filter((task) => task.quadrantId !== quadrantId);
      })
      .addCase(deleteTaskFromQuadrantFailure, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  toggleTask,
  setSearchQuery,
  setActiveTask,
  clearActiveTasks,
  deleteActiveTasks,
} = taskSlice.actions;

export default taskSlice.reducer;
