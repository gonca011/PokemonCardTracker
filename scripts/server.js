require("dotenv").config();

const path = require("path");
const cors = require("cors");
const express = require("express");
const { initializeDatabase } = require("./backend/database/initialize");
const apiRoutes = require("./backend/routes");
const errorHandler = require("./backend/middleware/errorHandler");

const app = express();
const port = process.env.PORT || 3000;

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

app.use(express.json());
app.use(express.static(path.resolve(__dirname, "..")));
app.use("/api", apiRoutes);
app.use(errorHandler);

initializeDatabase()
  .then(() => {
    app.listen(port, "0.0.0.0", () => {
      console.log(`Server running at http://localhost:${port}`);
    });
  })
  .catch((error) => {
    console.error("Could not start server:", error);
    process.exit(1);
  });
