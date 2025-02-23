// src/components/boards/TodoItem.tsx
import React, { useState } from 'react';
import { Board, Todo } from '@/types/board';
import {
  useDrag,
  useDrop,
  DragSourceMonitor,
  DropTargetMonitor,
} from 'react-dnd';
import useBoardStore from '@/store/boardStore';

interface TodoItemProps {
  board: Board;
  todo: Todo;
}

const TodoItem: React.FC<TodoItemProps> = ({ board, todo }) => {
  const updateBoard = useBoardStore((state) => state.updateBoard);
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(todo.content);

  const handleDeleteTodo = () => {
    const updatedTodos = board.todos.filter((t) => t.id !== todo.id);
    const updatedBoard = { ...board, todos: updatedTodos };
    updateBoard(updatedBoard);
  };

  const handleSave = () => {
    if (!newContent.trim()) return;
    const updatedTodos = board.todos.map((t) =>
      t.id === todo.id ? { ...t, content: newContent.trim() } : t,
    );
    const updatedBoard = { ...board, todos: updatedTodos };
    updateBoard(updatedBoard);
    setIsEditing(false);
  };

  return (
    <div className="border p-2 rounded mb-1 flex items-center">
      {isEditing ? (
        <>
          <input
            type="text"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            className="border p-1 flex-grow"
          />
          <button
            onClick={handleSave}
            className="bg-green-500 text-white p-1 ml-2 rounded"
          >
            저장
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setNewContent(todo.content);
            }}
            className="bg-gray-500 text-white p-1 ml-2 rounded"
          >
            취소
          </button>
        </>
      ) : (
        <>
          <span className="flex-grow">{todo.content}</span>
          <button
            onClick={() => setIsEditing(true)}
            className="text-blue-500 ml-2"
          >
            수정
          </button>
          <button onClick={handleDeleteTodo} className="text-red-500 ml-2">
            삭제
          </button>
        </>
      )}
    </div>
  );
};

export default TodoItem;
