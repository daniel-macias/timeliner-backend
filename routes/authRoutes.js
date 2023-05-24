const { register, login, getUserIdByEmail } = require("../controllers/authControllers");
const { checkUser } = require("../middlewares/authMiddleware");

const router = require("express").Router();

router.post("/", checkUser); 
router.post("/register", register);
router.post("/login", login);
router.get("/user", getUserIdByEmail);
    

module.exports = router;
