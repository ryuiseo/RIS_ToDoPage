import React, { useRef, useState } from "react";
import { Board, Todo } from "@/types/board";
import { useDrag, useDrop } from "react-dnd";
import useBoardStore from "@/store/boardStore";

interface DragItem {
  index: number;
  todo: Todo;
  boardId: number;
  type: string;
}

interface TodoItemProps {
  board: Board;
  todo: Todo;
  index: number;
  moveTodoInBoard: (dragIndex: number, hoverIndex: number) => void;
  moveTodoAnotherBoard: (
    sourceIndex: number,
    sourceBoardId: number,
    destinationBoardId: number,
    todo: Todo,
    destinationIndex: number
  ) => void;
  searchQuery?: string;
}

const TodoItem: React.FC<TodoItemProps> = ({
  board,
  todo,
  index,
  moveTodoInBoard,
  moveTodoAnotherBoard,
  searchQuery = "",
}) => {
  const updateBoard = useBoardStore((state) => state.updateBoard);
  const [isEditing, setIsEditing] = useState(false);
  const [newContent, setNewContent] = useState(todo.content);

  const ref = useRef<HTMLDivElement>(null);

  const [{ isDragging }, drag] = useDrag({
    type: "TODO",
    item: { index, todo, boardId: board.id },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const [, drop] = useDrop({
    accept: "TODO",
    hover: (draggedItem: DragItem, monitor) => {
      if (!ref.current) return;
      if (draggedItem.boardId === board.id && draggedItem.index !== index) {
        moveTodoInBoard(draggedItem.index, index);
        draggedItem.index = index;
      }
    },
    drop: (draggedItem: DragItem, monitor) => {
      if (draggedItem.boardId !== board.id) {
        const hoverBoundingRect = ref.current?.getBoundingClientRect();
        const clientOffset = monitor.getClientOffset();

        if (!hoverBoundingRect || !clientOffset) return;

        const hoverMiddleY =
          (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;
        const hoverClientY = clientOffset.y - hoverBoundingRect.top;

        const destinationIndex =
          hoverClientY < hoverMiddleY ? index : index + 1;

        moveTodoAnotherBoard(
          draggedItem.index,
          draggedItem.boardId,
          board.id,
          draggedItem.todo,
          destinationIndex
        );
        draggedItem.boardId = board.id;
      }
    },
  });
  drag(drop(ref));
  const isMatch =
    searchQuery &&
    todo.content.toLowerCase().includes(searchQuery.toLowerCase());
  const containerClasses = `h-20 border p-2 rounded mb-1 flex items-center bg-white shadow-md ${
    isMatch ? "bg-yellow-100" : ""
  }`;

  const handleDeleteTodo = () => {
    const updatedTodos = board.todos.filter((t) => t.id !== todo.id);
    const updatedBoard = { ...board, todos: updatedTodos };
    updateBoard(updatedBoard);
  };

  const handleSave = () => {
    if (!newContent.trim()) return;
    const updatedTodos = board.todos.map((t) =>
      t.id === todo.id ? { ...t, content: newContent.trim() } : t
    );
    const updatedBoard = { ...board, todos: updatedTodos };
    updateBoard(updatedBoard);
    setIsEditing(false);
  };

  return (
    <div
      ref={ref}
      style={{ opacity: isDragging ? 0.5 : 1, cursor: "grab" }}
      className={containerClasses}
    >
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
