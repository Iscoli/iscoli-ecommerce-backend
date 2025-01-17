import express from "express";
import {
  createInvoice,
  getUserInvoices,
} from "../controller/invoiceController.js";
import validateToken from "../middleware/validateTokenHandle.js";

const router = express.Router();

router.use(validateToken);


router.get("/", getUserInvoices)
router.post("/add", createInvoice);

export default router