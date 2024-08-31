import mongoose, { Document, Schema } from "mongoose";

export interface IGame extends Document {
  title: string;
  description: string;
  imageUrl: string;
  playCount: number;
  category: string;
  tags: string[];
}

const GameSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: true },
  playCount: { type: Number, default: 0 },
  category: { type: String, required: true },
  tags: [{ type: String }],
});

export default mongoose.model<IGame>("Game", GameSchema);
