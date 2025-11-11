import { Schema, model, models, Document } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser extends Document {
  email?: string;
  username?: string; // for admin
  sellerName?: string;
  password: string;
  role: "user" | "seller" | "admin";
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    email: { type: String, unique: true, sparse: true },
    username: { type: String, unique: true, sparse: true },
    sellerName: { type: String },
    password: { type: String },
    role: {
      type: String,
      enum: ["user", "seller", "admin"],
      required: true,
    },
  },
  { timestamps: true }
);

// hash password before saving
UserSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

const User = models?.User || model<IUser>("User", UserSchema);
export default User;
