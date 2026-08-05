import "dotenv/config";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import { connectDB } from "./config/db.js";
import { User } from "./models/index.js";

const admin = {
  name: "Haris",
  email: "haris@martify.com",
  password: "1234567890",
  role: "Admin",
};

async function run() {
  await connectDB();

  await User.findOneAndUpdate(
    { email: admin.email },
    {
      $set: {
        name: admin.name,
        email: admin.email,
        passwordHash: await bcrypt.hash(admin.password, 10),
        role: admin.role,
        status: "active",
      },
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  console.log(`[seed:admin] ensured ${admin.email} has the ${admin.role} role.`);
  await mongoose.disconnect();
}

run().catch(async (error) => {
  console.error(error);
  await mongoose.disconnect();
  process.exit(1);
});
