const express = require("express");
const fs = require("fs");
const path = require("path");
const XLSX = require("xlsx");

const router = express.Router();

// Helper function to read transactions
const getTransactions = () => {
  const filePath = path.join(__dirname, "../data/transactions.json");
  const data = fs.readFileSync(filePath, "utf8");
  return JSON.parse(data);
};

// Helper function to write transactions
const saveTransactions = (transactions) => {
  const filePath = path.join(__dirname, "../data/transactions.json");
  fs.writeFileSync(filePath, JSON.stringify(transactions, null, 2));
};

// GET all transactions with filtering and search
router.get("/", (req, res) => {
  try {
    let transactions = getTransactions();
    
    // Search functionality
    const { search, startDate, endDate, type, month, year } = req.query;
    
    if (search) {
      transactions = transactions.filter(t => 
        t.description.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase())
      );
    }
    
    // Date range filtering
    if (startDate && endDate) {
      transactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return transactionDate >= start && transactionDate <= end;
      });
    }
    
    // Type filtering (income/expense)
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }
    
    // Month and year filtering
    if (month && year) {
      transactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() + 1 === parseInt(month) && 
               transactionDate.getFullYear() === parseInt(year);
      });
    }
    
    // Sort by date descending
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    res.json(transactions);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transactions" });
  }
});

// GET transaction by ID
router.get("/:id", (req, res) => {
  try {
    const transactions = getTransactions();
    const transaction = transactions.find(t => t.id === parseInt(req.params.id));
    
    if (!transaction) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    
    res.json(transaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to fetch transaction" });
  }
});

// POST create new transaction
router.post("/", (req, res) => {
  try {
    const transactions = getTransactions();
    const newTransaction = {
      ...req.body,
      id: transactions.length > 0 ? Math.max(...transactions.map(t => t.id)) + 1 : 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    
    transactions.push(newTransaction);
    saveTransactions(transactions);
    
    res.status(201).json(newTransaction);
  } catch (error) {
    res.status(500).json({ error: "Failed to create transaction" });
  }
});

// PUT update transaction
router.put("/:id", (req, res) => {
  try {
    const transactions = getTransactions();
    const index = transactions.findIndex(t => t.id === parseInt(req.params.id));
    
    if (index === -1) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    
    transactions[index] = {
      ...transactions[index],
      ...req.body,
      updated_at: new Date().toISOString()
    };
    
    saveTransactions(transactions);
    res.json(transactions[index]);
  } catch (error) {
    res.status(500).json({ error: "Failed to update transaction" });
  }
});

// DELETE transaction
router.delete("/:id", (req, res) => {
  try {
    const transactions = getTransactions();
    const filteredTransactions = transactions.filter(t => t.id !== parseInt(req.params.id));
    
    if (filteredTransactions.length === transactions.length) {
      return res.status(404).json({ error: "Transaction not found" });
    }
    
    saveTransactions(filteredTransactions);
    res.json({ message: "Transaction deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Failed to delete transaction" });
  }
});

// Excel export endpoint
router.get("/export/excel", (req, res) => {
  try {
    let transactions = getTransactions();
    
    // Apply filters for export
    const { startDate, endDate, type, month, year } = req.query;
    
    if (startDate && endDate) {
      transactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        const start = new Date(startDate);
        const end = new Date(endDate);
        return transactionDate >= start && transactionDate <= end;
      });
    }
    
    if (type) {
      transactions = transactions.filter(t => t.type === type);
    }
    
    if (month && year) {
      transactions = transactions.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() + 1 === parseInt(month) && 
               transactionDate.getFullYear() === parseInt(year);
      });
    }
    
    // Sort by date descending
    transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws_data = [
      ['No', 'Tanggal', 'Deskripsi', 'Kategori', 'Jenis', 'Jumlah', 'Saldo'],
      ...transactions.map((t, index) => [
        index + 1,
        new Date(t.date).toLocaleDateString('id-ID'),
        t.description,
        t.category,
        t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
        t.amount,
        '' // Will be calculated in Excel
      ])
    ];
    
    const ws = XLSX.utils.aoa_to_sheet(ws_data);
    
    // Add styling and borders
    const range = XLSX.utils.decode_range(ws['!ref']);
    for (let R = range.s.r; R <= range.e.r; ++R) {
      for (let C = range.s.c; C <= range.e.c; ++C) {
        const cell_address = { c: C, r: R };
        const cell_ref = XLSX.utils.encode_cell(cell_address);
        
        if (!ws[cell_ref]) continue;
        
        if (!ws[cell_ref].s) ws[cell_ref].s = {};
        
        // Add borders
        ws[cell_ref].s.border = {
          top: { style: 'thin' },
          bottom: { style: 'thin' },
          left: { style: 'thin' },
          right: { style: 'thin' }
        };
        
        // Header styling
        if (R === 0) {
          ws[cell_ref].s.font = { bold: true };
          ws[cell_ref].s.fill = { fgColor: { rgb: 'E7E7E7' } };
        }
        
        // Amount formatting
        if (C === 5) { // Jumlah column
          ws[cell_ref].z = '#,##0';
        }
      }
    }
    
    // Set column widths
    ws['!cols'] = [
      { width: 5 },   // No
      { width: 15 },  // Tanggal
      { width: 40 },  // Deskripsi
      { width: 20 },  // Kategori
      { width: 15 },  // Jenis
      { width: 15 },  // Jumlah
      { width: 15 }   // Saldo
    ];
    
    XLSX.utils.book_append_sheet(wb, ws, 'Laporan Kas');
    
    // Generate filename with date
    const date = new Date();
    const filename = `Laporan_Kas_${date.toISOString().slice(0, 10)}.xlsx`;
    
    // Write to buffer
    const buffer = XLSX.write(wb, { bookType: 'xlsx', type: 'buffer' });
    
    // Set headers for download
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.send(buffer);
  } catch (error) {
    res.status(500).json({ error: "Failed to export Excel file" });
  }
});

module.exports = router;
