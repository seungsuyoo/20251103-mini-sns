export interface User {
  id: number;
  email: string;
  username: string;
  avatar?: string;
  createdAt: string;
}

export interface Post {
  id: number;
  content: string;
  image?: string;
  userId: number;
  createdAt: string;
  updatedAt: string;
  user: User;
  comments: Comment[];
  likes: Like[];
  _count?: {
    likes: number;
    comments: number;
  };
}

export interface Comment {
  id: number;
  content: string;
  userId: number;
  postId: number;
  createdAt: string;
  user: User;
}

export interface Like {
  id: number;
  userId: number;
  postId: number;
}

export interface AuthResponse {
  token: string;
  user: User;
}
