import { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email?: string;
  username?: string;
  password?: string;
  role: "user" | "seller" | "admin";
  verified?: boolean;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, sparse: true, trim: true },
    username: { type: String, trim: true },
    password: { type: String, trim: true, default: "" }, // EMPTY STRING
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      required: true,
    },
    verified: { type: Boolean },
  },
  { timestamps: true }
);

const User = models?.User || model<IUser>("User", UserSchema);
export default User;
