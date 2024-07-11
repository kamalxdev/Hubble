import { Router } from "express";

import { authorizationHeader } from "../middleware/user";
import { getAllChats, getChats } from "../controllers/chat";

const router = Router();

// authorization header middleware
router.use(authorizationHeader)
// routes configuration

router.get('/',getChats)
router.get('/all',getAllChats)



// export default router;
module.exports = router;
