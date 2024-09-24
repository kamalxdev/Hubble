import { Router } from "express";
import {
  getLogOut,
  getUser,
  getUserFriends,
  getUserSearchResult,
  getUsersinBulk,
  getUserVerification,
  postUpdatedProfiledata,
  postUpdatedAvatar,
} from "../controllers/user";
import { authorizationHeader } from "../middleware/user";
import multer from 'multer'

const router = Router();

// multer configuration
const uploader=multer({
  storage:multer.diskStorage({})
})



// authorization header middleware
router.use(authorizationHeader)
// routes configuration
router.get("/", getUser);
router.get("/bulk", getUsersinBulk);
router.get("/verify", getUserVerification);
router.get("/logout",getLogOut)
router.get("/search", getUserSearchResult);
router.get('/friends',getUserFriends)
router.post('/profile',postUpdatedProfiledata)
router.post('/avatar',uploader.single('avatar'),postUpdatedAvatar)



module.exports = router;
