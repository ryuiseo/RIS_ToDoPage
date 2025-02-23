import { Board, Todo } from '@/types/board';
import useBoardStore from '@/store/boardStore';
import { useState } from 'react';
import TodoItem from './TodoItem';

interface boardCardProps {
  board: Board;
}
const BoardCard: React.FC<boardCardProps> = ({ board }) => {
  const deleteBoard = useBoardStore((state) => state.deleteBoard);
  const updateBoard = useBoardStore((state) => state.updateBoard);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(board.title);
  const [newTodoContent, setNewTodoContent] = useState('');

  const handleAddTodo = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTodoContent.trim()) return;
    const newTodo: Todo = {
      id: Date.now(),
      content: newTodoContent.trim(),
    };
    const updatedBoard: Board = {
      ...board,
      todos: [...(board.todos || []), newTodo],
    };
    updateBoard(updatedBoard);
    setNewTodoContent('');
  };

  const handleSaveTitle = () => {
    if (newTitle.trim() === '') return;
    updateBoard({ ...board, title: newTitle.trim() });
    setIsEditing(false);
  };
  return (
    <div key={board.id} className="relative border rounded p-4 w-120">
      <button
        onClick={() => deleteBoard(board.id)}
        className="absolute top-2 right-2 bg-red-500 text-white p-1 rounded w-20"
      >
        삭제
      </button>
      {isEditing ? (
        <div className="mb-2">
          <input
            type="text"
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="border p-1"
          />
          <button
            onClick={handleSaveTitle}
            className="ml-2 bg-blue-500 text-white p-1 rounded"
          >
            저장
          </button>
          <button
            onClick={() => {
              setIsEditing(false);
              setNewTitle(board.title);
            }}
            className="ml-2 bg-gray-500 text-white p-1 rounded"
          >
            취소
          </button>
        </div>
      ) : (
        <div className="mb-2 flex items-center">
          <h3 className="text-lg font-semibold">{board.title}</h3>
          <button
            onClick={() => setIsEditing(true)}
            className="ml-2 text-blue-500 bg-yellow-200 w-10"
          >
            수정
          </button>
        </div>
      )}
      <div className="mt-2">
        {(board.todos || []).map((todo) => (
          <TodoItem key={todo.id} board={board} todo={todo} />
        ))}
      </div>
      <form onSubmit={handleAddTodo} className="mt-2">
        <input
          type="text"
          placeholder="할일 추가"
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
          className="border p-1"
        />
        <button
          type="submit"
          className="ml-2 bg-blue-500 text-white p-1 rounded"
        >
          추가
        </button>
      </form>
    </div>
  );
};
export default BoardCard;
