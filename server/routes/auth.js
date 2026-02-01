
const express = require("express");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const fs = require("fs");

const router = express.Router();
const users = JSON.parse(fs.readFileSync("./data/users.json"));
const SECRET = "KAS_BEM_SECRET";

router.post("/login", (req, res) => {
  const { username, password } = req.body;
  const user = users.find(u => u.username === username);
  if (!user) return res.status(401).json({ message: "User tidak ditemukan" });

  if (!bcrypt.compareSync(password, user.password)) {
    return res.status(401).json({ message: "Password salah" });
  }

  const token = jwt.sign({ id: user.id, role: user.role }, SECRET, { expiresIn: "1d" });
  res.json({ token, role: user.role, username: user.username });
});

module.exports = router;
