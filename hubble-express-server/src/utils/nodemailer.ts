import nodemailer from "nodemailer";



const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_SMTP,
  port: parseInt(process.env.EMAIL_PORT as string),
  secure: true,
  auth: {
    user: process.env.EMAIL_ID,
    pass: process.env.EMAIL_PASSWORD,
  },
});

export async function sendEmail(
  to: string,
  subject: string,
  text: string,
  otp:any
) {
  try {
    const info = await transporter.sendMail({
      from: `"Hubble" <${process.env.EMAIL_ID}>`,
      to,
      subject,
      text,
      html:`
<body style="margin: 0; padding: 0; background-color: #f4f7fa;">
  <table width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color: #f4f7fa; padding: 20px 0;">
    <tr>
      <td align="center">
        <table cellpadding="0" cellspacing="0" width="100%" border="0" style="max-width: 600px; background-color: #ffffff; border-radius: 10px; box-shadow: 0 8px 30px rgba(0, 0, 0, 0.1); padding: 20px;">
          <tr>
            <td align="center" style="padding: 10px;">
              <h1 style="font-size: 22px; font-family: Arial, sans-serif; color: #333333; margin: 0; padding-bottom: 10px;">OTP Verification</h1>
              <p style="font-size: 16px; font-family: Arial, sans-serif; color: #555555; margin: 0 0 20px;">We have sent a One-Time Password (OTP) to your registered email. Enter the code below to verify your identity:</p>

              <div style="font-size: 24px; font-family: Arial, sans-serif; letter-spacing: 4px; color: #007bff; background-color: #f4f7fa; border: 1px dashed #007bff; border-radius: 5px; padding: 10px; display: inline-block;">
                ${otp}
              </div>

              <p style="font-size: 12px; font-family: Arial, sans-serif; color: #777777; margin-top: 20px;">If you did not request this, please ignore this message.</p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>

      `,
    });
    return { success: true, info };
  } catch (error) {
    console.log("Error on sending email: ", error);
    return { success: false, error: "Error on sending message" };
  }
}
