import nodemailer from 'nodemailer';
import handlebars from 'handlebars';

// Create reusable transporter
const createTransporter = () => {
    // For development, use a test account or configure with real SMTP
    // In production, use environment variables for SMTP configuration
    return nodemailer.createTransport({
        host: process.env.SMTP_HOST || 'smtp.gmail.com',
        port: parseInt(process.env.SMTP_PORT || '587'),
        secure: false, // true for 465, false for other ports
        auth: {
            user: process.env.SMTP_USER,
            pass: process.env.SMTP_PASS,
        },
    });
};

interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

// Send email function
export const sendEmail = async (options: EmailOptions): Promise<void> => {
    try {
        // Skip sending if SMTP credentials are not configured
        if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
            console.log('Email not sent - SMTP credentials not configured');
            console.log('Email details:', { to: options.to, subject: options.subject });
            return;
        }

        const transporter = createTransporter();

        const mailOptions = {
            from: `Support Desk <${process.env.SMTP_USER}>`,
            to: options.to,
            subject: options.subject,
            html: options.html,
        };

        await transporter.sendMail(mailOptions);
        console.log(`Email sent to ${options.to}`);
    } catch (error) {
        console.error('Error sending email:', error);
        // Don't throw error - we don't want email failures to break the app
    }
};

// Email templates
export const emailTemplates = {
    ticketAssigned: (ticketId: string, ticketTitle: string, agentName: string) => {
        const template = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Ticket Assigned</h2>
                <p>Hello,</p>
                <p>A ticket has been assigned to you:</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Ticket ID:</strong> #{{ticketId}}</p>
                    <p><strong>Title:</strong> {{ticketTitle}}</p>
                </div>
                <p>Please review and respond to this ticket at your earliest convenience.</p>
                <p>Best regards,<br>Support Desk Team</p>
            </div>
        `;
        const compiled = handlebars.compile(template);
        return compiled({ ticketId, ticketTitle });
    },

    ticketReply: (ticketId: string, ticketTitle: string, replyAuthor: string, replyContent: string) => {
        const template = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">New Reply on Your Ticket</h2>
                <p>Hello,</p>
                <p>There's a new reply on your ticket:</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Ticket ID:</strong> #{{ticketId}}</p>
                    <p><strong>Title:</strong> {{ticketTitle}}</p>
                    <p><strong>From:</strong> {{replyAuthor}}</p>
                    <hr style="border: none; border-top: 1px solid #d1d5db; margin: 10px 0;">
                    <p>{{replyContent}}</p>
                </div>
                <p>Please log in to view and respond.</p>
                <p>Best regards,<br>Support Desk Team</p>
            </div>
        `;
        const compiled = handlebars.compile(template);
        return compiled({ ticketId, ticketTitle, replyAuthor, replyContent });
    },

    ticketClosed: (ticketId: string, ticketTitle: string) => {
        const template = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #dc2626;">Ticket Closed</h2>
                <p>Hello,</p>
                <p>Your ticket has been closed:</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Ticket ID:</strong> #{{ticketId}}</p>
                    <p><strong>Title:</strong> {{ticketTitle}}</p>
                </div>
                <p>If you need further assistance, please create a new ticket.</p>
                <p>Best regards,<br>Support Desk Team</p>
            </div>
        `;
        const compiled = handlebars.compile(template);
        return compiled({ ticketId, ticketTitle });
    },

    ticketUpdated: (ticketId: string, ticketTitle: string, updateDetails: string) => {
        const template = `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h2 style="color: #2563eb;">Ticket Updated</h2>
                <p>Hello,</p>
                <p>Your ticket has been updated:</p>
                <div style="background-color: #f3f4f6; padding: 15px; border-radius: 5px; margin: 20px 0;">
                    <p><strong>Ticket ID:</strong> #{{ticketId}}</p>
                    <p><strong>Title:</strong> {{ticketTitle}}</p>
                    <p><strong>Update:</strong> {{updateDetails}}</p>
                </div>
                <p>Please log in to view the details.</p>
                <p>Best regards,<br>Support Desk Team</p>
            </div>
        `;
        const compiled = handlebars.compile(template);
        return compiled({ ticketId, ticketTitle, updateDetails });
    },
};
