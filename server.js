import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import dns from "dns";

import connectDB from "./config/db.js";
import authRoutes from "./routes/authRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";
import caseRoutes from "./routes/caseRoutes.js";
import errorMiddleware from "./middleware/errorMiddleware.js";

// Fix DNS resolution for MongoDB Atlas
dns.setServers(["1.1.1.1", "8.8.8.8"]);

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Connect MongoDB
connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/customers", customerRoutes);
app.use("/api/cases", caseRoutes);

// Error handling middleware
app.use(errorMiddleware);

// Test route
app.get("/", (req, res) => {
  res.json({
    message: "CRM Backend API is running successfully",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});