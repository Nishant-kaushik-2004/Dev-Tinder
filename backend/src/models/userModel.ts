// Typescript is not supported while using require.
import { Schema, model } from "mongoose";
import validator from "validator"; // ✅ Default import

// 1. Create an interface representing a document in MongoDB.
export interface IUser {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  age?: number;
  gender?: string;
  photoUrl: string;
  about?: string;
  skills?: string[];
  location?: string;
  jobTitle?: string;
  company?: string;
  experience?: number;
  isFresher: boolean;
  profileViews: number;
}

// 2. Create a Schema corresponding to the document interface.
const userScehma = new Schema<IUser>(
  {
    firstName: {
      type: String,
      required: true,
      index: true, // Not necessary in this case as we are not querying or searching in the database with firstName.
      // Indexes are used to optimise searching on the basis of a particular field, here firstName.
      minlength: [
        3,
        `firstname should be minimum three characters long, got only {VALUE}.`,
      ], // {VALUE} will print the value of the field, here firstname (a String).
      maxlength: [30, "firstname should be under 30 letters"],
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      maxlength: [30, "lastName should be under 30 letters"],
      trim: true,
    },
    email: {
      type: String,
      required: true,
      unique: [true, "A user has already registered with this emailId"],
      // index: true,
      // Unique index. If you specify 'unique: true'
      // specifying 'index: true' is optional if you do unique:true
      lowercase: true,
      trim: true,
      validate: {
        validator: function (value: string) {
          return validator.isEmail(value);
        },
        message: (props: any) => `${props.value} is an invalid email address`,
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "{VALUE} is not a valid gender type",
      },
    },
    photoUrl: {
      type: String,
      default: "https://geographyandyou.com/images/user-profile.png",
      validate: {
        validator: function (value: string) {
          return validator.isURL(value);
        },
        message: (props: any) => `Invalid photo URL: ${props.value}`,
      },
    },
    about: {
      type: String,
      default: "This is a default about of the user",
      maxlength: [1000, "About section content should not exceed 1000 letters"],
      trim: true,
    },
    skills: {
      type: [String],
    },
    location: {
      type: String,
    },
    isFresher: {
      type: Boolean,
      default: false,
    },
    jobTitle: {
      type: String,
      maxlength: [60, "Job title should be under 60 letters"],
      trim: true,
    },
    company: {
      type: String,
      maxlength: [60, "Company name should be under 60 letters"],
      trim: true,
    },
    experience: {
      type: Number,
      max: 20,
    },
    profileViews: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// 3. Create a Model.
export const User = model<IUser>("User", userScehma);
