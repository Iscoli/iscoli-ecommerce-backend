import express from "express";
import {
  addToCart,
  removeFromCart,
  updateCartItem,
  clearCart,
  getUserCart
} from "../controller/cartController.js";
import validateToken from "../middleware/validateTokenHandle.js";


const router = express.Router();

router.use(validateToken);


router.get("/", getUserCart);
router.post("/add", addToCart); // Add items to the cart
router.delete("/remove/:productId", removeFromCart); // Remove a specific item
router.put("/update/:productId", updateCartItem); // Update quantity of a specific item
router.delete("/clear", clearCart); // Clear the entire cart

export default router;
