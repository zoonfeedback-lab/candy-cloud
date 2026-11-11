import nodemailer from "nodemailer";

const createTransporter = () => {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_APP_PASSWORD) {
        return null;
    }

    return nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: process.env.SMTP_EMAIL,
            pass: process.env.SMTP_APP_PASSWORD,
        },
    });
};

/**
 * Sends a 6-digit OTP code to the provided email address.
 * Falls back to console.log if SMTP credentials are not configured.
 */
const sendOTP = async (email, otpCode) => {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_APP_PASSWORD) {
        console.log(`\n\n======================================================`);
        console.log(`✉️ [DEVELOPMENT MODE] EMAIL SIMULATION`);
        console.log(`To: ${email}`);
        console.log(`Your CandyCloud verification code is: ${otpCode}`);
        console.log(`======================================================\n\n`);
        return true;
    }

    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: `"CandyCloud Pakistan" <${process.env.SMTP_EMAIL}>`,
            to: email,
            subject: "Your CandyCloud Verification Code 🍬",
            html: `
                <div style="font-family: Arial, sans-serif; text-align: center; padding: 40px; background-color: #fdf7fb; border-radius: 20px;">
                    <div style="font-size: 50px; margin-bottom: 20px;">🍭</div>
                    <h1 style="color: #ec4899; margin-bottom: 10px;">Welcome to CandyCloud!</h1>
                    <p style="color: #4b5563; font-size: 16px; margin-bottom: 30px;">
                        We're so excited for you to join our sweet community. Please use the verification code below to complete your registration.
                    </p>
                    <div style="background-color: white; padding: 20px; border-radius: 15px; border: 2px dashed #fbcfe8; display: inline-block; margin-bottom: 30px;">
                        <h2 style="font-size: 32px; letter-spacing: 8px; color: #111827; margin: 0;">${otpCode}</h2>
                    </div>
                    <p style="color: #9ca3af; font-size: 14px;">
                        This code will expire in 5 minutes. If you did not request this, please ignore this email.
                    </p>
                </div>
            `,
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error("Error sending OTP email: ", error);
        throw new Error("Could not send verification email. Please try again later.");
    }
};

/**
 * Notifies the store Gmail account when a customer places an order.
 */
export const sendOrderNotification = async (order) => {
    const transporter = createTransporter();
    if (!transporter) {
        console.warn("Order email skipped: SMTP credentials are not configured");
        return false;
    }

    const customerName = `${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`;
    const itemRows = order.items.map((item) => `
        <tr>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3e8ef;">${item.name}</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3e8ef; text-align: center;">${item.quantity}</td>
            <td style="padding: 8px 0; border-bottom: 1px solid #f3e8ef; text-align: right;">Rs ${Number(item.price * item.quantity).toLocaleString()}</td>
        </tr>
    `).join("");

    try {
        const info = await transporter.sendMail({
            from: `"CandyCloud Pakistan" <${process.env.SMTP_EMAIL}>`,
            to: process.env.SMTP_EMAIL,
            subject: `New order ${order.orderNumber} - Rs ${Number(order.total).toLocaleString()}`,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 640px; margin: 0 auto; color: #1f2937;">
                    <h1 style="color: #ec4899;">New order received</h1>
                    <p><strong>Order:</strong> ${order.orderNumber}</p>
                    <p><strong>Customer:</strong> ${customerName}</p>
                    <p><strong>Payment:</strong> ${order.paymentMethod}</p>
                    <p><strong>Shipping:</strong> ${order.shippingMethod}</p>
                    <h2>Items</h2>
                    <table style="width: 100%; border-collapse: collapse;">
                        <thead><tr><th style="text-align: left;">Product</th><th>Qty</th><th style="text-align: right;">Amount</th></tr></thead>
                        <tbody>${itemRows}</tbody>
                    </table>
                    <p style="text-align: right; font-size: 18px;"><strong>Total: Rs ${Number(order.total).toLocaleString()}</strong></p>
                    <h2>Delivery address</h2>
                    <p>${order.shippingAddress.address}<br>${order.shippingAddress.city}, ${order.shippingAddress.zipCode}</p>
                </div>
            `,
        });

        console.log(`Order notification sent: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error("Error sending order notification email: ", error);
        return false;
    }
};

export default sendOTP;
