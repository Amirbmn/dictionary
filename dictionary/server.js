const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();
app.use(cors());

const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "your password",
  database: "persdic"
});

db.connect((err) => {
  if (err) {
    console.error("Database connection failed:", err.message);
  } else {
    console.log("✅ Connected to database");
  }
});

app.get("/words", (req, res) => {
  const q = req.query.q || "";


  db.query(
    "SELECT nenglishword, npersianword FROM your_table_name WHERE nenglishword LIKE ? LIMIT 20",
    [q + "%"],
    (err, rows) => {
      if (err) {
        console.error("Query error:", err);
        return res.json([]);
      }

      if (!rows.length) {
        return res.json([]);
      }

    
      const result = rows.map(r => ({
        word: r.nenglishword, 
        persianMeaning: r.npersianword,
        pronunciation: "",
        partOfSpeech: "noun",
        definitions: [r.npersianword],
        examples: []
      }));

      res.json(result);
    }
  );
});


app.get("/", (req, res) => {
  res.json({ 
    message: "English-Persian Dictionary API",
    endpoint: "/words?q=search_term",
    example: "http://localhost:3000/words?q=hello"
  });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running: http://localhost:${PORT}`);
  console.log(`🔍 Test: http://localhost:${PORT}/words?q=a`);
});
