import React from 'react';
import { Plus } from 'lucide-react';
import { Task } from '../types/Task';
import { TaskCard } from './TaskCard';

interface TaskColumnProps {
  title: string;
  status: Task['status'];
  tasks: Task[];
  onAddTask: () => void;
  onUpdateTask: (id: string, updates: Partial<Task>) => void;
  onDeleteTask: (id: string) => void;
  onAddSubtask: (taskId: string, title: string) => void;
  onToggleSubtask: (taskId: string, subtaskId: string) => void;
  onMoveTask: (taskId: string, newStatus: Task['status']) => void;
}

export function TaskColumn({
  title,
  status,
  tasks,
  onAddTask,
  onUpdateTask,
  onDeleteTask,
  onAddSubtask,
  onToggleSubtask,
  onMoveTask,
}: TaskColumnProps) {
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('text/plain');
    onMoveTask(taskId, status);
  };

  const getColumnColor = (status: Task['status']) => {
    switch (status) {
      case 'todo': return 'border-blue-200 bg-blue-50';
      case 'in-progress': return 'border-yellow-200 bg-yellow-50';
      case 'done': return 'border-green-200 bg-green-50';
    }
  };

  return (
    <div
      className={`flex flex-col h-full rounded-lg border-2 border-dashed ${getColumnColor(status)} p-4`}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
          {title}
          <span className="bg-white px-2 py-1 rounded-full text-sm font-medium text-gray-600">
            {tasks.length}
          </span>
        </h2>
        <button
          onClick={onAddTask}
          className="p-2 bg-white text-gray-600 rounded-full hover:bg-gray-100 hover:text-gray-800 transition-colors shadow-sm"
        >
          <Plus className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 space-y-3 overflow-y-auto">
        {tasks.map(task => (
          <TaskCard
            key={task.id}
            task={task}
            onUpdate={(updates) => onUpdateTask(task.id, updates)}
            onDelete={() => onDeleteTask(task.id)}
            onAddSubtask={(title) => onAddSubtask(task.id, title)}
            onToggleSubtask={(subtaskId) => onToggleSubtask(task.id, subtaskId)}
          />
        ))}
      </div>
    </div>
  );
}