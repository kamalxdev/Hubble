import { Router } from "express";
import {
  getUser,
  getUserFriends,
  getUserSearchResult,
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
router.get("/search", getUserSearchResult);
router.get('/friends',getUserFriends)


module.exports = router;
