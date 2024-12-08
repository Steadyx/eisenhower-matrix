import dotenv from "dotenv";
dotenv.config();

const requiredEnvVars = ["MONGO_URI", "JWT_SECRET"];

requiredEnvVars.forEach((key) => {
  if (!process.env[key]) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
});
