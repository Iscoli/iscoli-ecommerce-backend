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

router.get("/confirmation", (req, res) => {
const output = req.session.output;

console.log("===========confirmation==============");
if (!output) {
  console.error("No session output available");
  return res.status(400).send("No session data available for confirmation");
}


  console.log("===========confirmation==============");
 

res.render("confirmation", { ...output });
});

export default router
