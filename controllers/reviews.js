const Listing = require("../models/listing");
const Review = require("../models/review");

module.exports.createReview = async (req, res) => {
    try {
        let listing = await Listing.findById(req.params.id);
        if (!listing) {
            req.flash("error", "Listing not found!");
            return res.redirect("/listings");
        }

        console.log("Received Review Data:", req.body.review); // Debugging

        let newReview = new Review({
            rating: req.body.review.rating,  // Ensure this is being passed
            comment: req.body.review.comment,
            author: req.user._id
        });

        listing.reviews.push(newReview);

        await newReview.save();
        await listing.save();

        req.flash("success", "New Review Created!");
        res.redirect(`/listings/${listing._id}`);
    } catch (error) {
        console.error("Error creating review:", error);
        req.flash("error", "Failed to create review. Please try again.");
        res.redirect(`/listings/${req.params.id}`);
    }
};


module.exports.destroyReview = async (req, res) => {
    try {
        let { id, reviewId } = req.params;

        // Check if the review exists
        const review = await Review.findById(reviewId);
        if (!review) {
            req.flash("error", "Review not found!");
            return res.redirect(`/listings/${id}`);
        }

        await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
        await Review.findByIdAndDelete(reviewId);

        req.flash("success", "Review Deleted!");
        res.redirect(`/listings/${id}`);
    } catch (error) {
        console.error("Error deleting review:", error);
        req.flash("error", "Failed to delete review. Please try again.");
        res.redirect(`/listings/${id}`);
    }
};
