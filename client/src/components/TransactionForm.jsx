import { useState } from "react";
import api from "../api/axios";

export default function TransactionForm({ onTransactionUpdate }) {
  const [formData, setFormData] = useState({
    date: "",
    description: "",
    amount: "",
    type: "income",
    category: "Pendapatan"
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/transactions", {
        ...formData,
        amount: parseInt(formData.amount)
      });
      
      // Reset form
      setFormData({
        date: "",
        description: "",
        amount: "",
        type: "income",
        category: "Pendapatan"
      });
      
      onTransactionUpdate();
    } catch (err) {
      setError(err.response?.data?.error || "Gagal menambahkan transaksi");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleTypeChange = (type) => {
    setFormData(prev => ({
      ...prev,
      type,
      category: type === "income" ? "Pendapatan" : "Pengeluaran"
    }));
  };

  return (
    <div className="bg-gradient-to-br from-navy-50 to-navy-100 rounded-xl shadow-lg border border-navy-200 p-6">
      <div className="flex items-center mb-6">
        <div className="w-10 h-10 bg-navy-600 rounded-lg flex items-center justify-center mr-4 shadow-lg">
          <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
        </div>
        <div>
          <h2 className="text-xl font-bold text-navy-800">Tambah Transaksi Baru</h2>
          <p className="text-navy-600 text-sm">Catat transaksi keuangan secara terperinci</p>
        </div>
      </div>
      
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          <div className="flex items-center">
            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            {error}
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Date Input */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Tanggal Transaksi
            </div>
          </label>
          <input
            type="date"
            name="date"
            value={formData.date}
            onChange={handleInputChange}
            required
            className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all duration-300 bg-white hover:border-navy-300"
          />
        </div>

        {/* Type Selection */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-3">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7h16M4 12h16M4 17h16" />
              </svg>
              Jenis Transaksi
            </div>
          </label>
          <div className="grid grid-cols-2 gap-3">
            <label className="flex items-center p-3 border border-navy-200 rounded-lg hover:border-navy-400 transition-all duration-300 cursor-pointer bg-white">
              <input
                type="radio"
                value="income"
                checked={formData.type === "income"}
                onChange={() => handleTypeChange("income")}
                className="mr-3 text-green-600 focus:ring-green-500"
              />
              <div className="flex items-center">
                <div className="w-3 h-3 bg-green-500 rounded-full mr-3"></div>
                <span className="text-green-700 font-medium">Pemasukan</span>
              </div>
            </label>
            <label className="flex items-center p-3 border border-navy-200 rounded-lg hover:border-navy-400 transition-all duration-300 cursor-pointer bg-white">
              <input
                type="radio"
                value="expense"
                checked={formData.type === "expense"}
                onChange={() => handleTypeChange("expense")}
                className="mr-3 text-red-600 focus:ring-red-500"
              />
              <div className="flex items-center">
                <div className="w-3 h-3 bg-red-500 rounded-full mr-3"></div>
                <span className="text-red-700 font-medium">Pengeluaran</span>
              </div>
            </label>
          </div>
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
              </svg>
              Deskripsi Transaksi
            </div>
          </label>
          <input
            type="text"
            name="description"
            value={formData.description}
            onChange={handleInputChange}
            placeholder="Contoh: Pembayaran SPP, Pembelian ATK, Donasi alumni"
            required
            className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all duration-300 bg-white hover:border-navy-300"
          />
        </div>

        {/* Amount */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Jumlah (IDR)
            </div>
          </label>
          <input
            type="number"
            name="amount"
            value={formData.amount}
            onChange={handleInputChange}
            placeholder="0"
            min="0"
            required
            className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all duration-300 bg-white hover:border-navy-300"
          />
        </div>

        {/* Category */}
        <div>
          <label className="block text-sm font-medium text-navy-700 mb-2">
            <div className="flex items-center">
              <svg className="w-4 h-4 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
              </svg>
              Kategori
            </div>
          </label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleInputChange}
            placeholder="Contoh: Pendapatan, Pengeluaran, Dana Kegiatan"
            required
            className="w-full px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all duration-300 bg-white hover:border-navy-300"
          />
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={loading}
          className="w-full bg-navy-600 hover:bg-navy-700 disabled:bg-gray-400 text-white py-3 px-4 rounded-lg transition-all duration-300 transform hover:scale-105 shadow-lg font-medium"
        >
          {loading ? (
            <div className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Menyimpan...
            </div>
          ) : (
            <div className="flex items-center justify-center">
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              Simpan Transaksi
            </div>
          )}
        </button>
      </form>
    </div>
  );
}
