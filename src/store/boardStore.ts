import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Board, Todo } from '@/types/board';

interface BoardState {
  boards: Board[];
  addBoard: (board: Board) => void;
  updateBoard: (updatedBoard: Board) => void;
  deleteBoard: (id: number) => void;
  moveTodo: (
    sourceBoardId: number,
    destinationBoardId: number,
    todo: Todo,
    destinationIndex: number,
  ) => void;
  moveBoard: (dragIndex: number, hoverIndex: number) => void;
}

const useBoardStore = create<BoardState>()(
  persist<BoardState>(
    (set, get) => ({
      boards: [],
      addBoard: (board: Board) =>
        set((state: BoardState) => ({
          boards: [...state.boards, board],
        })),
      updateBoard: (updatedBoard: Board) =>
        set((state: BoardState) => ({
          boards: state.boards.map((board: Board) =>
            board.id === updatedBoard.id ? updatedBoard : board,
          ),
        })),
      deleteBoard: (id: number) =>
        set((state: BoardState) => ({
          boards: state.boards.filter((board: Board) => board.id !== id),
        })),
      moveTodo: (
        sourceBoardId: number,
        destinationBoardId: number,
        todo: Todo,
        destinationIndex: number,
      ) =>
        set((state) => {
          const boards = state.boards.map((board) => {
            if (board.id === sourceBoardId) {
              return {
                ...board,
                todos: board.todos.filter((t) => t.id !== todo.id),
              };
            }
            if (board.id === destinationBoardId) {
              const newTodos = Array.from(board.todos);
              newTodos.splice(destinationIndex, 0, todo);
              return { ...board, todos: newTodos };
            }
            return board;
          });
          return { boards };
        }),
      moveBoard: (dragIndex: number, hoverIndex: number) =>
        set((state) => {
          const updatedBoards = [...state.boards];
          const [movedBoard] = updatedBoards.splice(dragIndex, 1);
          updatedBoards.splice(hoverIndex, 0, movedBoard);
          return { boards: updatedBoards };
        }),
    }),
    {
      name: 'board-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useBoardStore;
