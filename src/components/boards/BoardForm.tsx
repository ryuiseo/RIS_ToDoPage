interface boardFormProps {
  handleCreateBoard: (e: React.FormEvent) => void;
  boardTitle: string;
  setBoardTitle: React.Dispatch<React.SetStateAction<string>>;
  searchQuery: string;
  setSearchQuery: React.Dispatch<React.SetStateAction<string>>;
}
const BoardForm: React.FC<boardFormProps> = ({
  handleCreateBoard,
  boardTitle,
  setBoardTitle,
  searchQuery,
  setSearchQuery,
}) => {
  return (
    <>
      <form onSubmit={handleCreateBoard}>
        <input
          type="text"
          placeholder="보드 제목"
          value={boardTitle}
          onChange={(e) => setBoardTitle(e.target.value)}
          className="border p-2 mr-2"
        />
        <button type="submit" className="bg-blue-300 text-black p-2 rounded">
          보드 생성하기
        </button>
        <div className="flex items-center">
          <input
            type="text"
            placeholder="검색어 입력"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border p-2 rounded mr-2 mt-4"
          />
          <button
            type="button"
            className="bg-pink-400 text-black p-2 rounded mt-4"
          >
            보드 및 할일 검색하기
          </button>
        </div>
      </form>
    </>
  );
};
export default BoardForm;
