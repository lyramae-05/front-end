export interface Book {
  id: number;
  title: string;
  author: string;
  genre: string;
  description: string;
  total_copies: number;
  available_copies: number;
  isbn: string;
  published_date: string;
  publisher: string;
  cover_image?: string;
  created_at?: string;
  updated_at?: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface BorrowingRecord {
  id: number;
  book: {
    id: number;
    title: string;
    author: string;
  };
  borrowed_at: string;
  due_date: string;
  returned_at: string | null;
  status: 'borrowed' | 'returned';
  is_overdue: boolean;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
}