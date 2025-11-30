import cron from "node-cron";
import { CampModel } from "./eventManagement.model";

// Runs every minute (for testing)
cron.schedule("* * * * *", async () => {
  const now = new Date();

  try {
    // Completed camps
    await CampModel.updateMany(
      { endDate: { $lt: now }, status: { $ne: "Completed" } },
      { status: "Completed" }
    );

    // Ongoing camps
    await CampModel.updateMany(
      { startDate: { $lte: now }, endDate: { $gte: now }, status: { $ne: "Ongoing" } },
      { status: "Ongoing" }
    );

    // Upcoming camps
    await CampModel.updateMany(
      { startDate: { $gt: now }, status: { $ne: "Upcoming" } },
      { status: "Upcoming" }
    );

    // console.log("✅ Camp statuses auto-updated at", now.toISOString());
  } catch (err) {
    console.error("❌ Failed to update camp statuses:", err);
  }
});
