import { Board } from '@/types/board';
import BoardCard from './BoardCard';

interface boardListProps {
  boards: Board[];
}
const BoardList: React.FC<boardListProps> = ({ boards }) => {
  return (
    <section>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {boards.map((board) => (
          <BoardCard key={board.id} board={board} />
        ))}
      </div>
    </section>
  );
};
export default BoardList;
