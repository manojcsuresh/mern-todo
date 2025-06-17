import express from "express";
import Todo from "../models/todo.model.js";
import { protect } from "../middleware/auth.js";


const router = express.Router();


router.get("/", protect, async (req, res) => {
  try {
    const todos = await Todo.find({ user: req.user.id }).sort({ deadline: 1 });
    res.json(todos);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// Add 
router.post("/", protect, async (req, res) => {
  const todo = new Todo({
    text: req.body.text,
    deadline: req.body.deadline,
    user: req.user.id,
  });
  try {
    const newTodo = await todo.save();
    res.status(201).json(newTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Update 
router.patch("/:id", protect, async (req, res) => {
  try {
    const todo = await Todo.findOne({ _id: req.params.id, user: req.user.id });
    if (!todo) return res.status(404).json({ message: "Todo not found" });

    if (req.body.text !== undefined) {
      todo.text = req.body.text;
    }
    if (req.body.completed !== undefined) {
      todo.completed = req.body.completed;
    }

    const updatedTodo = await todo.save();
    res.json(updatedTodo);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// Delete 
router.delete("/:id", protect, async (req, res) => {
  try {
    const todo = await Todo.findOneAndDelete({ _id: req.params.id, user: req.user.id });
    if (!todo) return res.status(404).json({ message: "Todo not found or unauthorized" });
    res.json({ message: "Todo deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


export default router;
