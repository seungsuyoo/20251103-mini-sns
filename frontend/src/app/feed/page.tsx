'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchAPI } from '@/lib/api';
import { Post, User } from '@/types';
import PostCard from '@/components/PostCard';

export default function FeedPage() {
  const router = useRouter();
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (!token || !userData) {
      router.push('/login');
      return;
    }

    setUser(JSON.parse(userData));
    fetchPosts();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await fetchAPI('/api/posts');
      setPosts(data);
    } catch (error) {
      console.error('Failed to fetch posts', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('정말 삭제하시겠습니까?')) return;

    try {
      await fetchAPI(`/api/posts/${id}`, { method: 'DELETE' });
      setPosts(posts.filter((post) => post.id !== id));
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      alert('삭제에 실패했습니다');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>로딩중...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="max-w-2xl mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-bold">Mini SNS</h1>
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">{user?.username}</span>
            <button onClick={handleLogout} className="text-sm text-gray-600 hover:text-gray-900">
              로그아웃
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        <div className="mb-6">
          <a
            href="/posts/new"
            className="block w-full py-3 bg-blue-500 text-white text-center rounded-lg hover:bg-blue-600"
          >
            새 게시글 작성
          </a>
        </div>

        {posts.length === 0 ? (
          <div className="text-center py-12 text-gray-500">아직 게시글이 없습니다</div>
        ) : (
          posts.map((post) => <PostCard key={post.id} post={post} onDelete={handleDelete} />)
        )}
      </main>
    </div>
  );
}
