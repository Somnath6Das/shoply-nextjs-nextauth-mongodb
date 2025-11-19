import { Schema, model, models, Document, Types } from "mongoose";

export interface ICategory extends Document {
  name: string;
  parent: Types.ObjectId | null;
}

const categorySchema = new Schema<ICategory>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    parent: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      default: null, // null = main category
    },
  },
  { timestamps: true }
);

// ⭐ IMPORTANT ⭐
// Unique combination: name + parent
// This means:
// - "Electronics" parent cannot be duplicated
// - "Phones" subcategory can exist under Electronics only once
// - "Phones" CAN exist under another parent (like "Accessories")
categorySchema.index({ name: 1, parent: 1 }, { unique: true });

const Category =
  models.Category || model<ICategory>("Category", categorySchema);

export default Category;
