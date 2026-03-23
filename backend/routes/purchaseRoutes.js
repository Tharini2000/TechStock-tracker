import express from "express";

const router = express.Router();

router.all("*", (req, res) => {
  res.status(410).json({
    message: "Purchase request endpoints were replaced. Use /api/orders and /api/cart endpoints."
  });
});

export default router;
