import { transporter } from "./sendMail.js";

export const sendGeneralInquiryMail = async (data) => {
  try {
    const { firstname, lastname, email, phone, message } = data;

    if (!firstname || !lastname || !email || !message) {
      return {
        message: "Required fields are missing",
        status: 400,
        success: false,
      };
    }

    // ===== User Mail Template =====
    const userMailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #2c3e50;">
        <h2 style="color: #1a73e8;">Hi ${firstname},</h2>
        <p>Thank you for reaching out to <strong>DNS Tech</strong>.</p>
        <p>We've received your inquiry.</p>
        <p>Our team will get back to you soon. For urgent matters, call us at
          <a href="tel:+9779808271214" style="color: #1a73e8; text-decoration: none;">+977 9808271214</a>
        </p>

        <hr style="margin: 24px 0;" />
        <p><strong>Your Inquiry Details:</strong></p>
        <ul>
          <li><strong>Name:</strong> ${firstname} ${lastname}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone || "N/A"}</li>
          <li><strong>Message:</strong> ${message}</li>
        </ul>

        <p style="margin-top: 32px;">Thank you for contacting DNS Tech.</p>
        <p style="margin-top: 4px;">— The DNS Tech Team</p>

        <hr style="margin-top: 40px;" />
        <p style="font-size: 12px; color: gray;">This is an automated message. Please do not reply.</p>
      </div>
    `;

    // ===== Admin Mail Template =====
    const adminMailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #2c3e50;">
        <h2 style="color: #d93025;">New General Inquiry Received</h2>
        <p><strong>${firstname} ${lastname}</strong> has submitted an inquiry.</p>

        <p><strong>Inquiry Details:</strong></p>
        <ul>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone || "N/A"}</li>
          <li><strong>Message:</strong> ${message}</li>
        </ul>
      </div>
    `;

    // Send mail to User
    await transporter.sendMail({
      from: `"DNS Tech" <${process.env.NODEMAILER_USER}>`,
      to: email,
      subject: `Your Inquiry Received - DNS Tech`,
      html: userMailHtml,
    });

    // Send mail to Admin
    await transporter.sendMail({
      from: `"DNS Tech" <${process.env.NODEMAILER_USER}>`,
      to: process.env.ADMIN_EMAIL,
      subject: `New General Inquiry - DNS Tech`,
      html: adminMailHtml,
    });

    return {
      success: true,
      message: "Inquiry emails sent successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return {
      success: false,
      message: "Failed to send inquiry emails",
      status: 500,
      error: error.message,
    };
  }
};

export const sendMailBack = async (email, subject, mailbody) => {
  try {
    if (!email || !subject || !mailbody) {
      return {
        message: "Required fields are missing.",
        status: 400,
        success: false,
      };
    }

    // Send mail to User
    await transporter.sendMail({
      from: `"DNS Tech" <${process.env.NODEMAILER_USER}>`,
      to: email,
      subject: subject,
      html: mailbody,
    });

    return {
      success: true,
      message: "order back mail sent successfully.",
      status: 200,
    };
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return {
      success: false,
      message: "Failed to send inquiry emails",
      status: 500,
      error: error.message,
    };
  }
};
