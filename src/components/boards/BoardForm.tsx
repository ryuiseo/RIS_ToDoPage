interface boardFormProps {
  handleCreateBoard: (e: React.FormEvent) => void;
  boardTitle: string;
  setBoardTitle: React.Dispatch<React.SetStateAction<string>>;
}
const BoardForm: React.FC<boardFormProps> = ({
  handleCreateBoard,
  boardTitle,
  setBoardTitle,
}) => {
  return (
    <form onSubmit={handleCreateBoard}>
      <input
        type="text"
        placeholder="보드 제목"
        value={boardTitle}
        onChange={(e) => setBoardTitle(e.target.value)}
        className="border p-2 mr-2"
      />
      <button type="submit" className="bg-blue-500 text-black p-2 rounded">
        보드 생성하기
      </button>
    </form>
  );
};
export default BoardForm;
