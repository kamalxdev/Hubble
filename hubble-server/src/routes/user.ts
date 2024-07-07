import { Router } from "express";
import {
  getUser,
  getUsersinBulk,
  getUserVerification,
} from "../controllers/user";
import { authorizationHeader } from "../middleware/user";

const router = Router();

// authorization header middleware
router.use(authorizationHeader)
// routes configuration
router.get("/", getUser);
router.get("/bulk", getUsersinBulk);
router.get("/verify", getUserVerification);

// export default router;
module.exports = router;
