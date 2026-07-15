const express = require("express");
const cors = require("cors");
const app = express();
const port = 3000;

app.use(
  cors({
    origin: [
      "http://127.0.0.1:5501",
      "http://127.0.0.1:5173",
      "http://localhost:5501",
      "http://localhost:5173",
      "http://localhost:3000",
    ],
  })
);
app.use(express.json()); // To parse JSON bodies

let storedData = null;
// POST endpoint sends data and receives
//Works
app.post("/api/data", (req, res) => {
  storedData = req.body;
  res.send({ received: storedData });
});

app.get("/api/data", (req, res) => {
  res.send({ received: storedData });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});

// To run
//node server.js