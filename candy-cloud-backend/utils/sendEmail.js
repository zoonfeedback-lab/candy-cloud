const nodemailer = require("nodemailer");

/**
 * Sends a 6-digit OTP code to the provided email address.
 * Falls back to console.log if SMTP credentials are not configured in .env.
 */
const sendOTP = async (email, otpCode) => {
    // If credentials aren't provided yet, gracefully simulate the email in the console for development
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_APP_PASSWORD) {
        console.log(`\n\n======================================================`);
        console.log(`✉️ [DEVELOPMENT MODE] EMAIL SIMULATION`);
        console.log(`To: ${email}`);
        console.log(`Your CandyCloud verification code is: ${otpCode}`);
        console.log(`======================================================\n\n`);
        return true;
    }

    try {
        const transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_APP_PASSWORD
            }
        });

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
            `
        };

        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        return true;

    } catch (error) {
        console.error("Error sending OTP email: ", error);
        throw new Error("Could not send verification email. Please try again later.");
    }
};

module.exports = sendOTP;
