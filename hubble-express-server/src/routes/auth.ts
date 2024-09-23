import { Router } from "express";
import { postLogin, postRegister, postSendOTP, postValidateOTP } from "../controllers/auth";


const router = Router();

router.post("/login", postLogin);
router.post("/register", postRegister);
router.post("/send-otp",postSendOTP)
router.post("/validate-otp",postValidateOTP)

// export default router;
module.exports = router
