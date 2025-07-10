import React, { useState } from 'react';
import { Plus, Check, X } from 'lucide-react';
import { Subtask } from '../types/Task';

interface SubtaskListProps {
  subtasks: Subtask[];
  onToggleSubtask: (subtaskId: string) => void;
  onAddSubtask: (title: string) => void;
}

export function SubtaskList({ subtasks, onToggleSubtask, onAddSubtask }: SubtaskListProps) {
  const [newSubtaskTitle, setNewSubtaskTitle] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newSubtaskTitle.trim()) {
      onAddSubtask(newSubtaskTitle.trim());
      setNewSubtaskTitle('');
      setIsAdding(false);
    }
  };

  const completedCount = subtasks.filter(subtask => subtask.completed).length;

  return (
    <div className="space-y-2">
      {subtasks.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
          <span className="font-medium">Subtasks</span>
          <span className="px-2 py-1 bg-gray-100 rounded-full text-xs">
            {completedCount}/{subtasks.length}
          </span>
        </div>
      )}

      {subtasks.map(subtask => (
        <div
          key={subtask.id}
          className="flex items-center gap-2 p-2 bg-gray-50 rounded-md hover:bg-gray-100 transition-colors"
        >
          <button
            onClick={() => onToggleSubtask(subtask.id)}
            className={`flex-shrink-0 w-4 h-4 rounded border-2 flex items-center justify-center transition-colors ${
              subtask.completed
                ? 'bg-green-500 border-green-500 text-white'
                : 'border-gray-300 hover:border-green-500'
            }`}
          >
            {subtask.completed && <Check className="h-3 w-3" />}
          </button>
          <span className={`flex-1 text-sm ${
            subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'
          }`}>
            {subtask.title}
          </span>
        </div>
      ))}

      {isAdding ? (
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            placeholder="Enter subtask title..."
            className="flex-1 px-3 py-2 border border-gray-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
            autoFocus
          />
          <button
            type="submit"
            className="flex-shrink-0 p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
          >
            <Check className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => setIsAdding(false)}
            className="flex-shrink-0 p-2 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </form>
      ) : (
        <button
          onClick={() => setIsAdding(true)}
          className="flex items-center gap-2 p-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-md transition-colors w-full"
        >
          <Plus className="h-4 w-4" />
          Add subtask
        </button>
      )}
    </div>
  );
}