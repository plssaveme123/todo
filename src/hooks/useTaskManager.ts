import { useState, useCallback } from 'react';
import { Task, Subtask, TaskFilter } from '../types/Task';
import { useLocalStorage } from './useLocalStorage';

export function useTaskManager() {
  const [tasks, setTasks] = useLocalStorage<Task[]>('taskflow-tasks', []);
  const [filter, setFilter] = useState<TaskFilter>({
    search: '',
    tags: [],
  });

  const addTask = useCallback((taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newTask: Task = {
      ...taskData,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    setTasks(prev => [...prev, newTask]);
  }, [setTasks]);

  const updateTask = useCallback((id: string, updates: Partial<Task>) => {
    setTasks(prev => prev.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
  }, [setTasks]);

  const deleteTask = useCallback((id: string) => {
    setTasks(prev => prev.filter(task => task.id !== id));
  }, [setTasks]);

  const addSubtask = useCallback((taskId: string, subtaskTitle: string) => {
    const newSubtask: Subtask = {
      id: crypto.randomUUID(),
      title: subtaskTitle,
      completed: false,
      createdAt: new Date().toISOString(),
    };
    
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? { ...task, subtasks: [...task.subtasks, newSubtask], updatedAt: new Date().toISOString() }
        : task
    ));
  }, [setTasks]);

  const toggleSubtask = useCallback((taskId: string, subtaskId: string) => {
    setTasks(prev => prev.map(task => 
      task.id === taskId 
        ? {
            ...task,
            subtasks: task.subtasks.map(subtask =>
              subtask.id === subtaskId 
                ? { ...subtask, completed: !subtask.completed }
                : subtask
            ),
            updatedAt: new Date().toISOString(),
          }
        : task
    ));
  }, [setTasks]);

  const moveTask = useCallback((taskId: string, newStatus: Task['status']) => {
    updateTask(taskId, { status: newStatus });
  }, [updateTask]);

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(filter.search.toLowerCase()) ||
                         task.description.toLowerCase().includes(filter.search.toLowerCase());
    const matchesTags = filter.tags.length === 0 || 
                       filter.tags.some(tag => task.tags.includes(tag));
    const matchesPriority = !filter.priority || task.priority === filter.priority;
    const matchesStatus = !filter.status || task.status === filter.status;
    
    return matchesSearch && matchesTags && matchesPriority && matchesStatus;
  });

  const allTags = [...new Set(tasks.flatMap(task => task.tags))];

  return {
    tasks: filteredTasks,
    allTasks: tasks,
    allTags,
    filter,
    setFilter,
    addTask,
    updateTask,
    deleteTask,
    addSubtask,
    toggleSubtask,
    moveTask,
  };
}