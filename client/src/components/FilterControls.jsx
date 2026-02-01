import { useState, useEffect } from "react";

export default function FilterControls({ filters, onFilterChange, onExportExcel }) {
  const [localFilters, setLocalFilters] = useState(filters);

  // Update local filters when props change
  useEffect(() => {
    setLocalFilters(filters);
  }, [filters]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    const newFilters = { ...localFilters, [name]: value };
    setLocalFilters(newFilters);
    
    // Debounce the filter change to avoid too many API calls
    clearTimeout(handleInputChange.timeout);
    handleInputChange.timeout = setTimeout(() => {
      onFilterChange(newFilters);
    }, 300);
  };

  const handleTypeChange = (type) => {
    const newFilters = { ...localFilters, type };
    setLocalFilters(newFilters);
    onFilterChange(newFilters);
  };

  const clearFilters = () => {
    const clearedFilters = {
      search: "",
      startDate: "",
      endDate: "",
      type: "",
      month: "",
      year: ""
    };
    setLocalFilters(clearedFilters);
    onFilterChange(clearedFilters);
  };

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear - 5 + i);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-navy-100 p-6">
      <div className="flex flex-col lg:flex-row gap-4">
        {/* Search Input */}
        <div className="flex-1">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-navy-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              name="search"
              value={localFilters.search}
              onChange={handleInputChange}
              placeholder="Cari transaksi (deskripsi/kategori)..."
              className="w-full pl-10 pr-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all duration-300 bg-white hover:border-navy-300"
            />
          </div>
        </div>

        {/* Date Range Filter */}
        <div className="flex gap-2 items-center">
          <div className="relative">
            <input
              type="date"
              name="startDate"
              value={localFilters.startDate}
              onChange={handleInputChange}
              className="px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all duration-300 bg-white hover:border-navy-300"
            />
            <div className="absolute top-0 left-0 w-full h-full bg-transparent pointer-events-none border-2 border-transparent rounded-lg"></div>
          </div>
          <span className="text-navy-600 font-medium text-sm">sampai</span>
          <div className="relative">
            <input
              type="date"
              name="endDate"
              value={localFilters.endDate}
              onChange={handleInputChange}
              className="px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all duration-300 bg-white hover:border-navy-300"
            />
          </div>
        </div>

        {/* Month/Year Filter */}
        <div className="flex gap-2">
          <select
            name="month"
            value={localFilters.month}
            onChange={handleInputChange}
            className="px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all duration-300 bg-white hover:border-navy-300"
          >
            <option value="">Pilih Bulan</option>
            {Array.from({ length: 12 }, (_, i) => i + 1).map(month => (
              <option key={month} value={month}>
                {new Date(2024, month - 1).toLocaleString('id-ID', { month: 'long' })}
              </option>
            ))}
          </select>
          <select
            name="year"
            value={localFilters.year}
            onChange={handleInputChange}
            className="px-4 py-3 border border-navy-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-navy-500 focus:border-transparent transition-all duration-300 bg-white hover:border-navy-300"
          >
            <option value="">Pilih Tahun</option>
            {years.map(year => (
              <option key={year} value={year}>{year}</option>
            ))}
          </select>
        </div>

        {/* Type Filter Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => handleTypeChange("")}
            className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              localFilters.type === "" 
                ? "bg-navy-600 text-white shadow-lg" 
                : "bg-navy-50 text-navy-700 hover:bg-navy-100 border border-navy-200"
            }`}
          >
            Semua
          </button>
          <button
            onClick={() => handleTypeChange("income")}
            className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              localFilters.type === "income" 
                ? "bg-green-600 text-white shadow-lg" 
                : "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200"
            }`}
          >
            Pemasukan
          </button>
          <button
            onClick={() => handleTypeChange("expense")}
            className={`px-4 py-3 rounded-lg font-medium transition-all duration-300 transform hover:scale-105 ${
              localFilters.type === "expense" 
                ? "bg-red-600 text-white shadow-lg" 
                : "bg-red-50 text-red-700 hover:bg-red-100 border border-red-200"
            }`}
          >
            Pengeluaran
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <button
            onClick={clearFilters}
            className="px-6 py-3 bg-navy-50 text-navy-700 rounded-lg font-medium hover:bg-navy-100 border border-navy-200 transition-all duration-300 transform hover:scale-105"
          >
            Reset
          </button>
          <button
            onClick={onExportExcel}
            className="px-6 py-3 bg-navy-600 text-white rounded-lg font-medium hover:bg-navy-700 shadow-lg transition-all duration-300 transform hover:scale-105 flex items-center space-x-2"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Export Excel</span>
          </button>
        </div>
      </div>
    </div>
  );
}
