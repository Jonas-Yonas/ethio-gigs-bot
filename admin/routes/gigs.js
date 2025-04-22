import express from "express";
import { GigModel } from "../../models/gig.js";

const router = express.Router();

// GET gigs (paginated, filterable by moderationStatus) route
router.get("/", async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = 6;
  const moderationFilter = req.query.moderationFilter || "Approved"; // default to 'Approved'

  // Create the query object
  const query = {};

  // Only add moderationStatus to query if filter is not "All"
  if (moderationFilter !== "All") {
    query.moderationStatus = moderationFilter;
  }

  try {
    const gigs = await GigModel.find(query)
      .skip((page - 1) * limit)
      .limit(limit)
      .sort({ createdAt: -1 });

    const total = await GigModel.countDocuments(query);
    const totalPages = Math.ceil(total / limit);

    res.json({ gigs, totalPages });
  } catch (error) {
    console.error("❌ Failed to fetch gigs:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET a gig by id route
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const gig = await GigModel.findByIdAndUpdate(
      id,
      { $inc: { views: 1 } }, // 👈 Increment views by 1
      { new: true } // 👈 Return the updated document
    );

    if (!gig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.status(200).json(gig);
  } catch (error) {
    console.error("❌ Failed to fetch gig:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// POST gig route
router.post("/", async (req, res) => {
  try {
    const newGig = new GigModel({ ...req.body });

    await newGig.save();
    res.status(201).json(newGig);
  } catch (err) {
    console.error("❌ Create gig error:", err);
    res.status(500).json({ message: "Failed to create gig" });
  }
});

// CLOSE gig route
router.patch("/:id/close", async (req, res) => {
  try {
    const updatedGig = await GigModel.findByIdAndUpdate(
      req.params.id,
      { status: "closed" },
      { new: true }
    );
    res.json(updatedGig);
  } catch (err) {
    res.status(500).json({ error: "Failed to close gig" });
  }
});

// UPDATE gig route
router.put("/:id", async (req, res) => {
  try {
    const { title, description, category, price } = req.body;

    const updatedGig = await GigModel.findByIdAndUpdate(
      req.params.id,
      { title, description, category, price },
      { new: true, runValidators: true }
    );

    if (!updatedGig) {
      return res.status(404).json({ message: "Gig not found" });
    }

    res.json(updatedGig);
  } catch (err) {
    console.error("❌ Failed to update gig:", err);
    res.status(500).json({ message: "Failed to update gig" });
  }
});

// DELETE gig route
router.delete("/:id", async (req, res) => {
  try {
    const deletedGig = await GigModel.findByIdAndDelete(req.params.id);
    if (!deletedGig) {
      return res.status(404).json({ message: "Gig not found" });
    }
    res.json({ message: "Gig deleted successfully" });
  } catch (err) {
    console.error("❌ Delete error:", err);
    res.status(500).json({ message: "Failed to delete gig" });
  }
});

export default router;
