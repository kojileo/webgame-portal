import mongoose, { Document, Schema } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  bio: { type: String, default: "" },
  avatarUrl: { type: String, default: "" },
  totalPlayTime: { type: Number, default: 0 },
  favoriteGame: { type: String, default: "" },
  highestScore: { type: Number, default: 0 },
  badges: { type: [String], default: [] },
  isDeveloper: { type: Boolean, default: false },
  gamesPlayed: [
    {
      gameId: String,
      gameName: String,
      playCount: Number,
      highScore: Number,
      lastPlayed: String,
    },
  ],
});

UserSchema.pre<IUser>("save", async function (next) {
  if (!this.isModified("password")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

UserSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  return bcrypt.compare(candidatePassword, this.password);
};

export default mongoose.model<IUser>("User", UserSchema);
