import asynchandler from "express-async-handler";
import jwt from "jsonwebtoken"

const validateToken = asynchandler(async (req, res, next) => {
  let authHeader = req.headers.Authorization || req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401);
    throw new Error("Authorization token not provided");
  }

  const accessToken = authHeader.split(" ")[1];

  jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
    if (err) {
      res.status(401);
      throw new Error("User is not authorized");
    }
    req.user = decoded.user;
    next();
  });
  
});

export default validateToken;
