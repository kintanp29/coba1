import { useState } from "react";
import TransactionModal from "./TransactionModal";
import api from "../api/axios";

export default function TransactionList({ transactions, loading, onTransactionUpdate }) {
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [deletingTransaction, setDeletingTransaction] = useState(null);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/${id}`);
      onTransactionUpdate();
    } catch (error) {
      console.error("Failed to delete transaction:", error);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="bg-gradient-to-br from-navy-50 to-navy-100 rounded-xl shadow-lg border border-navy-200 p-6">
        <div className="animate-pulse">
          <div className="h-6 bg-navy-200 rounded mb-4"></div>
          <div className="space-y-3">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-4 bg-navy-200 rounded"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-navy-50 to-navy-100 rounded-xl shadow-lg border border-navy-200 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-xl font-bold text-navy-800">Daftar Transaksi</h2>
          <p className="text-navy-600 text-sm">Kelola dan pantau semua transaksi keuangan</p>
        </div>
        <div className="bg-navy-600 text-white px-4 py-2 rounded-lg">
          <span className="text-sm font-medium">{transactions.length}</span>
          <span className="text-sm opacity-80 ml-1">transaksi</span>
        </div>
      </div>

      {transactions.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 bg-navy-200 rounded-full mx-auto mb-4 flex items-center justify-center">
            <svg className="w-8 h-8 text-navy-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h3 className="text-navy-800 font-semibold mb-2">Belum ada transaksi</h3>
          <p className="text-navy-600 text-sm">Tambahkan transaksi pertama Anda untuk memulai pencatatan keuangan.</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-navy-200">
            <thead className="bg-navy-600 text-white">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Tanggal
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Deskripsi
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Kategori
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Jenis
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Jumlah
                </th>
                <th className="px-4 py-3 text-left text-xs font-semibold uppercase tracking-wider">
                  Aksi
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-navy-100">
              {transactions.map((transaction) => (
                <tr key={transaction.id} className="hover:bg-navy-50 transition-colors duration-200">
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-navy-800 font-medium">
                    {formatDate(transaction.date)}
                  </td>
                  <td className="px-4 py-4 text-sm text-navy-700">
                    {transaction.description}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-navy-700">
                    {transaction.category}
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap">
                    <span
                      className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${
                        transaction.type === 'income'
                          ? 'bg-green-100 text-green-800 border border-green-200'
                          : 'bg-red-100 text-red-800 border border-red-200'
                      }`}
                    >
                      {transaction.type === 'income' ? 'Pemasukan' : 'Pengeluaran'}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-semibold">
                    <span
                      className={`${
                        transaction.type === 'income' ? 'text-green-700' : 'text-red-700'
                      }`}
                    >
                      {transaction.type === 'income' ? '+' : '-'}{' '}
                      {formatCurrency(transaction.amount)}
                    </span>
                  </td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button
                      onClick={() => setEditingTransaction(transaction)}
                      className="bg-navy-600 text-white px-3 py-1 rounded-lg hover:bg-navy-700 transition-colors duration-200 transform hover:scale-105"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => setDeletingTransaction(transaction.id)}
                      className="bg-red-600 text-white px-3 py-1 rounded-lg hover:bg-red-700 transition-colors duration-200 transform hover:scale-105"
                    >
                      Hapus
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Edit Modal */}
      {editingTransaction && (
        <TransactionModal
          transaction={editingTransaction}
          onClose={() => setEditingTransaction(null)}
          onSuccess={onTransactionUpdate}
        />
      )}

      {/* Delete Confirmation Modal */}
      {deletingTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl border border-navy-200">
            <div className="flex items-center mb-4">
              <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-bold text-navy-800">Konfirmasi Hapus</h3>
                <p className="text-navy-600 text-sm">Tindakan ini tidak dapat dibatalkan</p>
              </div>
            </div>
            <p className="text-navy-700 mb-6">
              Apakah Anda yakin ingin menghapus transaksi ini? Data yang dihapus tidak dapat dikembalikan.
            </p>
            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setDeletingTransaction(null)}
                className="px-4 py-2 text-navy-700 bg-navy-100 rounded-lg hover:bg-navy-200 transition-colors duration-200 font-medium"
              >
                Batal
              </button>
              <button
                onClick={() => {
                  handleDelete(deletingTransaction);
                  setDeletingTransaction(null);
                }}
                className="px-4 py-2 text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors duration-200 font-medium transform hover:scale-105"
              >
                Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}