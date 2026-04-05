// controllers/listings.js

const Listing = require("../models/listing.js");
const Review = require("../models/review.js");

// INDEX - Show all listings
module.exports.index = async (req, res) => {
  const listings = await Listing.find({});
  res.render("listings/index", { listings });
};

// RENDER NEW LISTING FORM
module.exports.renderNewform = (req, res) => {
  res.render("listings/new");
};

// CREATE LISTING
module.exports.createListing = async (req, res) => {
  try {
    const newListing = new Listing(req.body.listing);

    // ASSIGN OWNER
    newListing.owner = req.user._id;

    // HANDLE IMAGE
    if (req.file) {
      newListing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
    }

    await newListing.save();
    req.flash("success", "Listing created successfully!");
    res.redirect(`/listings/${newListing._id}`);
  } catch (e) {
    console.log("Error creating listing:", e);
    req.flash("error", "Something went wrong while creating the listing!");
    res.redirect("/listings/new");
  }
};

// SHOW SINGLE LISTING
module.exports.showListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id)
      .populate("owner")
      .populate({
        path: "reviews",
        populate: { path: "author" },
      });

    if (!listing) {
      req.flash("error", "Cannot find that listing!");
      return res.redirect("/listings");
    }

    res.render("listings/show", { listing });
  } catch (e) {
    console.log("Error showing listing:", e);
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
};

// RENDER EDIT FORM
module.exports.editListing = async (req, res) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      req.flash("error", "Cannot find that listing!");
      return res.redirect("/listings");
    }
    res.render("listings/edit", { listing });
  } catch (e) {
    console.log("Error editing listing:", e);
    req.flash("error", "Something went wrong!");
    res.redirect("/listings");
  }
};

// UPDATE LISTING
module.exports.updateListing = async (req, res) => {
  try {
    const { id } = req.params;
    const listing = await Listing.findByIdAndUpdate(id, req.body.listing, {
      new: true,
      runValidators: true,
    });

    // HANDLE NEW IMAGE
    if (req.file) {
      listing.image = {
        url: req.file.path,
        filename: req.file.filename,
      };
      await listing.save();
    }

    req.flash("success", "Listing updated successfully!");
    res.redirect(`/listings/${listing._id}`);
  } catch (e) {
    console.log("Error updating listing:", e);
    req.flash("error", "Something went wrong while updating the listing!");
    res.redirect(`/listings/${req.params.id}/edit`);
  }
};

// DELETE LISTING
module.exports.deleteListing = async (req, res) => {
  try {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    req.flash("success", "Listing deleted successfully!");
    res.redirect("/listings");
  } catch (e) {
    console.log("Error deleting listing:", e);
    req.flash("error", "Something went wrong while deleting the listing!");
    res.redirect("/listings");
  }
};