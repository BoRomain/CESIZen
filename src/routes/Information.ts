import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
  res.send("Information");
});

export default router;
