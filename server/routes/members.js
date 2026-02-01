
const express = require("express");
const fs = require("fs");
const { auth, onlyAdmin } = require("../middleware/auth");

const router = express.Router();
const file = "./data/members.json";

const read = () => JSON.parse(fs.readFileSync(file));
const write = (d) => fs.writeFileSync(file, JSON.stringify(d, null, 2));

router.get("/", auth, (req, res) => res.json(read()));

router.post("/", auth, onlyAdmin, (req, res) => {
  const data = read();
  data.push(req.body);
  write(data);
  res.json({ success: true });
});

module.exports = router;
