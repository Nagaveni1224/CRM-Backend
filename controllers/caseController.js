import mongoose from "mongoose";
import Case from "../models/Case.js";
import Customer from "../models/Customer.js";
import User from "../models/User.js";

// Create a case
export const createCase = async (req, res) => {
  try {
    const {
      title,
      description,
      customer,
      assignedTo,
      priority,
      status,
    } = req.body;

    if (!title || !description || !customer || !assignedTo) {
      return res.status(400).json({
        message:
          "Title, description, customer and assigned user are required",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(customer)) {
      return res.status(400).json({
        message: "Invalid customer ID",
      });
    }

    if (!mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({
        message: "Invalid assigned user ID",
      });
    }

    const existingCustomer = await Customer.findById(customer);

    if (!existingCustomer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    const existingUser = await User.findById(assignedTo);

    if (!existingUser) {
      return res.status(404).json({
        message: "Assigned user not found",
      });
    }

    const newCase = await Case.create({
      title,
      description,
      customer,
      assignedTo,
      priority: priority || "medium",
      status: status || "open",
      createdBy: req.user.userId,
    });

    const populatedCase = await Case.findById(newCase._id)
      .populate("customer", "name email phone company")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    res.status(201).json({
      message: "Case created successfully",
      case: populatedCase,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create case",
      error: error.message,
    });
  }
};

// Get all cases
export const getCases = async (req, res) => {
  try {
    const cases = await Case.find({
      createdBy: req.user.userId,
    })
      .populate("customer", "name email phone company")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "Cases fetched successfully",
      cases,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch cases",
      error: error.message,
    });
  }
};

// Get case by ID
export const getCaseById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid case ID",
      });
    }

    const existingCase = await Case.findOne({
      _id: id,
      createdBy: req.user.userId,
    })
      .populate("customer", "name email phone company")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    if (!existingCase) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    res.status(200).json({
      message: "Case fetched successfully",
      case: existingCase,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch case",
      error: error.message,
    });
  }
};

// Update case
export const updateCase = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid case ID",
      });
    }

    const {
      title,
      description,
      customer,
      assignedTo,
      priority,
      status,
    } = req.body;

    if (customer && !mongoose.Types.ObjectId.isValid(customer)) {
      return res.status(400).json({
        message: "Invalid customer ID",
      });
    }

    if (assignedTo && !mongoose.Types.ObjectId.isValid(assignedTo)) {
      return res.status(400).json({
        message: "Invalid assigned user ID",
      });
    }

    if (customer) {
      const existingCustomer = await Customer.findById(customer);

      if (!existingCustomer) {
        return res.status(404).json({
          message: "Customer not found",
        });
      }
    }

    if (assignedTo) {
      const existingUser = await User.findById(assignedTo);

      if (!existingUser) {
        return res.status(404).json({
          message: "Assigned user not found",
        });
      }
    }

    const updatedCase = await Case.findOneAndUpdate(
      {
        _id: id,
        createdBy: req.user.userId,
      },
      {
        title,
        description,
        customer,
        assignedTo,
        priority,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    )
      .populate("customer", "name email phone company")
      .populate("assignedTo", "name email role")
      .populate("createdBy", "name email role");

    if (!updatedCase) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    res.status(200).json({
      message: "Case updated successfully",
      case: updatedCase,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update case",
      error: error.message,
    });
  }
};

// Delete case
export const deleteCase = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid case ID",
      });
    }

    const deletedCase = await Case.findOneAndDelete({
      _id: id,
      createdBy: req.user.userId,
    });

    if (!deletedCase) {
      return res.status(404).json({
        message: "Case not found",
      });
    }

    res.status(200).json({
      message: "Case deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete case",
      error: error.message,
    });
  }
};