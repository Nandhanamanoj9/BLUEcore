import nodemailer from 'nodemailer';

export async function sendQuoteNotification(quote) {
  const isEnabled = process.env.EMAIL_ENABLED === 'true';
  const adminEmail = process.env.ADMIN_EMAIL || 'blucorenc@gmail.com';

  if (!isEnabled) {
    return { success: false, reason: 'Email notifications disabled (EMAIL_ENABLED=false)' };
  }

  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST || 'smtp.gmail.com',
      port: Number(process.env.EMAIL_PORT) || 587,
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    const fileDetails = quote.referenceFile
      ? `<p><strong>Reference File:</strong> <a href="${quote.referenceFile.fileUrl}">${quote.referenceFile.originalName}</a> (${quote.referenceFile.contentType})</p>`
      : '<p><strong>Reference File:</strong> None uploaded</p>';

    const html = `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #18150F; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 24px; border-radius: 4px;">
        <h2 style="color: #A87C3F; margin-top: 0;">New Quote Request — BLU CORE</h2>
        <p>A new quote request has been submitted through the BLU CORE website.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
        
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="padding: 6px 0; width: 160px;"><strong>Full Name:</strong></td><td>${quote.fullName || 'N/A'}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Phone:</strong></td><td><a href="tel:${quote.phone}">${quote.phone || 'N/A'}</a></td></tr>
          <tr><td style="padding: 6px 0;"><strong>Email:</strong></td><td><a href="mailto:${quote.email}">${quote.email || 'N/A'}</a></td></tr>
          <tr><td style="padding: 6px 0;"><strong>Service Required:</strong></td><td>${quote.serviceRequired || 'N/A'}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Material:</strong></td><td>${quote.material || 'N/A'}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Project Type:</strong></td><td>${quote.projectType || 'N/A'}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Branch / Location:</strong></td><td>${quote.location || 'N/A'}</td></tr>
          <tr><td style="padding: 6px 0;"><strong>Requirements:</strong></td><td>${quote.approximateRequirements || 'N/A'}</td></tr>
        </table>

        ${fileDetails}

        <div style="background: #f9f9f9; padding: 14px; border-left: 3px solid #A87C3F; margin: 20px 0;">
          <strong>Message:</strong>
          <p style="margin: 8px 0 0 0;">${quote.message || 'No additional message provided.'}</p>
        </div>

        <p style="font-size: 12px; color: #888; margin-top: 24px;">
          Quote ID: ${quote.id || 'N/A'} · Received at: ${new Date().toLocaleString()}
        </p>
      </div>
    `;

    const info = await transporter.sendMail({
      from: process.env.EMAIL_FROM || '"BLU CORE Website" <noreply@blucoredesign.com>',
      to: adminEmail,
      subject: `New Quote Request: ${quote.fullName} - ${quote.serviceRequired}`,
      html
    });

    console.log(`[Email] Notification sent for quote ${quote.id}: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('[Email] Failed to send quote notification:', error.message);
    // Never throw - database record must remain intact!
    return { success: false, error: error.message };
  }
}

export default {
  sendQuoteNotification
};
