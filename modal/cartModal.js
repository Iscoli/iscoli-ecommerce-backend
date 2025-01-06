import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
  productId: { type: String, required: true },
  imgUrl: String,
  maincategory: String,
  price: Number,
  name: String,
  weight: String,
  details: [String],
  stock: Number,
  subcategory: String,
  discount: Number,
  quantity: { type: Number, default: 1 },
});

const cartSchema = new mongoose.Schema({
  items: [productSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Cart = mongoose.model("Cart", cartSchema);
export default Cart;
