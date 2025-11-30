import nodemailer from "nodemailer";

export const sendEmail = async (to: string, subject: string, message: string) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.APP_USER_EMAIL,
      pass: process.env.APP_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Medixcamp HealthCare System" <${process.env.APP_USER_EMAIL}>`,
    to,
    subject,
    html: `<p>${message}</p>`,
  };

  const info = await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent to ${to}: ${info.response}`);
};
