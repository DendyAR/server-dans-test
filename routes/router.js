import express from "express";
import { Login, Logout } from "../controller/Auth.js";
import { refreshToken } from "../controller/RefreshToken.js";
import { getUsers, userRegister } from "../controller/UserController.js";
import { verifyToken } from "../middleware/verifyToken.js";


const router = express.Router();

router.get('/users', verifyToken, getUsers);
router.post('/users/register', userRegister);
router.post('/login', Login);
router.get('/token', refreshToken);
router.delete('/logout', Logout);


export default router;