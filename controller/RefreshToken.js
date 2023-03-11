import Users from "../models/userModel.js";
import jwt from "jsonwebtoken";

export const refreshToken = async(req, res) => {
    try {
        const refreshTokens = req.cookies.refreshToken;
        if(!refreshTokens) return res.senStatus(401);
        const user = await Users.findAll({
            where:{
                refresh_token: refreshTokens
            }
        });
        if(!user[0]) return res.sendStatus(403);
        jwt.verify(refreshTokens, process.env.REFRESH_TOKEN_SECRET, (err, decoded) => {
            if(err) return res.sendStatus(403);
            const userId = user[0].id;
            const username = user[0].username;
            const email = user[0].email;
            const accessToken = jwt.sign({userId, username, email}, process.env.ACCESS_TOKEN_SECRET, {
                expiresIn: '15s'
            });
            res.json({ accessToken })
        })
    } catch (error) {
        console.log(error)
    }
}