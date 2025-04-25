import dotenv from "dotenv";
dotenv.config();

import { initializeDatabase } from "./db/models/postgresModel";
import express from "express";
import bodyParser from "body-parser";
import morgan from "morgan";

import webRouter from "./routes/webRoutes";
import requestRouter from "./routes/requestRoutes";

const app = express();
const PORT = process.env.EXPRESS_PORT || 3000;

app.use(morgan("tiny"));
app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use("/api/web", webRouter);
app.use("/api", requestRouter);

app.get("*", (req, res) => {
  res.status(404).send("Route not found");
});

const startServer = async () => {
  try {
    const dbInitialized = await initializeDatabase();

    if (!dbInitialized) {
      console.error("Failed to initialize database, exiting...");
      process.exit(1);
    }

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Failed to initialize database:", error);
    process.exit(1);
  }
};

startServer();
