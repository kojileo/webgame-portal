import mongoose, { Document, Schema } from "mongoose";

export interface IGame extends Document {
  title: string;
  description: string;
  imageUrl: string;
  playCount: number;
  category: string;
  tags: string[];
  gameUrl: string; // 追加
  developer: string; // 開発者フィールドも追加
}

const GameSchema: Schema = new Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  imageUrl: { type: String, required: false },
  playCount: { type: Number, default: 0 },
  category: { type: String, required: true },
  tags: [{ type: String }],
  gameUrl: { type: String, required: true }, // 追加
  developer: { type: String, required: true }, // 追加
});

export default mongoose.model<IGame>("Game", GameSchema);
