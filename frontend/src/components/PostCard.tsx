/* eslint-disable @next/next/no-img-element */
'use client';

import { Post } from '@/types';
import { useState } from 'react';

interface PostCardProps {
  post: Post;
  onDelete?: (id: number) => void;
}

export default function PostCard({ post, onDelete }: PostCardProps) {
  const [showMenu, setShowMenu] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  const isOwner = currentUser.id === post.userId;

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('ko-KR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow p-4 mb-4">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gray-300 rounded-full flex items-center justify-center">
            {post.user.avatar ? (
              <img
                src={post.user.avatar}
                alt={post.user.username}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <span className="text-lg font-medium">{post.user.username[0].toUpperCase()}</span>
            )}
          </div>
          <div>
            <p className="font-medium">{post.user.username}</p>
            <p className="text-xs text-gray-500">{formatDate(post.createdAt)}</p>
          </div>
        </div>

        {isOwner && (
          <div className="relative">
            <button
              onClick={() => setShowMenu(!showMenu)}
              className="text-gray-500 hover:text-gray-700"
            >
              •••
            </button>
            {showMenu && (
              <div className="absolute right-0 mt-2 w-32 bg-white rounded-lg shadow-lg border z-10">
                <button
                  onClick={() => onDelete && onDelete(post.id)}
                  className="w-full px-4 py-2 text-left text-red-600 hover:bg-gray-50 rounded-lg"
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        )}
      </div>

      <p className="mb-3">{post.content}</p>

      {post.image && (
        <img
          src={`${process.env.NEXT_PUBLIC_API_URL}${post.image}`}
          alt="Post"
          className="w-full rounded-lg mb-3"
        />
      )}

      <div className="flex items-center gap-4 text-gray-500 text-sm">
        <button className="hover:text-blue-500">좋아요 {post._count?.likes || 0}</button>
        <a href={`/posts/${post.id}`} className="hover:text-blue-500">
          댓글 {post._count?.comments || 0}
        </a>
      </div>
    </div>
  );
}
