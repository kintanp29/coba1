
const express = require("express");
const cors = require("cors");

const authRoutes = require("./routes/auth");
const membersRoutes = require("./routes/members");
const transactionsRoutes = require("./routes/transactions");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/members", membersRoutes);
app.use("/api/transactions", transactionsRoutes);

app.listen(5000, () => console.log("API running on http://localhost:5000"));
