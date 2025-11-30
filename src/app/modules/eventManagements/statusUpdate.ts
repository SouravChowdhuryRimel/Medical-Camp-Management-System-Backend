import {
  CallbackWithoutResultAndOptionalError,
  Document,
  Query,
} from "mongoose";

// For create / save middleware
export const updateCampStatusOnSave = function (
  this: Document,
  next: CallbackWithoutResultAndOptionalError
) {
  const now = new Date();
  const startDate = this.get("startDate");
  const endDate = this.get("endDate");

  if (now < startDate) this.set("status", "Upcoming");
  else if (now >= startDate && now <= endDate) this.set("status", "Ongoing");
  else this.set("status", "Completed");

  next();
};

// For updateOne / findOneAndUpdate middleware
export const updateCampStatusOnUpdate = function (
  this: Query<any, any>,
  next: CallbackWithoutResultAndOptionalError
) {
  const update = this.getUpdate() as any;

  const startDate = update.startDate || update.$set?.startDate;
  const endDate = update.endDate || update.$set?.endDate;

  if (!startDate && !endDate) return next();

  const now = new Date();
  const sDate = startDate ? new Date(startDate) : null;
  const eDate = endDate ? new Date(endDate) : null;

  let newStatus = "Upcoming";

  if (sDate && now < sDate) newStatus = "Upcoming";
  if (sDate && eDate && now >= sDate && now <= eDate) newStatus = "Ongoing";
  if (eDate && now > eDate) newStatus = "Completed";

  this.set({ status: newStatus });

  next();
};
