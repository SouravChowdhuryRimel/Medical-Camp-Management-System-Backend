import dotenv from "dotenv";
dotenv.config(); // must be first
import mongoose from "mongoose";
import app from "./app";
import { configs } from "./app/configs";
async function main() {
    await mongoose.connect(configs.db_url!);
    app.listen(configs.port, () => {
        console.log(`Server listening on port ${configs.port}\nDatabase connected successfully`);
    });
}
main().catch(err => console.log(err));
