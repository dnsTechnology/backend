import nodemailer from "nodemailer";

export const transporter = nodemailer.createTransport({
  host: "mail.dnstech.com.np",
  port: 465,
  secure: true,
  auth: {
    user: "info@dnstech.com.np", // e.g. info@dnstech.com.np
    pass: "DNStECHnEPAL", // keep in .env
  },
});

// Send Booking Mail to User & Admin
export const sendBookingMailToUserAndAdmin = async (data) => {
  try {
    const {
      name,
      email,
      phone,
      productName,
      productPrice,
      productStock,
      quantity,
      queries,
    } = data;

    if (!name || !email || !productName) {
      return {
        message: "Required fields are missing",
        status: 400,
        success: false,
      };
    }

    // ===== User Mail Template =====
    const userMailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #2c3e50;">
        <h2 style="color: #1a73e8;">Hi ${name},</h2>
        <p>Thank you for booking <strong>${productName}</strong> with <strong>DNS Tech</strong>.</p>
        <p>We've received your booking and our team will contact you soon.</p>
        <p>If urgent, call us at 
          <a href="tel:+9779808271214" style="color: #1a73e8; text-decoration: none;">+977 9808271214</a>
        </p>

        <hr style="margin: 24px 0;" />
        <p><strong>Booking Details:</strong></p>
        <ul>
          <li><strong>Product:</strong> ${productName}</li>
          <li><strong>Price:</strong> Rs. ${productPrice}</li>
          <li><strong>Stock Available:</strong> ${productStock}</li>
          <li><strong>Quantity:</strong> ${quantity}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone || "N/A"}</li>
          <li><strong>Additional Queries:</strong> ${queries || "N/A"}</li>
        </ul>

        <p style="margin-top: 32px;">Thank you for choosing DNS Tech.</p>
        <p style="margin-top: 4px;">— The DNS Tech Team</p>

        <hr style="margin-top: 40px;" />
        <p style="font-size: 12px; color: gray;">This is an automated message. Please do not reply.</p>
      </div>
    `;

    // ===== Admin Mail Template =====
    const adminMailHtml = `
      <div style="font-family: Arial, sans-serif; padding: 20px; color: #2c3e50;">
        <h2 style="color: #d93025;">New Booking Received</h2>
        <p><strong>${name}</strong> has booked a product.</p>

        <p><strong>Booking Details:</strong></p>
        <ul>
          <li><strong>Product:</strong> ${productName}</li>
          <li><strong>Price:</strong> Rs. ${productPrice}</li>
          <li><strong>Quantity:</strong> ${quantity}</li>
          <li><strong>Stock Available:</strong> ${productStock}</li>
          <li><strong>Email:</strong> ${email}</li>
          <li><strong>Phone:</strong> ${phone || "N/A"}</li>
          <li><strong>Additional Queries:</strong> ${queries || "N/A"}</li>
        </ul>
      </div>
    `;

    // Send mail to User
    await transporter.sendMail({
      from: `"DNS Tech" <${process.env.NODEMAILER_USER}>`,
      to: email,
      subject: "Your Product Booking Confirmation - DNS Tech",
      html: userMailHtml,
    });

    // Send mail to Admin
    await transporter.sendMail({
      from: `"DNS Tech" <${process.env.NODEMAILER_USER}>`,
      to: process.env.ADMIN_EMAIL, // e.g.
      subject: "New Product Booking Received - DNS Tech",
      html: adminMailHtml,
    });

    return {
      success: true,
      message: "Booking emails sent successfully",
      status: 200,
    };
  } catch (error) {
    console.error("Nodemailer Error:", error);
    return {
      success: false,
      message: "Failed to send booking emails",
      status: 500,
      error: error.message,
    };
  }
};
