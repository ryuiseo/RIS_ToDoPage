import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { Board } from '@/types/board';

interface BoardState {
  boards: Board[];
  addBoard: (board: Board) => void;
  updateBoard: (updatedBoard: Board) => void;
  deleteBoard: (id: number) => void;
  reorderBoards: (startIndex: number, endIndex: number) => void;
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
      reorderBoards: (startIndex: number, endIndex: number) => {
        const boards: Board[] = Array.from(get().boards);
        const [removed] = boards.splice(startIndex, 1);
        boards.splice(endIndex, 0, removed);
        set({ boards });
      },
    }),
    {
      name: 'board-storage',
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
);

export default useBoardStore;
