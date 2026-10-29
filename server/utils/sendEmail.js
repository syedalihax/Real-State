
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: Number(process.env.SMTP_PORT || 465),
  secure: true,
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS },
});

export const sendInquiryEmail = async ({ to, propertyTitle, inquirer, message }) => {
  if (!process.env.SMTP_USER) return; // email disabled if SMTP not configured
  await transporter.sendMail({
    from: `"RealEstate Alerts" <${process.env.SMTP_USER}>`,
    to,
    subject: `New inquiry: ${propertyTitle}`,
    html: `
      <h2>New Property Inquiry</h2>
      <p><b>Property:</b> ${propertyTitle}</p>
      <p><b>From:</b> ${inquirer.name} (${inquirer.email})</p>
      <p><b>Phone:</b> ${inquirer.phone || "-"}</p>
      <p><b>Message:</b> ${message || "-"}</p>
      <p>Login to the admin panel to respond.</p>
    `,
  });
};
