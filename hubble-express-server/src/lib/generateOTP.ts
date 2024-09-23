import { client } from "../redis";
import { sendEmail } from "../utils/nodemailer";

function generateOTP() {
  const characters = "0123456789";
  const randomOTP = Array.from(
    { length: 7 },
    () => characters[Math.floor(Math.random() * characters.length)]
  ).join("");
  return randomOTP;
}

// it sends email with otp and stores otp in redis
export default async function sendEmailWithOTP(email: string,subject:string,title:string) {
  try {

    const otp = generateOTP();
    const store_otp_on_redis = await client.set(`OTP:${email}`, otp);
    if (store_otp_on_redis != "OK") {
      return { success: false, error: "Failed to generate OTP" }
    }
    const get_stored_otp_from_redis = await client.get(`OTP:${email}`);

    const mail = await sendEmail(
      email,
      subject,
      title,
      get_stored_otp_from_redis
    );
    if (!mail.success) {
      return { success: false, error: "Error in sending mail" }
    }
    return { success: true, message: "OTP sent successfully" }
  } catch (error) {
    console.log("Error in generating OTP and sending mail: ",error);
    return { success: true, error: "Internal server error" }
  }
}
