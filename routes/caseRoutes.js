import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  createCase,
  getCases,
  getCaseById,
  updateCase,
  deleteCase,
} from "../controllers/caseController.js";

const router = express.Router();

// Create a case
router.post("/", authMiddleware, createCase);

// Get all cases
router.get("/", authMiddleware, getCases);

// Get case by ID
router.get("/:id", authMiddleware, getCaseById);

// Update case
router.patch("/:id", authMiddleware, updateCase);

// Delete case
router.delete("/:id", authMiddleware, deleteCase);

export default router;