import { Router } from "express";
import { postLogin, postRegister } from "../controllers/auth";


const router = Router();

router.post("/login", postLogin);
router.post("/register", postRegister);

// export default router;
module.exports = router
