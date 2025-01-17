import mongoose from "mongoose";




// Define the InvoiceItem schema
const invoiceItemSchema = new mongoose.Schema({
  id: { type: Number, required: true },
  count: { type: Number, required: true },
  imgUrl: { type: String, required: true },
  price: { type: Number, required: true },
  name: { type: String, required: true },
  discountValue: { type: Number, required: true }
});


const invoiceSchema = new mongoose.Schema({
  senderName: { type: String, required: true },
  items: { type: [invoiceItemSchema], required: true },
  senderAddress: { type: String, required: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  address: { type: String, required: true },
  country: { type: String, required: true },
  code: { type: String, required: true },
  city: { type: String, required: true },
  number: { type: String, required: true },
  totalPriceInCart: { type: Number, required: true },
  totalPriceToPay: { type: Number, required: true },
  shipping_cost: { type: String, required: true },
  order_id: { type: String, required: true },
  invoice: { type: Number, required: true },
  payment_option: { type: String, required: true },
  discountPrice: { type: Number, required: true },
  status: { type: String, default: "pending" },
  created_at: { type: Date, default: Date.now },
});

const InvoceDataSchema = new mongoose.Schema({
  items: [invoiceSchema],
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
});

const Invoice = mongoose.model("Invoice", InvoceDataSchema);
export default Invoice;
