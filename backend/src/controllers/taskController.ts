import { Request, Response } from "express";
import * as taskService from "@services/taskService";

export const getTasks = async (_req: Request, res: Response) => {
  try {
    const tasks = await taskService.getAllTasks();
    res.status(200).json(tasks);
  } catch (error) {
    if (error instanceof Error) {
      res.status(500).json({ error: error.message });
    }
  }
};

export const addTask = async (req: Request, res: Response) => {
  try {
    const { title, quadrantId } = req.body;
    const task = await taskService.createTask(title, quadrantId);
    res.status(201).json(task);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};

export const updateTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;
    const task = await taskService.updateTask(id, updates);
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};


export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const task = await taskService.deleteTask(id);
    res.status(200).json(task);
  } catch (error) {
    if (error instanceof Error) {
      res.status(400).json({ error: error.message });
    }
  }
};
