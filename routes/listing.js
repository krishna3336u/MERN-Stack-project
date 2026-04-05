// routes/listings.js

const express = require("express");
const router = express.Router();
const multer = require("multer");
const { storage } = require("../cloudConfig.js");
const upload = multer({ storage });

const wrapAsync = require("../utils/wrapAsync.js");
const Listing = require("../models/listing.js");
const listingController = require("../controllers/listings.js");

const { isLoggedIn, isOwner, validateListing } = require("../middleware.js");

// ======================
// LISTINGS ROUTES
// ======================

// INDEX - Show all listings
router.get("/", wrapAsync(listingController.index));

// NEW - Render form to create a new listing
router.get("/new", isLoggedIn, listingController.renderNewform);

// SHOW - Show a single listing
router.get("/:id", wrapAsync(listingController.showListing));

// CREATE - Add a new listing
router.post(
  "/",
  isLoggedIn,
  upload.single("listing[image]"),
  validateListing,
  wrapAsync(listingController.createListing)
);

// EDIT - Render form to edit a listing
router.get("/:id/edit", isLoggedIn, isOwner, wrapAsync(listingController.editListing));

// UPDATE - Update a listing
router.put(
  "/:id",
  isLoggedIn,
  isOwner,
  upload.single("listing[image]"),
  wrapAsync(listingController.updateListing)
);

// DELETE - Delete a listing
router.delete("/:id", isLoggedIn, isOwner, wrapAsync(listingController.deleteListing));

module.exports = router;