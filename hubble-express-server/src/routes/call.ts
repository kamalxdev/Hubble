import { Router } from "express";

import { authorizationHeader } from "../middleware/user";
import { getUserCallHistory } from "../controllers/call";

const router = Router();

// authorization header middleware
router.use(authorizationHeader)
// routes configuration

router.get('/history',getUserCallHistory)



// export default router;
module.exports = router;
