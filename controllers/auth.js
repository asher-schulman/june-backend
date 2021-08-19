const User = require("../models/User");
const { Router } = require("express");
const router = Router();

//index route
router.get("/", async (req, res) => {
  res.json(await User.find({}));
});

//create route
router.post("/", async (req, res) => {
  res.json(await User.create(req.body));
});

//update route
router.put("/:id", async (req, res) => {
  res.json(await User.findByIdAndUpdate(req.params.id, req.body, { new: true }));
});

//delete route
router.delete("/:id", async (req, res) => {
  res.json(await User.findByIdAndRemove(req.params.id));
});

// EXPORT ROUTER
module.exports = router;
