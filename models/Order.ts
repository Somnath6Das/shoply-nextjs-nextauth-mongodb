import mongoose, { Schema, Types } from "mongoose";

interface OrderItem {
  productId: Types.ObjectId;
  variantId: Types.ObjectId;
  sellerId: Types.ObjectId;
  quantity: number;
  price: number;
}

const OrderItemSchema = new Schema<OrderItem>({
  productId: { type: Schema.Types.ObjectId, required: true, ref: "Product" },
  variantId: { type: Schema.Types.ObjectId, required: true },
  sellerId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
  quantity: { type: Number, required: true },
  price: { type: Number, required: true },
});

const OrderSchema = new Schema(
  {
    userId: { type: Schema.Types.ObjectId, required: true, ref: "User" },
    items: [OrderItemSchema],
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "shipped"],
      default: "pending",
    },
  },
  { timestamps: true }
);

export default mongoose.models.Order || mongoose.model("Order", OrderSchema);
