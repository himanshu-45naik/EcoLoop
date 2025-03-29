const Listing = require('./models/Listing'); // Ensure Listing model is imported

function isLoggedIn(req, res, next) {
    if (req.session && req.session.user) {
        return next();
    }
    req.flash('error', 'You must be logged in to do that');
    return res.redirect('/auth/login');
}

function isOwner(req, res, next) {
    const listingId = req.params.id;
    const userId = req.session.user._id; // Use session user ID

    Listing.findById(listingId).then(listing => {
        if (!listing) {
            req.flash('error', 'Listing not found');
            return res.redirect('/listings');
        }
        if (!listing.owner.equals(userId)) {
            req.flash('error', 'You do not have permission to edit or delete this listing.');
            return res.redirect(`/listings/${listingId}`);
        }
        next();
    }).catch(err => {
        console.error("Error checking listing ownership:", err);
        res.status(500).send("Internal server error");
    });
}

function logout(req, res) {
    req.session.destroy(err => {
        if (err) {
            console.error("Error destroying session:", err);
            return res.status(500).send("Error logging out");
        }
        res.redirect('/auth/login');
    });
}

module.exports = { isLoggedIn, isOwner, logout };