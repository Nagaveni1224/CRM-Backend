import express from "express";

import authMiddleware from "../middleware/authMiddleware.js";

import {
  getCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  searchCustomers,
  getCustomerById,
  getAllCustomers,
} from "../controllers/customerController.js";

import roleMiddleware from "../middleware/roleMiddleware.js";

const router = express.Router();

router.get("/", authMiddleware, getCustomers);

router.post("/", authMiddleware, createCustomer);

router.put("/:id", authMiddleware, updateCustomer);

router.delete("/:id", authMiddleware, deleteCustomer);

router.get("/search", authMiddleware, searchCustomers);

// Admin-only test route
router.get(
  "/admin-test",
  authMiddleware,
  roleMiddleware("admin"),
  (req, res) => {
    res.status(200).json({
      message: "Admin access granted",
      user: req.user,
    });
  }
);

// Admin: Get all customers
router.get(
  "/admin/all",
  authMiddleware,
  roleMiddleware("admin"),
  getAllCustomers
);

// Get customer by ID — keep this AFTER named routes
router.get("/:id", authMiddleware, getCustomerById);

export default router;