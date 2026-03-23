import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: ""
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true
    },
    quantity: {
      type: Number,
      required: true,
      min: 0
    },
    price: {
      type: Number,
      required: true,
      min: 0
    },
    image: {
      type: String,
      default: "https://via.placeholder.com/300x200?text=Product"
    }
  },
  {
    timestamps: { createdAt: "createdAt", updatedAt: true },
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

productSchema.virtual("isLowStock").get(function () {
  return this.quantity < 25;
});

const Product = mongoose.model("Product", productSchema);
export default Product;
