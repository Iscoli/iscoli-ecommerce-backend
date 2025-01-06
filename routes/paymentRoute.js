import express from "express";


import middleware from "../middleware/paystackMiddleWare.js";
import { confirmation, verify } from "../controller/paystackController.js";


const router = express.Router();
//middlewares
router.use(middleware);

router.get("/", (req, res) => {
  res.render("home");
});

//paystack verify payment
router.post("/verify/:ref", verify);

router.get("/confirmation", confirmation);

export default router
