export interface Book {
  id: number;
  title: string;
  author: string;
  isbn: string;
  genre?: string;
  description?: string;
  publisher?: string;
  quantity: number;
  available_copies: number;
  total_copies: number;
  created_at: string;
  updated_at: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
  role: 'admin' | 'user';
  created_at: string;
  updated_at: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface BorrowingRecord {
  id: number;
  user_id: number;
  book_id: number;
  borrowed_at: string;
  due_date: string;
  returned_at: string | null;
  status: 'active' | 'returned' | 'overdue';
  book: Book;
  user?: User;
  created_at: string;
  updated_at: string;
}

export interface Transaction {
  id: number;
  user_id: number;
  book_id: number;
  borrowed_at: string;
  due_date: string;
  returned_at: string | null;
  status: 'active' | 'returned' | 'overdue';
  created_at: string;
  updated_at: string;
  book?: Book;
  user?: User;
}

export interface ApiError {
  message: string;
  errors?: Record<string, string[]>;
  status?: number;
}

export interface ApiResponse<T> {
  message: string;
  data: T;
}