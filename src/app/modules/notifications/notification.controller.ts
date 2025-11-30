import { Request, Response } from "express";
import { NotificationService } from "./notification.service";

// Create notification
const createNotification = async (req: Request, res: Response) => {
  try {
    const notification = await NotificationService.createNotification(req.body);
    res.status(201).json({ success: true, data: notification });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Send notification manually
const sendNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await NotificationService.getSingleNotification(id);
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });

    const result = await NotificationService.sendNotification(notification);
    notification.sentAt = new Date();
    await notification.save();

    res.status(200).json({ success: true, data: result });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get all notifications
const getAllNotifications = async (req: Request, res: Response) => {
  try {
    const notifications = await NotificationService.getAllNotifications();
    res.status(200).json({ success: true, data: notifications });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Get single notification
const getSingleNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await NotificationService.getSingleNotification(id);
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });
    res.status(200).json({ success: true, data: notification });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete notification
const deleteNotification = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const notification = await NotificationService.deleteNotification(id);
    if (!notification) return res.status(404).json({ success: false, message: "Notification not found" });
    res.status(200).json({ success: true, message: "Notification deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const NotificationController = {
  createNotification,
  sendNotification,
  getAllNotifications,
  getSingleNotification,
  deleteNotification,
};
