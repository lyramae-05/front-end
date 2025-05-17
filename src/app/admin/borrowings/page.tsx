'use client';

import { useState, useEffect } from 'react';
import api from '@/lib/api';
import { toast } from 'react-hot-toast';

interface Transaction {
  id: number;
  user: {
    id: number;
    name: string;
    email: string;
  };
  book: {
    id: number;
    title: string;
    author: string;
  };
  borrow_date: string;
  due_date: string;
  return_date: string | null;
  status: string;
}

export default function AdminBorrowings() {
  const [activeTransactions, setActiveTransactions] = useState<Transaction[]>([]);
  const [recentTransactions, setRecentTransactions] = useState<Transaction[]>([]);
  const [overdueTransactions, setOverdueTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchTransactions = async () => {
    try {
      const [activeRes, recentRes, overdueRes] = await Promise.all([
        api.get('/admin/transactions/active'),
        api.get('/admin/transactions/recent'),
        api.get('/admin/transactions/overdue')
      ]);

      setActiveTransactions(activeRes.data.data || []);
      setRecentTransactions(recentRes.data.data || []);
      setOverdueTransactions(overdueRes.data.data || []);
    } catch (error: any) {
      console.error('Error fetching transactions:', error);
      toast.error(error.response?.data?.message || 'Failed to load transactions');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions();
  }, []);

  const TransactionTable = ({ transactions, title }: { transactions: Transaction[], title: string }) => (
    <div className="bg-white rounded-lg shadow overflow-hidden mb-8">
      <h2 className="text-xl font-semibold p-6 bg-gray-50">{title}</h2>
      {transactions.length === 0 ? (
        <div className="p-6 text-center text-gray-500">
          No transactions found.
        </div>
      ) : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Borrow Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">{transaction.user.name}</div>
                  <div className="text-sm text-gray-500">{transaction.user.email}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-900">{transaction.book.title}</div>
                  <div className="text-sm text-gray-500">{transaction.book.author}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transaction.borrow_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {new Date(transaction.due_date).toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                    transaction.status === 'overdue' ? 'bg-red-100 text-red-800' :
                    transaction.status === 'active' ? 'bg-green-100 text-green-800' :
                    'bg-gray-100 text-gray-800'
                  }`}>
                    {transaction.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-8">Borrowing Management</h1>
      
      {/* Active Transactions */}
      <TransactionTable 
        transactions={activeTransactions} 
        title="Active Borrowings" 
      />

      {/* Overdue Transactions */}
      <TransactionTable 
        transactions={overdueTransactions} 
        title="Overdue Borrowings" 
      />

      {/* Recent Transactions */}
      <TransactionTable 
        transactions={recentTransactions} 
        title="Recent Transactions" 
      />
    </div>
  );
} 