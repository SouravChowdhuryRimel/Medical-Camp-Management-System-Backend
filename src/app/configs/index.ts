import dotenv from "dotenv";
dotenv.config(); // Load .env first


export const configs = {
  port: process.env.PORT || 5000,
  env: process.env.NODE_ENV || "development",
  db_url: process.env.DB_URL!,
  jwt: {
    access_token: process.env.ACCESS_TOKEN!,
    refresh_token: process.env.REFRESH_TOKEN!,
    access_expires: process.env.ACCESS_EXPIRES || "15d",
    refresh_expires: process.env.REFRESH_EXPIRES || "7d",
    reset_secret: process.env.RESET_SECRET || "",
    reset_expires: process.env.RESET_EXPIRES || "",
    front_end_url: process.env.FRONT_END_URL ||"https://medixcamp.com"|| "https://docmnk.netlify.app" || "http://localhost:5173" || "http://localhost:5174",
    verified_token: process.env.VERIFIED_TOKEN || "",
  },
  // Add bcrypt configuration
  bcrypt: {
    salt_rounds: parseInt(process.env.BCRYPT_SALT_ROUNDS || "12"),
  },
  email: {
    app_email: process.env.APP_USER_EMAIL!,
    app_password: process.env.APP_PASSWORD!,
  },
  cloudinary: {
    cloud_name: process.env.CLOUD_NAME || "",
    cloud_api_key: process.env.CLOUD_API_KEY || "",
    cloud_api_secret: process.env.CLOUD_API_SECRET || "",
  },
};
