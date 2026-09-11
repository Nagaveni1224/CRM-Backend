import mongoose from "mongoose";
import Customer from "../models/Customer.js";

// Get all customers with pagination
export const getCustomers = async (req, res) => {
  try {
    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 10, 1),
      100
    );

    const skip = (page - 1) * limit;

    const totalCustomers = await Customer.countDocuments({
      createdBy: req.user.userId,
    });

    const customers = await Customer.find({
      createdBy: req.user.userId,
    })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Customers fetched successfully",
      pagination: {
        currentPage: page,
        limit,
        totalCustomers,
        totalPages: Math.ceil(totalCustomers / limit),
      },
      customers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch customers",
      error: error.message,
    });
  }
};

// Create a customer
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, company, status } = req.body;

    if (!name || !email || !phone) {
      return res.status(400).json({
        message: "Name, email and phone are required",
      });
    }

    const customer = await Customer.create({
      name,
      email,
      phone,
      company,
      status: status || "lead",
      createdBy: req.user.userId,
    });

    res.status(201).json({
      message: "Customer created successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create customer",
      error: error.message,
    });
  }
};

// Update a customer
export const updateCustomer = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({
    message: "Invalid customer ID",
  });
}
    const { name, email, phone, company, status } = req.body;

    const customer = await Customer.findOneAndUpdate(
      {
        _id: id,
        createdBy: req.user.userId,
      },
      {
        name,
        email,
        phone,
        company,
        status,
      },
      {
        new: true,
        runValidators: true,
      }
    );

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      message: "Customer updated successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to update customer",
      error: error.message,
    });
  }
};

// Delete a customer
export const deleteCustomer = async (req, res) => {
  try {
    const { id } = req.params;
if (!mongoose.Types.ObjectId.isValid(id)) {
  return res.status(400).json({
    message: "Invalid customer ID",
  });
}
    const customer = await Customer.findOneAndDelete({
      _id: id,
      createdBy: req.user.userId,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to delete customer",
      error: error.message,
    });
  }
};


// Search customers with pagination
export const searchCustomers = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q) {
      return res.status(400).json({
        message: "Search query is required",
      });
    }

    const page = Math.max(parseInt(req.query.page) || 1, 1);

    const limit = Math.min(
      Math.max(parseInt(req.query.limit) || 10, 1),
      100
    );

    const skip = (page - 1) * limit;

    const searchFilter = {
      createdBy: req.user.userId,
      $or: [
        { name: { $regex: q, $options: "i" } },
        { email: { $regex: q, $options: "i" } },
        { company: { $regex: q, $options: "i" } },
      ],
    };

    const totalCustomers = await Customer.countDocuments(searchFilter);

    const customers = await Customer.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.status(200).json({
      message: "Search results fetched successfully",
      pagination: {
        currentPage: page,
        limit,
        totalCustomers,
        totalPages: Math.ceil(totalCustomers / limit),
      },
      customers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to search customers",
      error: error.message,
    });
  }
};

// Get customer by ID
export const getCustomerById = async (req, res) => {
  try {
    const { id } = req.params;

    // Validate MongoDB ID
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        message: "Invalid customer ID",
      });
    }

    const customer = await Customer.findOne({
      _id: id,
      createdBy: req.user.userId,
    });

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    res.status(200).json({
      message: "Customer fetched successfully",
      customer,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch customer",
      error: error.message,
    });
  }
};

// Admin: Get all customers
export const getAllCustomers = async (req, res) => {
  try {
    const customers = await Customer.find()
      .populate("createdBy", "name email role")
      .sort({ createdAt: -1 });

    res.status(200).json({
      message: "All customers fetched successfully",
      customers,
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch all customers",
      error: error.message,
    });
  }
};