import React, { useState } from 'react';
import { CheckSquare, Plus } from 'lucide-react';
import { useTaskManager } from './hooks/useTaskManager';
import { TaskColumn } from './components/TaskColumn';
import { TaskForm } from './components/TaskForm';
import { SearchBar } from './components/SearchBar';
import { Task } from './types/Task';

function App() {
  const {
    tasks,
    allTags,
    filter,
    setFilter,
    addTask,
    updateTask,
    deleteTask,
    addSubtask,
    toggleSubtask,
    moveTask,
  } = useTaskManager();

  const [showTaskForm, setShowTaskForm] = useState(false);
  const [newTaskStatus, setNewTaskStatus] = useState<Task['status']>('todo');

  const handleAddTask = (status: Task['status']) => {
    setNewTaskStatus(status);
    setShowTaskForm(true);
  };

  const handleTaskSubmit = (taskData: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>) => {
    addTask(taskData);
    setShowTaskForm(false);
  };

  const todoTasks = tasks.filter(task => task.status === 'todo');
  const inProgressTasks = tasks.filter(task => task.status === 'in-progress');
  const doneTasks = tasks.filter(task => task.status === 'done');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-500 rounded-lg">
                <CheckSquare className="h-8 w-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">TaskFlow</h1>
                <p className="text-gray-600">Organize your tasks with style</p>
              </div>
            </div>
            <button
              onClick={() => handleAddTask('todo')}
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Plus className="h-4 w-4" />
              Add Task
            </button>
          </div>
        </header>

        <SearchBar
          filter={filter}
          onFilterChange={setFilter}
          allTags={allTags}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[600px]">
          <TaskColumn
            title="To Do"
            status="todo"
            tasks={todoTasks}
            onAddTask={() => handleAddTask('todo')}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onAddSubtask={addSubtask}
            onToggleSubtask={toggleSubtask}
            onMoveTask={moveTask}
          />
          
          <TaskColumn
            title="In Progress"
            status="in-progress"
            tasks={inProgressTasks}
            onAddTask={() => handleAddTask('in-progress')}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onAddSubtask={addSubtask}
            onToggleSubtask={toggleSubtask}
            onMoveTask={moveTask}
          />
          
          <TaskColumn
            title="Done"
            status="done"
            tasks={doneTasks}
            onAddTask={() => handleAddTask('done')}
            onUpdateTask={updateTask}
            onDeleteTask={deleteTask}
            onAddSubtask={addSubtask}
            onToggleSubtask={toggleSubtask}
            onMoveTask={moveTask}
          />
        </div>

        {showTaskForm && (
          <TaskForm
            onSubmit={handleTaskSubmit}
            onCancel={() => setShowTaskForm(false)}
            initialStatus={newTaskStatus}
          />
        )}
      </div>
    </div>
  );
}

export default App;