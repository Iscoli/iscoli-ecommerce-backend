import asyncHandler from "express-async-handler";
import Cart from "../modal/cartModal.js";




// @desc get items of the cart
// @route POST /api/cart
// @access Private

export const getUserCart = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user is set by validateToken
    const cart = await Cart.findOne({ userId });

    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// @desc Add items to the cart
// @route POST /api/cart/add
// @access Private
export const addToCart = asyncHandler(async (req, res) => {
  const { products } = req.body;
  const userId = req.user.id;

  if (!products || Object.keys(products).length === 0) {
    res.status(400);
    throw new Error("No products provided");
  }

  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = new Cart({ userId, items: [] });
  }

  for (const key in products) {
    const product = products[key];
    const existingProductIndex = cart.items.findIndex(
      (item) => item.productId === product.productId
    );

    if (existingProductIndex > -1) {
      cart.items[existingProductIndex].quantity += 1;
    } else {
      cart.items.push({
        productId: product.id,
        imgUrl: product.imgUrl,
        maincategory: product.maincategory,
        price: product.price,
        name: product.name,
        weight: product.weight,
        details: product.details,
        stock: product.stock,
        subcategory: product.subcategory,
        discount: product.discount || 0,
        quantity: 1,
      });
    }
  }

  await cart.save();
  res.status(200).json(cart);
});

// @desc Remove an item from the cart
// @route DELETE /api/cart/remove/:productId
// @access Private
export const removeFromCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const cart = await Cart.findOne({ userId });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  cart.items = cart.items.filter((item) => item.productId !== productId);
  await cart.save();
  res.status(200).json(cart);
});

// @desc Update the quantity of a product in the cart
// @route PUT /api/cart/update/:productId
// @access Private
export const updateCartItem = asyncHandler(async (req, res) => {
  const { productId } = req.params; // Get productId from the URL parameter
  const { quantity } = req.body;    // Get quantity change from the request body (e.g., -1 to reduce)
  const userId = req.user.id;       // Get userId from the logged-in user
  
  if (quantity === 0) {
    res.status(400);
    throw new Error("Quantity cannot be zero");
  }

  // Find the user's cart
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    res.status(404);
    throw new Error("Cart not found");
  }

  // Find the product in the cart
  const productIndex = cart.items.findIndex(item => item.productId === productId);
  
  if (productIndex === -1) {
    res.status(404);
    throw new Error("Product not found in the cart");
  }

  // Calculate the new quantity
  const currentQuantity = cart.items[productIndex].quantity;
  const newQuantity = currentQuantity + quantity; // Add the quantity change (negative for reducing)

  
  if (newQuantity < 1) {
    res.status(400);
    throw new Error("Quantity cannot be less than 1");
  }

  // Update the quantity of the product
  cart.items[productIndex].quantity = newQuantity;

  // Save the updated cart
  await cart.save();
  res.status(200).json(cart);
});


// @desc Clear the cart
// @route DELETE /api/cart/clear
// @access Private
export const clearCart = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const cart = await Cart.findOne({ userId });

  if (cart) {
    cart.items = [];
    await cart.save();
    res.status(200).json({ message: "Cart cleared" });
  } else {
    res.status(404);
    throw new Error("Cart not found");
  }
});
