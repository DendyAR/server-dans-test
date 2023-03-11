import Users from "../models/userModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";


export const Login = async (req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                username: req.body.username
            }
        })
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "wrong password..!!"});
        const userId = user[0].id
        const username = user[0].username
        const email = user[0].email
        const accessToken = jwt.sign({userId, username, email}, process.env.ACCESS_TOKEN_SECRET, {
            expiresIn: '30s',
        })
        const refreshToken = jwt.sign({userId, username, email}, process.env.REFRESH_TOKEN_SECRET, {
            expiresIn: '1d',
        })

        await Users.update({refresh_token: refreshToken}, {
            where:{
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken, {
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000,
            secure: true
        });
        res.json({ accessToken })
    } catch (error) {
        res.status(404).json({msg:"Username / Email tidak di temukan"})
    }
}

export const Logout = async (req, res) => {
    const refreshTokens = req.cookies.refreshToken;
        if(!refreshTokens) return res.senStatus(204);
        const user = await Users.findAll({
            where:{
                refresh_token: refreshTokens
            }
        });
        if(!user[0]) return res.sendStatus(204);
        const userId = user[0].id;
        await Users.update({refresh_token: null}, {
            where:{
                id:userId
            }
        });
        res.clearCookie('refreshToken');
        return res.sendStatus(200)
}