import { Board } from "@/types/board";
import BoardCard from "./BoardCard";
import useBoardStore from "@/store/boardStore";

interface boardListProps {
  boards: Board[];
  searchQuery: string;
}
const BoardList: React.FC<boardListProps> = ({ boards, searchQuery }) => {
  const moveBoard = useBoardStore((state) => state.moveBoard);

  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board, index) => (
          <BoardCard
            key={board.id}
            board={board}
            index={index}
            moveBoard={moveBoard}
            searchQuery={searchQuery}
          />
        ))}
      </div>
    </section>
  );
};
export default BoardList;
