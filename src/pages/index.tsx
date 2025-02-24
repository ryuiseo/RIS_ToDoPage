import React, { useState, useMemo } from "react";
import BoardList from "@/components/boards/BoardList";
import { Board } from "@/types/board";
import BoardForm from "@/components/boards/BoardForm";
import useBoardStore from "@/store/boardStore";

const MainPage = () => {
  const boards = useBoardStore((state) => state.boards);
  const addboards = useBoardStore((state) => state.addBoard);
  const [boardTitle, setBoardTitle] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const handleCreateBoard = (e: React.FormEvent) => {
    e.preventDefault();
    if (!boardTitle.trim()) return;
    const newBoard: Board = {
      id: Date.now(),
      title: boardTitle.trim(),
      todos: [],
    };
    addboards(newBoard);
    setBoardTitle("");
  };
  const filteredBoards = useMemo(() => {
    if (!searchQuery.trim()) {
      return boards;
    }
    const lowerQuery = searchQuery.toLowerCase();
    return boards.filter((board) => {
      const titleMatch = board.title.toLowerCase().includes(lowerQuery);
      const todoMatch = board.todos.some((todo) =>
        todo.content.toLowerCase().includes(lowerQuery)
      );
      return titleMatch || todoMatch;
    });
  }, [boards, searchQuery]);
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4 mt-20">To-Do List</h1>
      <section className="mt-8 mb-4">
        <h2 className="text-xl mb-2">새로운 보드를 등록하세요!</h2>
        <BoardForm
          handleCreateBoard={handleCreateBoard}
          boardTitle={boardTitle}
          setBoardTitle={setBoardTitle}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
        />
      </section>
      <BoardList boards={filteredBoards} searchQuery={searchQuery} />
    </div>
  );
};
export default MainPage;
