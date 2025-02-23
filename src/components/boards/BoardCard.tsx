import { Board, Todo } from '@/types/board';
import useBoardStore from '@/store/boardStore';
import { useState, useRef } from 'react';
import TodoItem from './TodoItem';
import { useDrag, useDrop } from 'react-dnd';

interface DragBoard {
  index: number;
  board: Board;
}

interface BoardCardProps {
  board: Board;
  index: number;
  moveBoard: (dragIndex: number, hoverIndex: number) => void;
}

const BoardCard: React.FC<BoardCardProps> = ({ board, index, moveBoard }) => {
  const deleteBoard = useBoardStore((state) => state.deleteBoard);
  const updateBoard = useBoardStore((state) => state.updateBoard);
  const moveTodo = useBoardStore((state) => state.moveTodo);

  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(board.title);
  const [newTodoContent, setNewTodoContent] = useState('');

  const boardRef = useRef<HTMLDivElement | null>(null);

  const [{ isDragging }, drag] = useDrag({
    type: 'BOARD',
    item: { id: board.id, index },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop<DragBoard>({
    accept: 'BOARD',
    hover: (draggedItem) => {
      if (draggedItem.index !== index) {
        moveBoard(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
  });

  const [, dropTodo] = useDrop({
    accept: 'TODO',
    drop: (item: any, monitor) => {
      if (item.boardId !== board.id) {
        const hoverBoundingRect = boardRef.current?.getBoundingClientRect();
        const clientOffset = monitor.getClientOffset();

        if (hoverBoundingRect && clientOffset) {
          const hoverMiddleY =
            (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
          const hoverClientY = clientOffset.y - hoverBoundingRect.top;

          const destinationIndex =
            hoverClientY < hoverMiddleY ? 0 : board.todos.length;
          moveTodoAnotherBoard(
            item.index,
            item.boardId,
            board.id,
            item.todo,
            destinationIndex,
          );
        }

        item.boardId = board.id;
      }
    },
  });

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

  const moveTodoInBoard = (dragIndex: number, hoverIndex: number) => {
    const updatedTodos = Array.from(board.todos);
    const [removed] = updatedTodos.splice(dragIndex, 1);
    updatedTodos.splice(hoverIndex, 0, removed);
    updateBoard({ ...board, todos: updatedTodos });
  };

  const moveTodoAnotherBoard = (
    sourceIndex: number,
    sourceBoardId: number,
    destinationBoardId: number,
    todo: Todo,
    destinationIndex: number,
  ) => {
    moveTodo(sourceBoardId, destinationBoardId, todo, destinationIndex);
  };

  drag(drop(dropTodo(boardRef)));

  return (
    <div
      key={board.id}
      ref={boardRef}
      className="relative border rounded p-4 w-120 bg-purple-300 shadow-md"
      style={{ opacity: isDragging ? 0.5 : 1, cursor: 'grab' }}
    >
      <button
        onClick={() => deleteBoard(board.id)}
        className="absolute top-2 right-2 bg-pink-500 text-white p-1 rounded w-20"
      >
        보드삭제
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
      <div className="mt-2 min-h-[100px] flex flex-col gap-2 border border-dashed border-purple-800 p-2">
        {board.todos.length > 0 ? (
          board.todos.map((todo, index) => (
            <TodoItem
              key={todo.id}
              board={board}
              todo={todo}
              index={index}
              moveTodoInBoard={moveTodoInBoard}
              moveTodoAnotherBoard={moveTodoAnotherBoard}
            />
          ))
        ) : (
          <div className="text-purple-900 italic text-center p-4">
            여기에 할 일을 드래그 해보세요!
          </div>
        )}
      </div>

      <form onSubmit={handleAddTodo} className="mt-4 flex items-center">
        <input
          type="text"
          placeholder="할일 추가"
          value={newTodoContent}
          onChange={(e) => setNewTodoContent(e.target.value)}
          className="border p-2 flex-grow max-w-[calc(100%-80px)]"
        />
        <button
          type="submit"
          className="ml-2 bg-purple-900 text-white p-2 rounded w-20"
        >
          추가
        </button>
      </form>
    </div>
  );
};

export default BoardCard;
