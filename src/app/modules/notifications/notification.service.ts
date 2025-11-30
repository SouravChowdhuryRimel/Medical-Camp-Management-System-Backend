// import { NotificationModel } from "./notification.model";
// import { sendEmail } from "../../utils/sendEmail";
// import { RecipientType, NotificationStatus } from "./notification.interface";
// import { getPatientModel } from "../patientRegistration/patientRegistration.model";
// import { Configuration } from "../configurations/configuration.model";
// import { sendWhatsApp } from "../../utils/sendWhatsApp"; // Updated WhatsApp utility

// // 🟢 Create & optionally send notification
// export const createNotification = async (data: any) => {
//   const notification = await NotificationModel.create(data);

//   // Auto-send if status is SENT or SCHEDULED
//   if (
//     data.status === NotificationStatus.SENT ||
//     data.status === NotificationStatus.SCHEDULED
//   ) {
//     const sendResult = await sendNotification(notification);
//     notification.sentAt = new Date();
//     notification.sendSummary = sendResult; // ✅ Save send summary
//     await notification.save();
//   }

//   console.log("✅ Notification created:", notification._id);
//   return notification;
// };

// // 🟡 Send notification logic (email + WhatsApp)
// export const sendNotification = async (notificationData: any) => {
//   let totalRecipients = 0;
//   let successfulSends = 0;
//   let failedSends = 0;
//   const errors: string[] = [];
//   let recipientsList: any[] = [];

//   console.log("📩 Notification trigger started:", notificationData._id);

//   try {
//     const PatientRegistration = await getPatientModel();

//     // 🔹 Step 1: Determine recipients
//     switch (notificationData.recipients.type) {
//       case RecipientType.SPECIFIC_PATIENTS:
//         recipientsList = await PatientRegistration.find({
//           _id: { $in: notificationData.recipients.patientIds || [] },
//         }).lean();
//         break;

//       case RecipientType.ALL_PATIENTS:
//         recipientsList = await PatientRegistration.find({}).lean();
//         break;

//       case RecipientType.ALL_PATIENTS_WITH_UPCOMING_APPOINTMENTS:
//         recipientsList = await PatientRegistration.find({
//           "upcomingAppointments.0": { $exists: true },
//         }).lean();
//         break;

//       case RecipientType.PATIENTS_BY_CONDITION:
//         const conditions =
//           notificationData.recipients.filters?.conditions || [];
//         recipientsList = await PatientRegistration.find({
//           "Vital Check.disease": { $in: conditions },
//         }).lean();
//         break;

//       default:
//         recipientsList = [];
//     }

//     totalRecipients = recipientsList.length;
//     console.log("Recipients list count:", totalRecipients);

//     if (totalRecipients === 0) {
//       console.warn("⚠️ No recipients found for this notification.");
//       return {
//         notificationId: notificationData._id,
//         totalRecipients: 0,
//         successfulSends: 0,
//         failedSends: 0,
//         sendDate: new Date(),
//         errors: ["No recipients found"],
//       };
//     }

//     // 🔹 Step 2: Get dynamic section for email/phone from configuration
//     const configs = await Configuration.find();
//     const contactSection = configs.find((section) =>
//       section.fields.some((f) => ["email", "phoneNumber"].includes(f.fieldName))
//     );
//     const sectionName = contactSection?.sectionName;

//     if (!sectionName) {
//       console.error("🚨 No section contains email/phoneNumber fields!");
//       return {
//         notificationId: notificationData._id,
//         totalRecipients,
//         successfulSends,
//         failedSends: totalRecipients,
//         sendDate: new Date(),
//         errors: ["No email/phone section found in configuration"],
//       };
//     }

//     // 🔹 Step 3: Loop through recipients
//     for (const recipient of recipientsList) {
//       const email = recipient[sectionName]?.email || null;
//       let phone = recipient[sectionName]?.phoneNumber || null;
//       const name = recipient[sectionName]?.fullName || "Unknown";

//       console.log("--------------------------------------------------");
//       console.log("👤 Sending to:", { email, phone, name });

//       if (!email && !phone) {
//         console.warn(
//           "⚠️ No email or phone found for this recipient. Skipping..."
//         );
//         failedSends++;
//         continue;
//       }

//       // 🔹 Send Email
//       if (email) {
//         try {
//           await sendEmail(
//             email,
//             notificationData.subject,
//             notificationData.message
//           );
//           console.log(`✅ Email sent successfully to ${email}`);
//         } catch (err: any) {
//           failedSends++;
//           const errorMsg = err.response?.data
//             ? JSON.stringify(err.response.data)
//             : err.message;
//           errors.push(`Email to ${email}: ${errorMsg}`);
//           console.error(`❌ Failed email to ${email}:`, errorMsg);
//         }
//       }

//       // 🔹 Send WhatsApp
//       if (phone) {
//         try {
//           // Remove any leading '+' or 'whatsapp:' to avoid double prefix
//           phone = phone.replace(/^(\+?whatsapp:)?/, "");
//           phone = `whatsapp:${phone}`; // Ensure correct Twilio format

//           await sendWhatsApp(phone, notificationData.message);
//           console.log(`✅ WhatsApp sent successfully to ${phone}`);
//         } catch (err: any) {
//           failedSends++;
//           const errorMsg = err.response?.data
//             ? JSON.stringify(err.response.data)
//             : err.message;
//           errors.push(`WhatsApp to ${phone}: ${errorMsg}`);
//           console.error(`❌ Failed WhatsApp to ${phone}:`, errorMsg);
//         }
//       }

//       successfulSends++;
//     }

//     console.log("📦 Notification send completed!");
//   } catch (outerErr: any) {
//     console.error("🚨 Error while sending notification:", outerErr.message);
//     errors.push(outerErr.message);
//   }

//   return {
//     notificationId: notificationData._id,
//     totalRecipients,
//     successfulSends,
//     failedSends,
//     sendDate: new Date(),
//     errors,
//   };
// };

// // 🟠 Get all notifications
// const getAllNotifications = async () => {
//   return await NotificationModel.find().sort({ createdAt: -1 });
// };

// // 🔵 Get single notification
// const getSingleNotification = async (id: string) => {
//   return await NotificationModel.findById(id);
// };

// // 🔴 Delete notification
// const deleteNotification = async (id: string) => {
//   const notification = await NotificationModel.findByIdAndDelete(id);
//   return notification;
// };

// export const NotificationService = {
//   createNotification,
//   sendNotification,
//   getAllNotifications,
//   getSingleNotification,
//   deleteNotification,
// };

import { NotificationModel } from "./notification.model";
import { sendEmail } from "../../utils/sendEmail";
import { RecipientType, NotificationStatus } from "./notification.interface";
import { getPatientModel } from "../patientRegistration/patientRegistration.model";
import { Configuration } from "../configurations/configuration.model";
import { sendWhatsApp } from "../../utils/sendWhatsApp";

// Possible dynamic email keys
const emailKeys = [
  "email",
  "emailaddress",
  "email_id",
  "mail",
  "patientemail",
  "contactemail",
  "Email",
];

// Possible dynamic phone keys
const phoneKeys = [
  "phone",
  "phonenumber",
  "mobile",
  "mobilenumber",
  "contact",
  "contactnumber",
  "phone_no",
  "phoneno",
  "Phone Number",
];

// // ------------------------------------------------------------
// // 🟢 Create Notification
// // ------------------------------------------------------------
// export const createNotification = async (data: any) => {
//   const notification = await NotificationModel.create(data);

//   if (
//     data.status === NotificationStatus.SENT ||
//     data.status === NotificationStatus.SCHEDULED
//   ) {
//     const sendResult = await sendNotification(notification);
//     notification.sentAt = new Date();
//     notification.sendSummary = sendResult;
//     await notification.save();
//   }

//   return notification;
// };

// // ------------------------------------------------------------
// // 🟡 Send Notification
// // ------------------------------------------------------------
// export const sendNotification = async (notificationData: any) => {
//   let totalRecipients = 0;
//   let successfulSends = 0;
//   let failedSends = 0;
//   const errors: string[] = [];
//   let recipientsList: any[] = [];

//   try {
//     const PatientRegistration = await getPatientModel();

//     // Determine recipients
//     switch (notificationData.recipients.type) {
//       case RecipientType.SPECIFIC_PATIENTS:
//         recipientsList = await PatientRegistration.find({
//           _id: { $in: notificationData.recipients.patientIds || [] },
//         }).lean();
//         break;

//       case RecipientType.ALL_PATIENTS:
//         recipientsList = await PatientRegistration.find().lean();
//         break;

//       case RecipientType.ALL_PATIENTS_WITH_UPCOMING_APPOINTMENTS:
//         recipientsList = await PatientRegistration.find({
//           "upcomingAppointments.0": { $exists: true },
//         }).lean();
//         break;

//       case RecipientType.PATIENTS_BY_CONDITION:
//         recipientsList = await PatientRegistration.find({
//           "Vital Check.disease": {
//             $in: notificationData.recipients.filters?.conditions || [],
//           },
//         }).lean();
//         break;

//       default:
//         recipientsList = [];
//     }

//     totalRecipients = recipientsList.length;

//     if (totalRecipients === 0) {
//       return {
//         notificationId: notificationData._id,
//         totalRecipients: 0,
//         successfulSends: 0,
//         failedSends: 0,
//         sendDate: new Date(),
//         errors: ["No recipients found"],
//       };
//     }

//     // ------------------------------------------------------------
//     // Find section containing dynamic email/phone fields
//     // ------------------------------------------------------------
//     const configs = await Configuration.find();
//     const contactSection = configs.find((section) =>
//       section.fields.some((f: any) => {
//         const field = f.fieldName?.toLowerCase();
//         return emailKeys.includes(field) || phoneKeys.includes(field);
//       })
//     );

//     const sectionName = contactSection?.sectionName;

//     if (!sectionName) {
//       return {
//         notificationId: notificationData._id,
//         totalRecipients,
//         successfulSends,
//         failedSends: totalRecipients,
//         sendDate: new Date(),
//         errors: ["No email/phone section found in configuration"],
//       };
//     }

//     // ------------------------------------------------------------
//     // Loop through all recipients
//     // ------------------------------------------------------------
//     for (const recipient of recipientsList) {
//       const sectionData: Record<string, any> = recipient[sectionName] || {};

//       // -------------------------------
//       // Extract dynamic email (string)
//       // -------------------------------
//       const emailEntry = Object.entries(sectionData).find(([key]) =>
//         emailKeys.includes(key.toLowerCase())
//       );
//       const email: string = emailEntry ? String(emailEntry[1]) : "";

//       // -------------------------------
//       // Extract dynamic phone (string)
//       // -------------------------------
//       const phoneEntry = Object.entries(sectionData).find(([key]) =>
//         phoneKeys.includes(key.toLowerCase())
//       );
//       let phone: string = phoneEntry ? String(phoneEntry[1]) : "";

//       const name: string =
//         sectionData.fullName ||
//         sectionData.name ||
//         recipient.fullName ||
//         "Unknown";

//       if (!email && !phone) {
//         failedSends++;
//         continue;
//       }

//       // -------------------------------
//       // Send Email
//       // -------------------------------
//       if (email) {
//         try {
//           await sendEmail(
//             email,
//             notificationData.subject,
//             notificationData.message
//           );
//           console.log(`Email sent → ${email}`);
//         } catch (err: any) {
//           failedSends++;
//           errors.push(`Email to ${email}: ${err.message}`);
//         }
//       }

//       // -------------------------------
//       // Send WhatsApp
//       // -------------------------------
//       if (phone) {
//         try {
//           // Always ensure valid whatsapp: format
//           phone = phone.replace(/^(\+?whatsapp:)?/, "");
//           phone = `whatsapp:${phone}`;

//           await sendWhatsApp(phone, notificationData.message);
//           console.log(`WhatsApp sent → ${phone}`);
//         } catch (err: any) {
//           failedSends++;
//           errors.push(`WhatsApp to ${phone}: ${err.message}`);
//         }
//       }

//       successfulSends++;
//     }
//   } catch (err: any) {
//     errors.push(err.message);
//   }

//   return {
//     notificationId: notificationData._id,
//     totalRecipients,
//     successfulSends,
//     failedSends,
//     sendDate: new Date(),
//     errors,
//   };
// };

// ------------------------------------------------------------
// CRUD
// ------------------------------------------------------------





// ------------------------------------------------------------
// 🟢 CREATE NOTIFICATION
// ------------------------------------------------------------



const createNotification = async (data: any) => {
  const notification = await NotificationModel.create(data);

  if (
    data.status === NotificationStatus.SENT ||
    data.status === NotificationStatus.SCHEDULED
  ) {
    const sendResult = await sendNotification(notification);
    notification.sentAt = new Date();
    notification.sendSummary = sendResult;
    await notification.save();
  }

  return notification;
};

// ------------------------------------------------------------
// 🟡 Send Notification
// ------------------------------------------------------------
const sendNotification = async (notificationData: any) => {
  let totalRecipients = 0;
  let successfulSends = 0;
  let failedSends = 0;
  const errors: string[] = [];
  let recipientsList: any[] = [];

  try {
    const PatientRegistration = await getPatientModel();

    // Determine recipients
    switch (notificationData.recipients.type) {
      case RecipientType.SPECIFIC_PATIENTS:
        recipientsList = await PatientRegistration.find({
          _id: { $in: notificationData.recipients.patientIds || [] },
        }).lean();
        break;

      case RecipientType.ALL_PATIENTS:
        recipientsList = await PatientRegistration.find().lean();
        break;

      case RecipientType.ALL_PATIENTS_WITH_UPCOMING_APPOINTMENTS:
        recipientsList = await PatientRegistration.find({
          "upcomingAppointments.0": { $exists: true },
        }).lean();
        break;

      case RecipientType.PATIENTS_BY_CONDITION:
        recipientsList = await PatientRegistration.find({
          "Vital Check.disease": {
            $in: notificationData.recipients.filters?.conditions || [],
          },
        }).lean();
        break;

      default:
        recipientsList = [];
    }

    totalRecipients = recipientsList.length;

    if (totalRecipients === 0) {
      return {
        notificationId: notificationData._id,
        totalRecipients: 0,
        successfulSends: 0,
        failedSends: 0,
        sendDate: new Date(),
        errors: ["No recipients found"],
      };
    }

    // ------------------------------------------------------------
    // Use patient JSON directly: "Registration" section
    // ------------------------------------------------------------
    for (const recipient of recipientsList) {
      const sectionData: Record<string, any> = recipient["Registration"] || {};

      // -------------------------------
      // Extract email
      // -------------------------------
      const emailEntry = Object.entries(sectionData).find(([key]) =>
        emailKeys.includes(key.toLowerCase())
      );
      const email: string = emailEntry ? String(emailEntry[1]) : "";

      // -------------------------------
      // Extract phone
      // -------------------------------
      const phoneEntry = Object.entries(sectionData).find(([key]) =>
        phoneKeys.includes(key.toLowerCase())
      );
      let phone: string = phoneEntry ? String(phoneEntry[1]) : "";

      const name: string =
        sectionData["Full Name"] ||
        sectionData["fullName"] ||
        sectionData["name"] ||
        "Unknown";

      if (!email && !phone) {
        failedSends++;
        errors.push(`No email or phone for patient: ${name}`);
        continue;
      }

      // -------------------------------
      // Send Email
      // -------------------------------
      if (email) {
        try {
          await sendEmail(email, notificationData.subject, notificationData.message);
          console.log(`Email sent → ${email}`);
          successfulSends++;
        } catch (err: any) {
          failedSends++;
          errors.push(`Email to ${email}: ${err.message}`);
        }
      }

      // -------------------------------
      // Send WhatsApp
      // -------------------------------
      if (phone) {
        try {
          // Ensure whatsapp format
          phone = phone.replace(/^(\+?whatsapp:)?/, "");
          phone = `whatsapp:${phone}`;

          await sendWhatsApp(phone, notificationData.message);
          console.log(`WhatsApp sent → ${phone}`);
          successfulSends++;
        } catch (err: any) {
          failedSends++;
          errors.push(`WhatsApp to ${phone}: ${err.message}`);
        }
      }
    }
  } catch (err: any) {
    errors.push(err.message);
  }

  return {
    notificationId: notificationData._id,
    totalRecipients,
    successfulSends,
    failedSends,
    sendDate: new Date(),
    errors,
  };
};

const getAllNotifications = async () => {
  return await NotificationModel.find().sort({ createdAt: -1 });
};

const getSingleNotification = async (id: string) => {
  return await NotificationModel.findById(id);
};

const deleteNotification = async (id: string) => {
  return await NotificationModel.findByIdAndDelete(id);
};

export const NotificationService = {
  createNotification,
  sendNotification,
  getAllNotifications,
  getSingleNotification,
  deleteNotification,
};
