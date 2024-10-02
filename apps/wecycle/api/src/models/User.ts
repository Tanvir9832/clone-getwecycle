import { IUserModel, UserType } from "@tanbel/homezz/types";
import { Schema, model } from "mongoose";

const userSchema = new Schema<IUserModel>(
  {
    username: {
      type: String,
      unique: true,
      required: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    email: {
      type: String,
      unique: true,
      required: true,
    },
    firstName: {
      type: String,
    },
    lastName: {
      type: String,
    },
    userType: {
      type: [String],
      enum: UserType,
      default: [UserType.CONSUMER],
    },
    phone: {
      type: String,
    },
    location: {
      type: String,
    },
    avatar: {
      type: String,
    },
    verification: {
      email: {
        type: Boolean,
        default: false,
      },
    }
  },
  {
    timestamps: true,
  }
);

const User = model("User", userSchema);

export default User;
