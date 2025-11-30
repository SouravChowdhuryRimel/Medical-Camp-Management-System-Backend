import express from "express";
import { NotificationController } from "./notification.controller";

const router = express.Router();

// Create a notification (save as draft or send immediately)
router.post("/create", NotificationController.createNotification);

// Send a notification manually (by ID)
router.post("/send/:id", NotificationController.sendNotification);

// Get all notifications
router.get("/getAll", NotificationController.getAllNotifications);

// Get a single notification by ID
router.get("/getSingle/:id", NotificationController.getSingleNotification);

// Delete a notification by ID
router.delete("/delete/:id", NotificationController.deleteNotification);

export const NotificationRoutes = router;