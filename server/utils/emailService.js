import nodemailer from 'nodemailer';

// Create reusable transporter
const createTransporter = () => {
    // For development: Use Gmail SMTP
    // For production: Use SendGrid, AWS SES, or other service

    if (process.env.EMAIL_SERVICE === 'gmail') {
        return nodemailer.createTransporter({
            service: 'gmail',
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASSWORD // App-specific password
            }
        });
    }

    // Default: Use SMTP configuration
    return nodemailer.createTransporter({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: process.env.SMTP_PORT || 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASSWORD
        }
    });
};

/**
 * Send password reset email
 */
export const sendPasswordResetEmail = async (email, resetToken, username) => {
    try {
        const transporter = createTransporter();

        const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

        const mailOptions = {
            from: process.env.EMAIL_FROM || `"Chat App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Reset Request - Chat App',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #0084ff 0%, #8b5cf6 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .button { display: inline-block; padding: 12px 30px; background: #0084ff; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>Password Reset Request</h1>
                        </div>
                        <div class="content">
                            <p>Hi <strong>${username}</strong>,</p>
                            <p>You requested to reset your password for your Chat App account.</p>
                            <p>Click the button below to reset your password:</p>
                            <p style="text-align: center;">
                                <a href="${resetUrl}" class="button">Reset Password</a>
                            </p>
                            <p>Or copy and paste this link into your browser:</p>
                            <p style="word-break: break-all; color: #0084ff;">${resetUrl}</p>
                            <p><strong>This link will expire in 1 hour.</strong></p>
                            <p>If you didn't request this password reset, please ignore this email. Your password will remain unchanged.</p>
                            <p>Thanks,<br>Chat App Team</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Password reset email sent to:', email);
        return { success: true };
    } catch (error) {
        console.error('❌ Email sending error:', error);
        throw new Error('Failed to send password reset email');
    }
};

/**
 * Send password reset confirmation email
 */
export const sendPasswordResetConfirmation = async (email, username) => {
    try {
        const transporter = createTransporter();

        const mailOptions = {
            from: process.env.EMAIL_FROM || `"Chat App" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Password Successfully Reset - Chat App',
            html: `
                <!DOCTYPE html>
                <html>
                <head>
                    <style>
                        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
                        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
                        .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
                        .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
                        .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <h1>✓ Password Reset Successful</h1>
                        </div>
                        <div class="content">
                            <p>Hi <strong>${username}</strong>,</p>
                            <p>Your password has been successfully reset.</p>
                            <p>You can now log in to your Chat App account with your new password.</p>
                            <p>If you didn't make this change, please contact support immediately.</p>
                            <p>Thanks,<br>Chat App Team</p>
                        </div>
                        <div class="footer">
                            <p>This is an automated email. Please do not reply.</p>
                        </div>
                    </div>
                </body>
                </html>
            `
        };

        await transporter.sendMail(mailOptions);
        console.log('✅ Password reset confirmation sent to:', email);
        return { success: true };
    } catch (error) {
        console.error('❌ Email sending error:', error);
        // Don't throw error for confirmation email
        return { success: false };
    }
};
