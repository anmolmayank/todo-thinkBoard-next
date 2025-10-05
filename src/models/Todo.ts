import { Schema, model, models } from "mongoose";

const TodoSchema = new Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  description: String,
  completed: { type: Boolean, default: false },
}, { timestamps: true });

export default models.Todo || model("Todo", TodoSchema);
