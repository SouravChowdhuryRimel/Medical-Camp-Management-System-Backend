// // Production code
// import twilio from "twilio";

// // ✅ Use `twilio()` instead of `new Twilio()`
// // The default import handles types correctly in production
// const accountSid = process.env.TWILIO_ACCOUNT_SID!;
// const authToken = process.env.TWILIO_AUTH_TOKEN!;
// const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER!; // Example: "whatsapp:+880XXXXXXXXXX"

// const client = twilio(accountSid, authToken);

// export const sendWhatsApp = async (phone: string, message: string) => {
//   try {
//     // ✅ Ensure phone number is in correct format (+8801xxxxxx)
//     const phoneNumber = phone.startsWith("+") ? phone : `+${phone}`;

//     const response = await client.messages.create({
//       from: whatsappNumber.startsWith("whatsapp:")
//         ? whatsappNumber
//         : `whatsapp:${whatsappNumber}`, // ✅ Avoid double prefix
//       to: `whatsapp:${phoneNumber}`,
//       body: message,
//     });

//     console.log(`✅ WhatsApp sent to ${phoneNumber}: SID=${response.sid}`);
//     return response;
//   } catch (err: any) {
//     console.error(`❌ WhatsApp send failed to ${phone}:`, err?.message || err);
//     throw err;
//   }
// };

import twilio from "twilio";

const accountSid = process.env.TWILIO_ACCOUNT_SID!;
const authToken = process.env.TWILIO_AUTH_TOKEN!;
const whatsappNumber = process.env.TWILIO_WHATSAPP_NUMBER!; // e.g., "whatsapp:+880XXXXXXXXXX"

const client = twilio(accountSid, authToken);

/**
 * Normalize phone number for Twilio WhatsApp
 * - Keeps only digits
 * - Adds country code if missing (example: Bangladesh = 880)
 * - Adds "whatsapp:" prefix
 */
const normalizePhoneNumber = (phone: string): string => {
  // Remove non-digit characters
  let digits = phone.replace(/\D/g, "");

  // Ensure country code (Bangladesh example)
  if (!digits.startsWith("880")) {
    if (digits.startsWith("0")) digits = "880" + digits.substring(1);
    else digits = "880" + digits;
  }

  return `whatsapp:+${digits}`;
};

export const sendWhatsApp = async (phone: string, message: string) => {
  try {
    const to = normalizePhoneNumber(phone);

    const from = whatsappNumber.startsWith("whatsapp:")
      ? whatsappNumber
      : `whatsapp:${whatsappNumber}`;

    const response = await client.messages.create({
      from,
      to,
      body: message,
    });

    console.log(`✅ WhatsApp sent to ${to}: SID=${response.sid}`);
    return response;
  } catch (err: any) {
    console.error(`❌ WhatsApp send failed to ${phone}:`, err?.message || err);
    throw err;
  }
};
