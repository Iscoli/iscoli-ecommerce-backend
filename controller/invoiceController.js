import Invoice from "../modal/invoiceModal.js";

export const createInvoice = async (req, res) => {
  try {
    const { products } = req.body;
    const userId = req.user.id;

    // Validate required fields
    const requiredFields = [
      "senderName",
      "items",
      "senderAddress",
      "firstName",
      "lastName",
      "email",
      "address",
      "country",
      "code",
      "city",
      "number",
      "totalPriceInCart",
      "totalPriceToPay",
      "shipping_cost",
      "order_id",
      "invoice",
      "payment_option",
      "discountPrice",
    ];
const missingFields = requiredFields.filter(
  (field) => products[field] === null || products[field] === undefined
);

if (missingFields.length > 0) {
  return res.status(400).json({
    success: false,
    message: `Missing fields: ${missingFields.join(", ")}`,
  });
}
    // Create invoice object - field names now match exactly
    const invoiceObject = {
      userId,
      items: [
        {
          // Wrap in array as per schema
          ...products, // We can spread directly since field names match
          created_at: products.created_at
            ? new Date(products.created_at)
            : new Date(),
        },
      ],
    };

 
    // Save to database
    const invoice = await Invoice.create(invoiceObject);

    res.status(201).json({
      success: true,
      message: "Invoice created successfully",
      data: invoice,
    });
  } catch (error) {
    console.error("Error creating invoice:", error);
    res.status(500).json({
      success: false,
      message: "Failed to create invoice",
      error: error.message,
    });
  }
};

export const getUserInvoices = async (req, res) => {
  try {
    const userId = req.user.id; // Assuming req.user is set by a middleware like validateToken
  
  const invoice = await Invoice.findOne({ userId });

  if (!invoice) {
    return res.status(404).json({ message: "invoice is empty" });
  }

  res.status(200).json(invoice);
  } catch (error) {
    res.status(500).json({ message:error.message });
  }
};
