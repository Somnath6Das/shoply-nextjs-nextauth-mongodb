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

// Prevent hashing if password is empty or untouched
UserSchema.pre("save", async function (next) {
  if (!this.password || this.password.trim() === "") {
    return next();
  }

  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }

  next();
});

const User = models?.User || model<IUser>("User", UserSchema);
export default User;
