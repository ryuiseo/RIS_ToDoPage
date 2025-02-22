// src/pages/board/[id].tsx
import { useRouter } from 'next/router';
import React from 'react';
import Link from 'next/link';

const BoardDetail = () => {
  const router = useRouter();
  const { id } = router.query;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">보드 상세 - {id}</h1>

      <section>
        <h2 className="text-xl mb-2">Todos</h2>
        <div className="border p-4 rounded mb-2">
          <p>할일 아이템</p>
        </div>
      </section>

      <section className="mt-4">
        <Link href={`/`} className="text-blue-500">
          리스트로 돌아가기
        </Link>
      </section>
    </div>
  );
};

export default BoardDetail;
