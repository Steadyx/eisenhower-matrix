import Task from "@models/Task";

export const getAllTasks = async () => {
  return Task.find();
};

export const createTask = async (title: string, quadrantId: string) => {
  const task = new Task({ title, quadrantId });
  return task.save();
};

export const updateTask = async (id: string, updates: object) => {
  return Task.findByIdAndUpdate(id, updates, { new: true });
};

export const deleteTask = async (id: string) => {
  return Task.findByIdAndDelete(id);
};
