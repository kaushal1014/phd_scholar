import mongoose from "mongoose";
import PhdScholar from "./server/models/PhdScholar.js";

async function reverseUpdate() {
  try {
    await mongoose.connect("mongodb://localhost:27017/Phd", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    console.log("Connected to DB.");

    // Debug - Check current data
    const beforeReversal = await PhdScholar.find({}, "certificates").lean();
    console.log("Before Reversal:", beforeReversal);

    // Reverse Update: Remove `certificates.courseWorkX` fields
    const result = await PhdScholar.updateMany(
      {
        $or: [
          { "certificates.courseWork1": { $exists: true } },
          { "certificates.courseWork2": { $exists: true } },
          { "certificates.courseWork3": { $exists: true } },
          { "certificates.courseWork4": { $exists: true } },
        ],
      },
      {
        $unset: {
          "certificates.courseWork1": "",
          "certificates.courseWork2": "",
          "certificates.courseWork3": "",
          "certificates.courseWork4": "",
        },
      }
    );

    console.log(`Reversed update for ${result.modifiedCount} documents.`);

    // Debug - Verify reversal
    const afterReversal = await PhdScholar.find({}, "certificates").lean();
    console.log("After Reversal:", afterReversal);

    mongoose.connection.close();
  } catch (err) {
    console.error("Error reversing update:", err);
  }
}

reverseUpdate();
