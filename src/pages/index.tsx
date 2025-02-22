import React, { useState } from 'react';
import Link from 'next/link';

interface Board {
  id: number;
  title: string;
}

const MainPage = () => {
  const [boards, setBoards] = useState<Board[]>([
    { id: 1, title: '첫번째 보드' },
  ]);
  const [boardTitle, setBoardTitle] = useState('');

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardTitle.trim()) return;
    const newBoard: Board = {
      id: Date.now(),
      title: boardTitle.trim(),
    };
    setBoards((prev) => [...prev, newBoard]);
    setBoardTitle('');
  };
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">To-Do List</h1>

      <section>
        <h2 className="text-xl mb-2">보드</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {boards.map((board) => (
            <div key={board.id} className="border rounded p-4">
              <h3 className="text-lg font-semibold">{board.title}</h3>
              <Link href={`/board/${board.id}`} className="text-blue-500">
                보드 상세 보기
              </Link>
            </div>
          ))}
        </div>
      </section>

      <section className="mt-8">
        <h2 className="text-xl mb-2">새로운 보드를 등록하세요!</h2>
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
      </section>
    </div>
  );
};
export default MainPage;
