import mongoose from "mongoose";

const contactSupportSchema = new mongoose.Schema(
  {
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User"
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    message: {
      type: String,
      required: true,
      trim: true
    },
    status: {
      type: String,
      enum: ["pending", "replied"],
      default: "pending"
    },
    adminReply: {
      message: {
        type: String,
        trim: true
      },
      repliedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      },
      repliedAt: {
        type: Date
      }
    }
  },
  { timestamps: true }
);

const ContactSupport = mongoose.model("ContactSupport", contactSupportSchema);
export default ContactSupport;
