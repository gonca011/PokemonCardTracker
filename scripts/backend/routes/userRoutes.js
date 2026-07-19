const express = require("express");
const collectionController = require("../controllers/collectionController");
const userController = require("../controllers/userController");
const wishlistController = require("../controllers/wishlistController");
const asyncHandler = require("../middleware/asyncHandler");

const router = express.Router();

router.get("/:id", asyncHandler(userController.getUser));
router.put("/:id", asyncHandler(userController.updateUser));
router.get("/:id/stats", asyncHandler(userController.getStats));

router.get("/:id/collection", asyncHandler(collectionController.list));
router.get("/:id/collection/evolution", asyncHandler(collectionController.getCollectionEvolution));
router.post("/:id/collection", asyncHandler(collectionController.create));
router.put("/:id/collection/:cardId", asyncHandler(collectionController.update));
router.delete("/:id/collection/:cardId", asyncHandler(collectionController.remove));

router.get("/:id/wishlist", asyncHandler(wishlistController.list));
router.post("/:id/wishlist", asyncHandler(wishlistController.create));
router.put("/:id/wishlist/:cardId", asyncHandler(wishlistController.update));
router.delete("/:id/wishlist/:cardId", asyncHandler(wishlistController.remove));

module.exports = router;
