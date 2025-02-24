import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { Board, Todo } from "@/types/board";

interface BoardState {
  boards: Board[];
  past: Board[][];
  future: Board[][];
  addBoard: (board: Board) => void;
  updateBoard: (updatedBoard: Board) => void;
  deleteBoard: (id: number) => void;
  moveTodo: (
    sourceBoardId: number,
    destinationBoardId: number,
    todo: Todo,
    destinationIndex: number
  ) => void;
  moveBoard: (dragIndex: number, hoverIndex: number) => void;
  undo: () => void;
  redo: () => void;
  saveHistory: () => void;
}

const useBoardStore = create<BoardState>()(
  persist<BoardState>(
    (set, get) => ({
      boards: [],
      past: [],
      future: [],
      saveHistory: () => {
        const currentBoards = get().boards;
        set((state) => ({
          past: [...state.past, currentBoards],
          future: [],
        }));
      },
      addBoard: (board: Board) => {
        get().saveHistory();
        set((state) => ({ boards: [...state.boards, board] }));
      },
      updateBoard: (updatedBoard: Board) => {
        get().saveHistory();
        set((state) => ({
          boards: state.boards.map((board) =>
            board.id === updatedBoard.id ? updatedBoard : board
          ),
        }));
      },
      deleteBoard: (id: number) => {
        get().saveHistory();
        set((state) => ({
          boards: state.boards.filter((board) => board.id !== id),
        }));
      },
      moveTodo: (
        sourceBoardId: number,
        destinationBoardId: number,
        todo: Todo,
        destinationIndex: number
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
      undo: () =>
        set((state) => {
          if (state.past.length === 0) return state;
          const previous = state.past[state.past.length - 1];
          const newPast = state.past.slice(0, state.past.length - 1);
          return {
            boards: previous,
            past: newPast,
            future: [state.boards, ...state.future],
          };
        }),
      redo: () =>
        set((state) => {
          if (state.future.length === 0) return state;
          const next = state.future[0];
          const newFuture = state.future.slice(1);
          return {
            boards: next,
            past: [...state.past, state.boards],
            future: newFuture,
          };
        }),
    }),
    {
      name: "board-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

export default useBoardStore;
