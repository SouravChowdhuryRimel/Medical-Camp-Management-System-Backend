import { model, Schema } from "mongoose";
import {
  RecipientType,
  NotificationStatus,
  INotification,
  IRecipientFilter,
  IRecipient,
  ISendSummary,
} from "./notification.interface";

// Recipient filter schema
const recipientFilterSchema = new Schema<IRecipientFilter>(
  {
    appointmentDateRange: {
      start: { type: Date },
      end: { type: Date },
    },
    conditions: [{ type: String }],
    locations: [{ type: String }],
    providers: [{ type: String }],
  },
  { _id: false }
);

// Recipient schema
const recipientSchema = new Schema<IRecipient>(
  {
    type: {
      type: String,
      enum: Object.values(RecipientType),
      required: true,
    },
    filters: recipientFilterSchema,
    patientIds: [{ type: String }],
  },
  { _id: false }
);

// Send summary schema
const sendSummarySchema = new Schema<ISendSummary>(
  {
    notificationId: { type: String, required: true },
    totalRecipients: { type: Number, required: true },
    successfulSends: { type: Number, required: true },
    failedSends: { type: Number, required: true },
    sendDate: { type: Date, required: true },
    errors: [{ type: String }],
  },
  { _id: false }
);

// Notification schema
const notificationSchema = new Schema<INotification>(
  {
    title: { type: String, required: true },
    recipients: { type: recipientSchema, required: true },
    subject: { type: String, required: true },
    message: { type: String, required: true },
    status: {
      type: String,
      enum: Object.values(NotificationStatus),
      default: NotificationStatus.DRAFT,
    },
    scheduledFor: { type: Date },
    sentAt: { type: Date },
    sendSummary: { type: sendSummarySchema }, // ✅ Added sendSummary
  },
  { timestamps: true, versionKey: false }
);

export const NotificationModel = model<INotification>(
  "Notification",
  notificationSchema
);
