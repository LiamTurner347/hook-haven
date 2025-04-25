import mongoose from "mongoose";

mongoose.set("strictQuery", false);

// console.log(process.env.MONGO_URL);

mongoose
  .connect(process.env.MONGO_URL!)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error: unknown) => {
    if (error instanceof Error) {
      console.log("Error connecting to MongoDB:", error.message);
    } else {
      console.log("Error connecting to MongoDB:", error);
    }
  });

const bodySchema = new mongoose.Schema(
  {
    body: { type: String, required: true },
  },
  { timestamps: true }
);

bodySchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

bodySchema.set("toObject", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

const Body = mongoose.model("body", bodySchema);
export default Body;
